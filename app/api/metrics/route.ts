import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

type MatchRecord = {
  id: number
  job_id: number
  model_user_id: number
  client_user_id: number
  status: 'matched' | 'completed' | 'cancelled'
  createdAt: string
}

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
const MATCHES_KEY = 'matches'
const REVIEWS_KEY = 'reviews'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userIdParam = searchParams.get('userId')
  const userId = userIdParam ? Number(userIdParam) : NaN

  if (!userIdParam || Number.isNaN(userId)) {
    return NextResponse.json(
      { ok: false, error: 'userId query param is required' },
      { status: 400 },
    )
  }

  const matches = ((await redis.get<MatchRecord[]>(MATCHES_KEY)) ?? []) as MatchRecord[]
  const reviews = ((await redis.get<ReviewRecord[]>(REVIEWS_KEY)) ?? []) as ReviewRecord[]

  const matchCount = matches.filter(
    match =>
      (match.model_user_id === userId || match.client_user_id === userId) &&
      match.status === 'completed',
  ).length
  const userReviews = reviews.filter(review => review.target_user_id === userId)
  const reviewCount = userReviews.length
  const averageRating =
    reviewCount === 0
      ? 0
      : Math.round(
          (userReviews.reduce((sum, item) => sum + (item.rating ?? 0), 0) / reviewCount) * 10,
        ) / 10

  return NextResponse.json({
    dynamic_match_count: matchCount,
    dynamic_review_count: reviewCount,
    dynamic_review_rating: averageRating,
  })
}
