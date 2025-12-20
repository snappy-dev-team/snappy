import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

export type ApplicationStatus = 'applied' | 'negotiating' | 'contract' | 'no_response'

type ApplicationRecord = {
  id: number
  createdAt: string
  applicant_user_id: number
  applicant_role: 'model' | 'client'
  target_job_id?: number
  target_model_user_id?: number
  target_owner_user_id?: number
  status: ApplicationStatus
}

type PatchPayload = {
  id: number
  status: ApplicationStatus
}

const redis = Redis.fromEnv()
const APPLICATIONS_KEY = 'applications'

export async function GET() {
  const applications = ((await redis.get<ApplicationRecord[]>(APPLICATIONS_KEY)) ?? []) as ApplicationRecord[]
  return NextResponse.json(applications)
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<ApplicationRecord>
    if (!body.applicant_user_id || !body.applicant_role) {
      return NextResponse.json({ ok: false, error: 'applicant_user_id and applicant_role are required' }, { status: 400 })
    }
    if (!body.target_job_id && !body.target_model_user_id) {
      return NextResponse.json({ ok: false, error: 'target_job_id or target_model_user_id is required' }, { status: 400 })
    }

    const applications = ((await redis.get<ApplicationRecord[]>(APPLICATIONS_KEY)) ?? []) as ApplicationRecord[]
    const record: ApplicationRecord = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      applicant_user_id: body.applicant_user_id,
      applicant_role: body.applicant_role as 'model' | 'client',
      target_job_id: body.target_job_id,
      target_model_user_id: body.target_model_user_id,
      target_owner_user_id: body.target_owner_user_id,
      status: 'applied',
    }

    applications.push(record)
    await redis.set(APPLICATIONS_KEY, applications)
    return NextResponse.json({ ok: true, application: record })
  } catch (error) {
    console.error('Application creation failed', error)
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = (await req.json()) as PatchPayload
    if (!body.id || !body.status) {
      return NextResponse.json({ ok: false, error: 'id and status are required' }, { status: 400 })
    }

    const applications = ((await redis.get<ApplicationRecord[]>(APPLICATIONS_KEY)) ?? []) as ApplicationRecord[]
    const index = applications.findIndex(app => app.id === body.id)
    if (index === -1) {
      return NextResponse.json({ ok: false, error: 'application not found' }, { status: 404 })
    }

    applications[index] = { ...applications[index], status: body.status }
    await redis.set(APPLICATIONS_KEY, applications)

    return NextResponse.json({ ok: true, application: applications[index] })
  } catch (error) {
    console.error('Application update failed', error)
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 })
  }
}
