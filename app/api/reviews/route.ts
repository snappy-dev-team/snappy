import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

type ReviewRecord = {
  id: number
  target_user_id: number
  author_user_id: number
  rating: number
  comment: string
  match_id?: number
  createdAt: string
}

const redis = Redis.fromEnv()
const REVIEWS_KEY = 'reviews'

export async function GET() {
  const reviews = ((await redis.get<ReviewRecord[]>(REVIEWS_KEY)) ?? []) as ReviewRecord[]
  return NextResponse.json(reviews)
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<ReviewRecord>
    if (!body.target_user_id || !body.author_user_id || typeof body.rating === 'undefined') {
      return NextResponse.json({ ok: false, error: 'target_user_id, author_user_id, rating are required' }, { status: 400 })
    }
    if (body.rating! < 1 || body.rating! > 5) {
      return NextResponse.json({ ok: false, error: 'rating must be between 1 and 5' }, { status: 400 })
    }

    const reviews = ((await redis.get<ReviewRecord[]>(REVIEWS_KEY)) ?? []) as ReviewRecord[]
    const review: ReviewRecord = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      target_user_id: body.target_user_id,
      author_user_id: body.author_user_id,
      rating: body.rating,
      comment: body.comment ?? '',
      match_id: body.match_id,
    }

    reviews.push(review)
    await redis.set(REVIEWS_KEY, reviews)
    return NextResponse.json({ ok: true, review })
  } catch (error) {
    console.error('Review creation failed', error)
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 })
  }
}
