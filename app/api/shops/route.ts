import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

type StoredUser = {
  id: number | string
  name: string
  email?: string
  age?: number
  profile?: string
  role?: 'model' | 'client'
  image?: string
  location?: string
  reward?: string
  timeframe?: string
  rating?: number
}

const redis = Redis.fromEnv()
const USERS_KEY = 'users'

export async function GET() {
  try {
    const users = ((await redis.get<StoredUser[]>(USERS_KEY)) ?? []) as StoredUser[]
    const shops = users.filter((u) => u.role === 'client')
    return NextResponse.json(shops, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    })
  } catch (error) {
    console.error('Shops fetch failed', error)
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 })
  }
}
