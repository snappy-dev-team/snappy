'use client'

import { useEffect, useMemo, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/header'
import SearchPanel from '@/components/search-panel'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { listUsers, UserRecord } from '@/lib/users'
import { isLoggedIn } from '@/lib/auth'
import { Star } from 'lucide-react'
import { calculateAge, isAgeInRange, isDateInRange } from '@/lib/search-utils'

const areaLabelMap: Record<string, string> = {
  shibuya: '渋谷',
  omotesando: '表参道',
  shinjuku: '新宿',
  tokyo: '東京',
  osaka: '大阪',
  nagoya: '名古屋',
}

const hairStyleLabelMap: Record<string, string> = {
  straight: 'ストレート',
  wave: 'ウェーブ',
  curly: 'くせ毛',
  other: 'その他',
}

const genderLabelMap: Record<string, string> = {
  female: '女性',
  male: '男性',
  other: 'その他',
}

// Job types (same as featured-shops.tsx)
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


function SearchPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [users, setUsers] = useState<UserRecord[]>([])
  const [modelsApi, setModelsApi] = useState<UserRecord[]>([])
  const [jobCards, setJobCards] = useState<FeaturedCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const currentTab: 'models' | 'jobs' = searchParams.get('tab') === 'models' ? 'models' : 'jobs'

  // フィルター値をURLパラメータから取得
  const filters = useMemo(() => ({
    keyword: searchParams.get('q') ?? '',
    area: searchParams.get('area') ?? '',
    age: searchParams.get('age') ?? '',
    hair: searchParams.get('hair') ?? '',
    gender: searchParams.get('gender') ?? '',
    category: searchParams.get('category') ?? '',
    date: searchParams.get('date') ?? '',
  }), [searchParams])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, usersRes, modelsRes] = await Promise.all([
          fetch('/api/jobs'),
          listUsers(),
          fetch('/api/models'),
        ])
        
        if (!jobsRes.ok) throw new Error('failed to fetch jobs')
        if (!modelsRes.ok) throw new Error('failed to fetch models')
        const jobsData = (await jobsRes.json()) as ShopJob[]
        const usersData = usersRes
        const modelsData = (await modelsRes.json()) as UserRecord[]
        
        setUsers(usersData)
        setModelsApi(Array.isArray(modelsData) ? modelsData : [])
        
        // Build job cards (same as featured-shops.tsx)
        const clients = usersData.filter((user: any) => user.role === 'client')
        const clientMap = new Map(clients.map((client: any) => [client.id, client as Client]))

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

        setJobCards(mapped)
      } catch (err) {
        console.error(err)
        setError('検索結果の取得に失敗しました。時間をおいて再度お試しください。')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredModels = useMemo(() => {
    const kw = filters.keyword.trim().toLowerCase()
    const areaLabel = filters.area ? areaLabelMap[filters.area] ?? filters.area : ''
    const hairLabel = filters.hair ? hairStyleLabelMap[filters.hair] ?? filters.hair : ''
    const genderLabel = filters.gender ? genderLabelMap[filters.gender] ?? filters.gender : ''

    const usersOnlyModels = users.filter(user => (user.role ?? 'model') === 'model')
    const source = usersOnlyModels.length > 0 ? usersOnlyModels : modelsApi
    return source
      .filter(user => (user.role ?? 'model') === 'model')
      .filter(user => (user.model_profile as any)?.model_profile_visibility !== 'private')
      .filter(user => {
        const profile = user.model_profile as any
        const displayName = profile?.model_display_name || user.model_signup_name || user.name || ''
        const haystack = `${displayName} ${user.email} ${profile?.model_activity_area ?? ''} ${profile?.model_self_intro ?? ''}`.toLowerCase()
        
        // Keyword filter
        const matchesKeyword = kw ? haystack.includes(kw) : true
        
        // Area filter
        const userArea = profile?.model_activity_area ?? ''
        const matchesArea = filters.area
          ? userArea === filters.area || (areaLabel ? userArea.includes(areaLabel) : userArea.includes(filters.area))
          : true
        
        // Age filter
        const birthdate = profile?.model_birthdate || user.model_signup_birthdate || ''
        const age = calculateAge(birthdate)
        const matchesAge = filters.age ? isAgeInRange(age, filters.age) : true
        
        // Hair style filter
        const userHairStyle = profile?.model_hair_style ?? ''
        const matchesHair = filters.hair
          ? userHairStyle === filters.hair ||
            (hairLabel ? userHairStyle.includes(hairLabel) : userHairStyle.includes(filters.hair))
          : true
        
        // Gender filter
        const userGender = profile?.model_gender ?? ''
        const matchesGender = filters.gender
          ? userGender === filters.gender || (genderLabel ? userGender === genderLabel : false)
          : true
        
        // Category filter (job_category)
        const jobCategory = profile?.model_job_category ?? ''
        const matchesCategory = filters.category ? jobCategory.toLowerCase().includes(filters.category.toLowerCase()) : true

        return matchesKeyword && matchesArea && matchesAge && matchesHair && matchesGender && matchesCategory
      })
  }, [filters, users, modelsApi])

  const filteredJobs = useMemo(() => {
    const kw = filters.keyword.trim().toLowerCase()
    const areaLabel = filters.area ? areaLabelMap[filters.area] ?? filters.area : ''

    return jobCards.filter(card => {
      const haystack = `${card.displayTitle} ${card.summary} ${card.location} ${card.client?.client_profile?.client_display_name ?? ''} ${card.client?.name ?? ''}`.toLowerCase()
      const matchesKeyword = kw ? haystack.includes(kw) : true
      const matchesArea = areaLabel ? card.location.includes(areaLabel) : true
      const matchesDate = filters.date ? isDateInRange(card.job.job_date_candidates ?? '', filters.date) : true
      return matchesKeyword && matchesArea && matchesDate
    })
  }, [filters, jobCards])

  const handleApplyClick = (e: React.MouseEvent, jobId?: number) => {
    e.preventDefault()
    e.stopPropagation()
    if (!jobId) return

    if (!isLoggedIn()) {
      router.push(`/login?redirect=/jobs/${jobId}`)
      return
    }

    router.push(`/apply/confirm?type=job&targetId=${jobId}`)
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -top-20 -left-10 w-72 h-72 bg-primary/20 blur-3xl rounded-full" />
        <div className="absolute top-10 right-0 w-80 h-80 bg-secondary/25 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-primary/10 blur-3xl rounded-full" />
      </div>
      <Header />

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-12 space-y-8 relative">
        <header className="space-y-3">
          <p className="text-sm text-muted-foreground">検索結果</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {currentTab === 'models' ? 'モデルを探す' : 'お仕事を探す'}
          </h1>
        </header>

        <section className="rounded-2xl border border-border bg-white/90 backdrop-blur shadow-xl shadow-primary/10 p-5 md:p-6">
          <SearchPanel 
            embedded 
            initialTab={currentTab}
            noContainer
          />
        </section>

        <section className="space-y-3">
          {error && <p className="text-sm text-destructive">{error}</p>}
          {loading && !error && <p className="text-sm text-muted-foreground">読み込み中...</p>}

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {currentTab === 'models'
                ? `モデルの候補を${filteredModels.length}件表示中`
                : `お仕事の候補を${filteredJobs.length}件表示中`}
            </p>
          </div>

          {currentTab === 'models' ? (
            filteredModels.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-neutral-soft flex items-center justify-center">
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">該当するモデルが見つかりませんでした</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  検索条件を変更して、もう一度お試しください。<br />
                  エリアや年齢などの条件を広げると、より多くの結果が表示されます。
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredModels.map((item, index) => (
                  <Link
                    key={`${item.id}-${index}`}
                    href={`/models/${item.id}`}
                    className="group relative block overflow-hidden rounded-2xl border border-border shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="aspect-4/5 bg-neutral-100">
                      <img
                        src={(item.model_profile as any)?.model_main_image || 'https://placehold.co/400x500?text=Model'}
                        alt={(item.model_profile as any)?.model_display_name || 'プロフィール画像'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                      <p className="text-sm font-semibold line-clamp-1">
                        {(item.model_profile as any)?.model_display_name || item.model_signup_name || '名称未設定'}
                      </p>
                      <p className="text-xs text-white/80 line-clamp-1">
                        {(item.model_profile as any)?.model_activity_area || 'エリア未設定'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )
          ) : (
            filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-neutral-soft flex items-center justify-center">
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">該当するお仕事が見つかりませんでした</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  検索条件を変更して、もう一度お試しください。<br />
                  エリアや日時などの条件を広げると、より多くの結果が表示されます。
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((shop) => (
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
            )
          )}
        </section>
      </main>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">読み込み中...</div>}>
      <SearchPageContent />
    </Suspense>
  )
}
