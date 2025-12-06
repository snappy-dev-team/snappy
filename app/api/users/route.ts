import { createHash } from 'crypto'
import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

type UserPayload = {
  name: string
  email: string
  password: string
  age?: number
  profile?: string
  role?: 'model' | 'client'
  image?: string
}

type StoredUser = Omit<UserPayload, 'password'> & { id: number; createdAt: string; passwordHash: string }

const redis = Redis.fromEnv()
const USERS_KEY = 'users'

const hashPassword = (password: string) => createHash('sha256').update(password).digest('hex')

const sanitizeUser = (user: StoredUser) => {
  // passwordHash should never be returned to the client
  const { passwordHash, ...rest } = user
  return rest
}

export async function GET() {
  const users = ((await redis.get<StoredUser[]>(USERS_KEY)) ?? []) as StoredUser[]
  return NextResponse.json(users.map(sanitizeUser))
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<UserPayload>
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json({ ok: false, error: 'name, email and password are required' }, { status: 400 })
    }

    const users = ((await redis.get<StoredUser[]>(USERS_KEY)) ?? []) as StoredUser[]
    const user: StoredUser = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      name: body.name,
      email: body.email,
      passwordHash: hashPassword(body.password),
      age: body.age,
      profile: body.profile ?? '',
      role: body.role,
      image: body.image,
    }

    users.push(user)
    await redis.set(USERS_KEY, users)

    return NextResponse.json({ ok: true, user: sanitizeUser(user) })
  } catch (error) {
    console.error('User creation failed', error)
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 })
  }
}
