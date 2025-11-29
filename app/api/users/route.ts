import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

type UserPayload = {
  name: string
  email: string
  age?: number
  profile?: string
  role?: 'model' | 'client'
  image?: string
}

type StoredUser = UserPayload & { id: number; createdAt: string }

const redis = Redis.fromEnv()
const USERS_KEY = 'users'

export async function GET() {
  const users = ((await redis.get<StoredUser[]>(USERS_KEY)) ?? []) as StoredUser[]
  return NextResponse.json(users)
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<UserPayload>
    if (!body.name || !body.email) {
      return NextResponse.json({ ok: false, error: 'name and email are required' }, { status: 400 })
    }

    const users = ((await redis.get<StoredUser[]>(USERS_KEY)) ?? []) as StoredUser[]
    const user: StoredUser = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      name: body.name,
      email: body.email,
      age: body.age,
      profile: body.profile ?? '',
      role: body.role,
      image: body.image,
    }

    users.push(user)
    await redis.set(USERS_KEY, users)

    return NextResponse.json({ ok: true, user })
  } catch (error) {
    console.error('User creation failed', error)
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 })
  }
}
