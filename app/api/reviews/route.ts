import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import { getUserIdBySessionToken } from '@/lib/server/sessions'

type ReviewRecord = {
  id: number
  target_user_id: number
  author_user_id: number
  rating: number
  comment: string
  match_id?: number
  createdAt: string
}

type MatchRecord = {
  model_user_id: number
  client_user_id: number
  status?: 'matched' | 'completed' | 'cancelled'
}

const redis = Redis.fromEnv()
const REVIEWS_KEY = 'reviews'
const USERS_KEY = 'users'
const MATCHES_KEY = 'matches'

async function getSessionUserId(req: Request): Promise<number | null> {
  const header = req.headers.get('authorization')
  if (!header || !header.startsWith('Bearer ')) return null
  const token = header.slice('Bearer '.length)
  try {
    return await getUserIdBySessionToken(token)
  } catch (e) {
    console.error('Failed to read session token', e)
    return null
  }
}

async function updateMetricsForUser(userId: number) {
  const matches = ((await redis.get<MatchRecord[]>(MATCHES_KEY)) ?? []) as MatchRecord[]
  const reviews = ((await redis.get<ReviewRecord[]>(REVIEWS_KEY)) ?? []) as ReviewRecord[]

  const matchCount = matches.filter(
    match =>
      (match.model_user_id === userId || match.client_user_id === userId) &&
      match.status === 'completed',
  ).length
  const userReviews = reviews.filter(r => r.target_user_id === userId)
  const reviewCount = userReviews.length
  const averageRating =
    reviewCount === 0
      ? 0
      : Math.round((userReviews.reduce((s, it) => s + (it.rating ?? 0), 0) / reviewCount) * 10) / 10

  try {
    const users = ((await redis.get<any[]>(USERS_KEY)) ?? []) as any[]
    const idx = users.findIndex(u => u.id === userId)
    if (idx !== -1) {
      users[idx].metrics = {
        dynamic_match_count: matchCount,
        dynamic_review_count: reviewCount,
        dynamic_review_rating: averageRating,
      }
      await redis.set(USERS_KEY, users)
    }
  } catch (e) {
    console.error('Failed to update user metrics', e)
  }
  return { dynamic_match_count: matchCount, dynamic_review_count: reviewCount, dynamic_review_rating: averageRating }
}

export async function GET() {
  const reviews = ((await redis.get<ReviewRecord[]>(REVIEWS_KEY)) ?? []) as ReviewRecord[]
  return NextResponse.json(reviews)
}

export async function POST(req: Request) {
  try {
    const sessionUserId = await getSessionUserId(req)
    if (!sessionUserId) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

    const body = (await req.json()) as Partial<ReviewRecord>
    if (!body.target_user_id || typeof body.rating === 'undefined') {
      return NextResponse.json({ ok: false, error: 'target_user_id and rating are required' }, { status: 400 })
    }
    // validate users and roles
    const users = ((await redis.get<any[]>(USERS_KEY)) ?? []) as any[]
    const author = users.find(u => u.id === sessionUserId)
    const targetUser = users.find(u => u.id === body.target_user_id)
    if (!author || !targetUser) {
      return NextResponse.json({ ok: false, error: 'user_not_found' }, { status: 404 })
    }
    if (author.role === targetUser.role) {
      return NextResponse.json({ ok: false, error: 'role_mismatch' }, { status: 400 })
    }
    // prevent duplicate review from same author to same target
    const existingReview = ((await redis.get<ReviewRecord[]>(REVIEWS_KEY)) ?? []) as ReviewRecord[]
    if (existingReview.find(r => r.author_user_id === sessionUserId && r.target_user_id === body.target_user_id)) {
      return NextResponse.json({ ok: false, error: 'duplicate_review' }, { status: 400 })
    }
    if (body.rating! < 1 || body.rating! > 5) {
      return NextResponse.json({ ok: false, error: 'rating must be between 1 and 5' }, { status: 400 })
    }
    const reviews = existingReview
    const review: ReviewRecord = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      target_user_id: body.target_user_id,
      author_user_id: sessionUserId,
      rating: body.rating!,
      comment: body.comment ?? '',
      match_id: body.match_id,
    }

    reviews.push(review)
    await redis.set(REVIEWS_KEY, reviews)

    // update metrics for target user
    await updateMetricsForUser(review.target_user_id)

    return NextResponse.json({ ok: true, review })
  } catch (error) {
    console.error('Review creation failed', error)
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const sessionUserId = await getSessionUserId(req)
    if (!sessionUserId) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

    const body = (await req.json()) as Partial<ReviewRecord> & { id?: number }
    if (!body.id) return NextResponse.json({ ok: false, error: 'id is required' }, { status: 400 })

    const reviews = ((await redis.get<ReviewRecord[]>(REVIEWS_KEY)) ?? []) as ReviewRecord[]
    const idx = reviews.findIndex(r => r.id === body.id)
    if (idx === -1) return NextResponse.json({ ok: false, error: 'review not found' }, { status: 404 })

    const existing = reviews[idx]
    if (existing.author_user_id !== sessionUserId) {
      return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 })
    }

    if (typeof body.rating !== 'undefined') {
      if (body.rating! < 1 || body.rating! > 5) {
        return NextResponse.json({ ok: false, error: 'rating must be between 1 and 5' }, { status: 400 })
      }
      existing.rating = body.rating!
    }
    if (typeof body.comment !== 'undefined') existing.comment = body.comment

    reviews[idx] = existing
    await redis.set(REVIEWS_KEY, reviews)

    await updateMetricsForUser(existing.target_user_id)

    return NextResponse.json({ ok: true, review: existing })
  } catch (e) {
    console.error('Review update failed', e)
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const sessionUserId = await getSessionUserId(req)
    if (!sessionUserId) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

    const body = (await req.json()) as { id?: number }
    if (!body?.id) return NextResponse.json({ ok: false, error: 'id is required' }, { status: 400 })

    const reviews = ((await redis.get<ReviewRecord[]>(REVIEWS_KEY)) ?? []) as ReviewRecord[]
    const idx = reviews.findIndex(r => r.id === body.id)
    if (idx === -1) return NextResponse.json({ ok: false, error: 'review not found' }, { status: 404 })

    const existing = reviews[idx]
    if (existing.author_user_id !== sessionUserId) return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 })

    reviews.splice(idx, 1)
    await redis.set(REVIEWS_KEY, reviews)

    await updateMetricsForUser(existing.target_user_id)

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Review deletion failed', e)
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 })
  }
}
