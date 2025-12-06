import { createHash } from 'crypto'
import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

type StoredUser = {
  id: number
  createdAt: string
  role: 'model' | 'client'
  email: string
  passwordHash: string
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

type PatchPayload = {
  id: number
  updates: Partial<StoredUser>
}

type IncomingPayload = Partial<StoredUser> & { model_signup_password?: string; client_password?: string }

const redis = Redis.fromEnv()
const USERS_KEY = 'users'

const hashPassword = (password: string) => createHash('sha256').update(password).digest('hex')

const sanitizeUser = (user: StoredUser) => {
  // passwordHash should never be returned to the client
  const { passwordHash, ...rest } = user
  return rest
}

const buildModelProfile = (body: IncomingPayload) => ({
  model_display_name: body.model_signup_name ?? '',
  model_birthdate: body.model_signup_birthdate ?? '',
  model_gender: '',
  model_activity_area: '',
  model_types: [],
  model_height: '',
  model_bust: '',
  model_waist: '',
  model_hip: '',
  model_shoes_size: '',
  model_body_type: '',
  model_hair_style: '',
  model_main_image: '',
  model_sub_images: [],
  model_job_category: '',
  model_hobbies: '',
  model_ng_conditions: '',
  model_self_intro: '',
  model_achievements: '',
  model_profile_visibility: 'public',
})

const buildClientProfile = (body: IncomingPayload) => ({
  client_display_name: body.client_company_or_personal_name ?? '',
  client_company_or_personal_name: body.client_company_or_personal_name ?? '',
  client_contact_name: body.client_contact_name ?? '',
  client_contact_gender: body.client_contact_gender ?? '',
  client_address: body.client_address ?? '',
  client_phone: body.client_phone ?? '',
  client_student_plan: Boolean(body.client_student_plan),
  client_student_id_image: body.client_student_id_image ?? '',
  student_account_status: body.client_student_plan ? 'pending' : 'approved',
})

export async function GET() {
  const users = ((await redis.get<StoredUser[]>(USERS_KEY)) ?? []) as StoredUser[]
  return NextResponse.json(users.map(sanitizeUser))
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as IncomingPayload
    if (!body.role) {
      return NextResponse.json({ ok: false, error: 'role is required' }, { status: 400 })
    }

    const users = ((await redis.get<StoredUser[]>(USERS_KEY)) ?? []) as StoredUser[]
    if (body.role === 'model') {
      if (!body.model_signup_name || !body.model_signup_email || !body.model_signup_birthdate || !body.model_signup_address || !body.model_signup_password) {
        return NextResponse.json({ ok: false, error: 'model required fields are missing' }, { status: 400 })
      }

      const user: StoredUser = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        role: 'model',
        name: body.model_signup_name,
        email: body.model_signup_email,
        model_signup_name: body.model_signup_name,
        model_signup_email: body.model_signup_email,
        model_signup_birthdate: body.model_signup_birthdate,
        model_signup_address: body.model_signup_address,
        passwordHash: hashPassword(body.model_signup_password),
        model_profile: buildModelProfile(body),
      }

      users.push(user)
      await redis.set(USERS_KEY, users)
      return NextResponse.json({ ok: true, user: sanitizeUser(user) })
    }

    if (!body.client_type || !body.client_company_or_personal_name || !body.client_contact_name || !body.client_contact_gender || !body.client_email || !body.client_address || !body.client_password) {
      return NextResponse.json({ ok: false, error: 'client required fields are missing' }, { status: 400 })
    }

    const user: StoredUser = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      role: 'client',
      name: body.client_company_or_personal_name,
      email: body.client_email,
      client_type: body.client_type,
      client_company_or_personal_name: body.client_company_or_personal_name,
      client_contact_name: body.client_contact_name,
      client_contact_gender: body.client_contact_gender,
      client_address: body.client_address,
      client_email: body.client_email,
      client_phone: body.client_phone,
      client_student_plan: Boolean(body.client_student_plan),
      client_student_id_image: body.client_student_id_image,
      student_account_status: body.client_student_plan ? 'pending' : 'approved',
      passwordHash: hashPassword(body.client_password),
      client_profile: buildClientProfile(body),
    }

    users.push(user)
    await redis.set(USERS_KEY, users)

    return NextResponse.json({ ok: true, user: sanitizeUser(user) })
  } catch (error) {
    console.error('User creation failed', error)
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = (await req.json()) as PatchPayload
    if (!body.id || !body.updates) {
      return NextResponse.json({ ok: false, error: 'id and updates are required' }, { status: 400 })
    }

    const users = ((await redis.get<StoredUser[]>(USERS_KEY)) ?? []) as StoredUser[]
    const index = users.findIndex(u => u.id === body.id)
    if (index === -1) {
      return NextResponse.json({ ok: false, error: 'user not found' }, { status: 404 })
    }

    const merged = {
      ...users[index],
      ...body.updates,
      model_profile: body.updates.model_profile
        ? { ...(users[index].model_profile ?? {}), ...(body.updates.model_profile as Record<string, unknown>) }
        : users[index].model_profile,
      client_profile: body.updates.client_profile
        ? { ...(users[index].client_profile ?? {}), ...(body.updates.client_profile as Record<string, unknown>) }
        : users[index].client_profile,
    } as StoredUser

    users[index] = merged
    await redis.set(USERS_KEY, users)
    return NextResponse.json({ ok: true, user: sanitizeUser(merged) })
  } catch (error) {
    console.error('User update failed', error)
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 })
  }
}
