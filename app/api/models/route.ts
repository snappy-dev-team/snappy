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
  rating?: number
  tags?: string[]
}

const redis = Redis.fromEnv()
const USERS_KEY = 'users'

export async function GET() {
  try {
    const users = ((await redis.get<StoredUser[]>(USERS_KEY)) ?? []) as StoredUser[]
    const models = users.filter((u) => u.role === 'model')
    return NextResponse.json(models)
  } catch (error) {
    console.error('Models fetch failed', error)
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 })
  }
}
