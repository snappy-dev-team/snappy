import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

type ModelProfile = {
  model_display_name?: string
  model_birthdate?: string
  model_gender?: string
  model_activity_area?: string
  model_height?: string
  model_body_type?: string
  model_hair_style?: string
  model_job_category?: string
  model_hobbies?: string
  model_main_image?: string
  model_profile_visibility?: 'public' | 'private'
}

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
  model_profile?: ModelProfile
}

const redis = Redis.fromEnv()
const USERS_KEY = 'users'

const hasCompletedProfile = (profile?: ModelProfile) =>
  Boolean(profile && profile.model_profile_visibility !== 'private')

export async function GET() {
  try {
    const users = ((await redis.get<StoredUser[]>(USERS_KEY)) ?? []) as StoredUser[]
    const models = users.filter((u) => u.role === 'model' && hasCompletedProfile(u.model_profile))
    return NextResponse.json(models)
  } catch (error) {
    console.error('Models fetch failed', error)
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 })
  }
}
