import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

type MatchRecord = {
  id: number
  job_id: number
  model_user_id: number
  client_user_id: number
  status: 'matched' | 'completed' | 'cancelled'
  createdAt: string
}

const redis = Redis.fromEnv()
const MATCHES_KEY = 'matches'

export async function GET() {
  const matches = ((await redis.get<MatchRecord[]>(MATCHES_KEY)) ?? []) as MatchRecord[]
  return NextResponse.json(matches)
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<MatchRecord>
    if (!body.job_id || !body.model_user_id || !body.client_user_id) {
      return NextResponse.json({ ok: false, error: 'job_id, model_user_id, client_user_id are required' }, { status: 400 })
    }

    const matches = ((await redis.get<MatchRecord[]>(MATCHES_KEY)) ?? []) as MatchRecord[]
    const match: MatchRecord = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: body.status ?? 'matched',
      job_id: body.job_id,
      model_user_id: body.model_user_id,
      client_user_id: body.client_user_id,
    }

    matches.push(match)
    await redis.set(MATCHES_KEY, matches)
    return NextResponse.json({ ok: true, match })
  } catch (error) {
    console.error('Match creation failed', error)
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 })
  }
}
