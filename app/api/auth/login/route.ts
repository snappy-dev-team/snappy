import { createHash, randomBytes } from 'crypto'
import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

type StoredUser = {
  id: number
  createdAt: string
  role?: 'model' | 'client'
  email?: string
  passwordHash?: string
  model_signup_name?: string
  model_signup_email?: string
  model_signup_birthdate?: string
  model_signup_address?: string
  client_type?: 'individual' | 'corporation'
  client_company_or_personal_name?: string
  client_contact_name?: string
  client_contact_gender?: 'male' | 'female' | 'other'
  client_address?: string
  client_email?: string
  client_phone?: string
  client_student_plan?: boolean
  client_student_id_image?: string
  student_account_status?: 'pending' | 'approved' | 'rejected'
  model_profile?: Record<string, unknown>
  client_profile?: Record<string, unknown>
}

type LoginPayload = {
  email?: string
  password?: string
  role?: 'model' | 'client'
}

const redis = Redis.fromEnv()
const USERS_KEY = 'users'
const SESSION_PREFIX = 'session:'

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
        (item.email?.trim().toLowerCase() === normalizedEmail ||
          item.model_signup_email?.trim().toLowerCase() === normalizedEmail ||
          item.client_email?.trim().toLowerCase() === normalizedEmail) &&
        (body.role ? item.role === body.role : true),
    )

    if (!user || !user.passwordHash || user.passwordHash !== hashPassword(body.password)) {
      return NextResponse.json({ ok: false, error: 'invalid_credentials' }, { status: 401 })
    }

    // create a simple session token and store mapping to user id
    const token = randomBytes(24).toString('hex')
    await redis.set(`${SESSION_PREFIX}${token}`, String(user.id))

    return NextResponse.json({ ok: true, user: sanitizeUser(user), token })
  } catch (error) {
    console.error('Login failed', error)
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 })
  }
}
