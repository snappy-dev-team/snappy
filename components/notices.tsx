"use client"

import { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'

type NoticeRecord = {
  id: number
  title: string
  url?: string
  createdAt: string
}

const MAX_DISPLAY = 8

export default function Notices() {
  const [notices, setNotices] = useState<NoticeRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await fetch('/api/notices')
        if (!res.ok) {
          console.error('Failed to fetch notices', res.status)
          setNotices([])
          return
        }
        const data = await res.json().catch(() => [])
        setNotices(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to load notices', error)
        setNotices([])
      } finally {
        setLoading(false)
      }
    }

    fetchNotices()
  }, [])

  const visibleNotices = useMemo(() => notices.slice(0, MAX_DISPLAY), [notices])

  return (
    <section className="py-8 md:py-10 px-4 md:px-8 bg-neutral-soft/40">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-3xl">i!</span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">お知らせ</h2>
            <span className="text-3xl">i!</span>
          </div>
        </div>

        {loading && (
          <div className="py-6 text-center text-muted-foreground">お知らせを読み込み中...</div>
        )}

        {!loading && visibleNotices.length === 0 && (
          <div className="py-6 px-4 text-center text-muted-foreground border border-dashed border-border rounded-xl bg-card/50">
            お知らせはまだありません。
          </div>
        )}

        {visibleNotices.length > 0 && (
          <div className="space-y-2">
            {visibleNotices.map((notice) => (
              <Card key={notice.id} className="p-3 md:p-4 rounded-2xl border-border">
                {notice.url ? (
                  <a
                    href={notice.url}
                    className="text-sm md:text-base font-medium text-primary hover:underline break-words"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {notice.title}
                  </a>
                ) : (
                  <p className="text-sm md:text-base font-medium text-foreground break-words">
                    {notice.title}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
