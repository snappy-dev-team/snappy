import { createHash } from 'crypto'
import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

type StoredUser = {
  id: number
  createdAt: string
  name: string
  email: string
  passwordHash: string
  age?: number
  profile?: string
  role?: 'model' | 'client'
  image?: string
}

type LoginPayload = {
  email?: string
  password?: string
  role?: 'model' | 'client'
}

const redis = Redis.fromEnv()
const USERS_KEY = 'users'

const hashPassword = (password: string) => createHash('sha256').update(password).digest('hex')

const sanitizeUser = (user: StoredUser) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...rest } = user
  return rest
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LoginPayload
    if (!body.email || !body.password) {
      return NextResponse.json({ ok: false, error: 'email and password are required' }, { status: 400 })
    }

    const users = ((await redis.get<StoredUser[]>(USERS_KEY)) ?? []) as StoredUser[]
    const normalizedEmail = body.email.trim().toLowerCase()
    const user = users.find(
      item =>
        item.email?.trim().toLowerCase() === normalizedEmail &&
        (body.role ? item.role === body.role : true),
    )

    if (!user || !user.passwordHash || user.passwordHash !== hashPassword(body.password)) {
      return NextResponse.json({ ok: false, error: 'invalid_credentials' }, { status: 401 })
    }

    return NextResponse.json({ ok: true, user: sanitizeUser(user) })
  } catch (error) {
    console.error('Login failed', error)
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 })
  }
}
