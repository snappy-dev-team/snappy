import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

type NoticeRecord = {
  id: number
  title: string
  url?: string
  createdAt: string
}

type NoticeUpdatePayload = {
  id: number
  title?: string
  url?: string
}

const redis = Redis.fromEnv()
const NOTICES_KEY = 'notices'

const sortNotices = (items: NoticeRecord[]) =>
  [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

export async function GET() {
  const notices = ((await redis.get<NoticeRecord[]>(NOTICES_KEY)) ?? []) as NoticeRecord[]
  return NextResponse.json(sortNotices(notices), {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
    },
  })
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<NoticeRecord>
    const title = body.title?.trim()
    if (!title) {
      return NextResponse.json({ ok: false, error: 'タイトルは必須です' }, { status: 400 })
    }

    const notices = ((await redis.get<NoticeRecord[]>(NOTICES_KEY)) ?? []) as NoticeRecord[]
    const notice: NoticeRecord = {
      id: Date.now(),
      title,
      url: body.url?.trim() || '',
      createdAt: new Date().toISOString(),
    }
    notices.push(notice)
    await redis.set(NOTICES_KEY, notices)
    return NextResponse.json({ ok: true, notice })
  } catch (error) {
    console.error('Notice creation failed', error)
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = (await req.json()) as NoticeUpdatePayload
    if (!body.id) {
      return NextResponse.json({ ok: false, error: 'id は必須です' }, { status: 400 })
    }

    const notices = ((await redis.get<NoticeRecord[]>(NOTICES_KEY)) ?? []) as NoticeRecord[]
    const index = notices.findIndex(item => item.id === body.id)
    if (index === -1) {
      return NextResponse.json({ ok: false, error: 'お知らせが見つかりません' }, { status: 404 })
    }

    const current = notices[index]
    const nextTitle = typeof body.title !== 'undefined' ? body.title.trim() : current.title
    if (!nextTitle) {
      return NextResponse.json({ ok: false, error: 'タイトルは必須です' }, { status: 400 })
    }

    const updated: NoticeRecord = {
      ...current,
      title: nextTitle,
      url: typeof body.url !== 'undefined' ? body.url.trim() : current.url,
    }
    notices[index] = updated
    await redis.set(NOTICES_KEY, notices)
    return NextResponse.json({ ok: true, notice: updated })
  } catch (error) {
    console.error('Notice update failed', error)
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const body = (await req.json()) as { id?: number }
    if (!body.id) {
      return NextResponse.json({ ok: false, error: 'id は必須です' }, { status: 400 })
    }

    const notices = ((await redis.get<NoticeRecord[]>(NOTICES_KEY)) ?? []) as NoticeRecord[]
    const index = notices.findIndex(item => item.id === body.id)
    if (index === -1) {
      return NextResponse.json({ ok: false, error: 'お知らせが見つかりません' }, { status: 404 })
    }

    notices.splice(index, 1)
    await redis.set(NOTICES_KEY, notices)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Notice deletion failed', error)
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 })
  }
}
