import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

type StoredUser = {
  id: number
  role?: 'model' | 'client'
  student_account_status?: 'pending' | 'approved' | 'rejected'
  [key: string]: unknown
}

type Payload = {
  userId: number
  status: 'pending' | 'approved' | 'rejected'
}

const redis = Redis.fromEnv()
const USERS_KEY = 'users'

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload
    if (!body.userId || !body.status) {
      return NextResponse.json({ ok: false, error: 'userId and status are required' }, { status: 400 })
    }

    const users = ((await redis.get<StoredUser[]>(USERS_KEY)) ?? []) as StoredUser[]
    const index = users.findIndex(user => user.id === body.userId)
    if (index === -1) {
      return NextResponse.json({ ok: false, error: 'user not found' }, { status: 404 })
    }

    users[index] = { ...users[index], student_account_status: body.status }
    await redis.set(USERS_KEY, users)

    return NextResponse.json({ ok: true, user: users[index] })
  } catch (error) {
    console.error('Update student status failed', error)
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 })
  }
}
