'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { isLoggedIn } from '@/lib/auth'
import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'

type ClientProfile = {
  client_display_name?: string
  client_address?: string
}

type Client = {
  id: number
  role?: string
  name?: string
  metrics?: { dynamic_review_rating?: number }
  client_profile?: ClientProfile
}

type ShopJob = {
  id?: number
  account_type?: 'general' | 'student'
  client_id?: number
  job_status?: 'active' | 'paused'
  job_title_general?: string
  job_purpose_general?: string
  job_genre_general?: string
  job_salon_area_general?: string
  job_portfolio_images_general?: string[]
  job_date_candidates?: string
  job_time_range?: string
  job_reward_type?: string
  job_reward_cash?: string
  job_reward_transport?: string
  job_title_student?: string
  job_purpose_student?: string
  job_location_address_student?: string
  job_sns_student?: string
  job_portfolio_images_student?: string[]
}

type FeaturedCard = {
  job: ShopJob
  client?: Client
  displayTitle: string
  summary: string
  location: string
  timeframe: string
  reward: string
  image?: string
}

const FALLBACK_IMAGE = 'https://placehold.co/400x300?text=Recruiting'

const formatReward = (job: ShopJob) => {
  if (job.job_reward_cash && job.job_reward_cash !== '0') return `¥${job.job_reward_cash}`
  if (job.job_reward_type && /free|無料/i.test(job.job_reward_type)) return '謝礼なし'
  return '謝礼未設定'
}

export default function FeaturedShops() {
  const router = useRouter()
  const [cards, setCards] = useState<FeaturedCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const [jobsRes, usersRes] = await Promise.all([fetch('/api/jobs'), fetch('/api/users')])
        if (!jobsRes.ok || !usersRes.ok) {
          console.error('Failed to fetch shops', { jobs: jobsRes.status, users: usersRes.status })
          setCards([])
          return
        }
        const jobsData = (await jobsRes.json().catch(() => [])) as ShopJob[]
        const users = (await usersRes.json().catch(() => [])) as Client[]
        const clients = users.filter((user) => user.role === 'client')
        const clientMap = new Map(clients.map((client) => [client.id, client]))

        const mapped: FeaturedCard[] = (jobsData ?? [])
          .filter(job => (job.job_status ?? 'active') === 'active')
          .map((job) => {
          const client = job.client_id ? clientMap.get(job.client_id) : undefined
          const displayTitle =
            job.account_type === 'student'
              ? job.job_title_student || '学生募集'
              : job.job_title_general || '一般募集'
          const summary =
            job.account_type === 'student'
              ? job.job_purpose_student || job.job_sns_student || '募集内容を確認してください'
              : job.job_purpose_general || job.job_genre_general || '募集内容を確認してください'
          const location =
            job.account_type === 'student'
              ? job.job_location_address_student || client?.client_profile?.client_address || 'エリア未設定'
              : job.job_salon_area_general || client?.client_profile?.client_address || 'エリア未設定'
          const timeframe = job.job_time_range || job.job_date_candidates || '日程未定'
          const image =
            job.account_type === 'general'
              ? job.job_portfolio_images_general?.[0]
              : job.job_portfolio_images_student?.[0]

          return {
            job,
            client,
            displayTitle,
            summary,
            location,
            timeframe,
            reward: formatReward(job),
            image,
          }
        })

        setCards(mapped)
      } catch (error) {
        console.error('Failed to load featured shops', error)
        setCards([])
      } finally {
        setLoading(false)
      }
    }

    fetchShops()
  }, [])

  const hasCards = cards.length > 0

  const handleApplyClick = (e: React.MouseEvent, jobId?: number) => {
    e.preventDefault()
    e.stopPropagation()
    if (!jobId) return

    if (!isLoggedIn()) {
      router.push(`/login?redirect=/jobs/${jobId}`)
      return
    }

    // TODO: 応募フローが実装されたらここで起動する
    router.push(`/jobs/${jobId}`)
  }

  return (
    <section className="py-8 md:py-10 px-4 md:px-8 bg-neutral-soft/50">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-3xl">💈</span>
            <h2 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
              注目の募集中ショップ
            </h2>
            <span className="text-3xl">💈</span>
          </div>
        </div>

        {/* Shop List */}
        {loading && (
          <div className="py-8 text-center text-muted-foreground">
            読み込み中...
          </div>
        )}

        {!loading && !hasCards && (
          <div className="py-8 px-4 text-center text-muted-foreground border border-dashed border-border rounded-xl bg-card/50">
            現在募集中のショップはありません。
          </div>
        )}

        {hasCards && (
          <div className="space-y-4">
            {cards.map((shop) => (
              <Link key={shop.job.id} href={`/jobs/${shop.job.id}`} className="block group">
                <Card className="flex flex-col md:flex-row gap-4 rounded-2xl p-4 md:p-5 border-border hover:shadow-md transition-shadow">
                  {/* Thumbnail */}
                  <div className="w-full md:w-44 h-44 bg-neutral-100 rounded-xl overflow-hidden border border-border/60">
                    <img
                      src={shop.image || FALLBACK_IMAGE}
                      alt={shop.displayTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <p className="text-xs text-muted-foreground">
                          {shop.client?.client_profile?.client_display_name || shop.client?.name || 'ショップ名未設定'}
                        </p>
                        <h3 className="font-semibold text-foreground text-lg md:text-xl leading-tight line-clamp-2">
                          {shop.displayTitle}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {shop.summary}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-xs px-3 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                          {shop.reward}
                        </span>
                        <Button size="sm" onClick={(e) => handleApplyClick(e, shop.job.id)}>
                          応募する
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="px-3 py-1 rounded-full bg-primary-light text-primary border border-primary/20">
                        {shop.location}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-accent/20 text-foreground border border-border/60">
                        {shop.timeframe}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-neutral-soft text-foreground border border-border/60">
                        {shop.job.account_type === 'student' ? '学生アカウント' : '一般アカウント'}
                      </span>
                    </div>

                    {shop.client?.metrics?.dynamic_review_rating ? (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < Math.floor(shop.client?.metrics?.dynamic_review_rating ?? 0)
                                ? 'fill-accent text-accent'
                                : 'text-border'
                            }`}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground">評価はまだありません</div>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
