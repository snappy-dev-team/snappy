import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

type JobPayload = {
  id?: number
  createdAt?: string
  client_id?: number
  account_type?: 'general' | 'student'
  // general
  job_title_general?: string
  job_purpose_general?: string
  job_genre_general?: string
  job_number_general?: string
  job_salon_name_general?: string
  job_salon_area_general?: string
  job_nearest_station_general?: string
  job_salon_mood_general?: string
  job_stylist_name_general?: string
  job_salon_sns_general?: string
  job_portfolio_images_general?: string[]
  // student
  job_title_student?: string
  job_purpose_student?: string
  job_genre_student?: string
  job_number_student?: string
  job_stylist_name_student?: string
  job_school_name_student?: string
  job_location_address_student?: string
  job_sns_student?: string
  job_portfolio_images_student?: string[]
  // shared conditions
  job_model_gender?: string
  job_model_age_range?: string
  job_model_hair_conditions?: string
  job_model_face_visibility?: string
  job_model_experience?: string
  job_model_other_conditions?: string
  job_service_contents?: string
  job_style_after?: string
  job_required_time?: string
  job_dress_makeup?: string
  job_staff_count?: string
  job_reward_type?: string
  job_reward_cash?: string
  job_reward_transport?: string
  job_reward_details?: string
  job_date_candidates?: string
  job_time_range?: string
  job_shoot_location?: string
  job_meeting_point?: string
  job_photo_usage_scope?: string
}

const redis = Redis.fromEnv()
const JOBS_KEY = 'jobs'

export async function GET() {
  const jobs = ((await redis.get<JobPayload[]>(JOBS_KEY)) ?? []) as JobPayload[]
  return NextResponse.json(jobs)
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as JobPayload
    if (!body.client_id || !body.account_type) {
      return NextResponse.json({ ok: false, error: 'client_id and account_type are required' }, { status: 400 })
    }

    const now = new Date().toISOString()
    const jobs = ((await redis.get<JobPayload[]>(JOBS_KEY)) ?? []) as JobPayload[]
    const job: JobPayload = {
      ...body,
      id: Date.now(),
      createdAt: now,
      job_portfolio_images_general: body.job_portfolio_images_general ?? [],
      job_portfolio_images_student: body.job_portfolio_images_student ?? [],
    }

    jobs.push(job)
    await redis.set(JOBS_KEY, jobs)
    return NextResponse.json({ ok: true, job })
  } catch (error) {
    console.error('Job creation failed', error)
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 })
  }
}
