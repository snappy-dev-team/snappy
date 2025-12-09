'use client'

import { useEffect, useMemo, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/header'
import SearchPanel from '@/components/search-panel'
import { Button } from '@/components/ui/button'
import { listUsers, UserRecord } from '@/lib/users'

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

// Helper to calculate age from birthdate
const calculateAge = (birthdate: string): number => {
  if (!birthdate) return 0
  const birth = new Date(birthdate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

// Helper to check if age is in range
const isAgeInRange = (age: number, range: string): boolean => {
  if (!range) return true
  switch (range) {
    case '18-20':
      return age >= 18 && age <= 20
    case '20-25':
      return age >= 20 && age <= 25
    case '25-30':
      return age >= 25 && age <= 30
    case '30-35':
      return age >= 30 && age <= 35
    case '35+':
      return age >= 35
    default:
      return true
  }
}

function SearchPageContent() {
  const searchParams = useSearchParams()

  const initialTab = searchParams.get('tab') === 'models' ? 'models' : 'jobs'
  const [activeTab, setActiveTab] = useState<'models' | 'jobs'>(initialTab)
  const [users, setUsers] = useState<UserRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // フィルター値をURLパラメータから取得
  const filters = useMemo(() => ({
    keyword: searchParams.get('q') ?? '',
    area: searchParams.get('area') ?? '',
    age: searchParams.get('age') ?? '',
    hair: searchParams.get('hair') ?? '',
    gender: searchParams.get('gender') ?? '',
    category: searchParams.get('category') ?? '',
  }), [searchParams])

  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam === 'clients') {
      setActiveTab('jobs')
    } else if (tabParam === 'models') {
      setActiveTab('models')
    }
  }, [searchParams])

  useEffect(() => {
    listUsers()
      .then(setUsers)
      .catch(err => {
        console.error(err)
        setError('検索結果の取得に失敗しました。時間をおいて再度お試しください。')
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredModels = useMemo(() => {
    const kw = filters.keyword.trim().toLowerCase()
    const areaLabel = filters.area ? areaLabelMap[filters.area] ?? filters.area : ''
    const hairLabel = filters.hair ? hairStyleLabelMap[filters.hair] ?? filters.hair : ''
    const genderLabel = filters.gender ? genderLabelMap[filters.gender] ?? filters.gender : ''

    return users
      .filter(user => (user.role ?? 'model') === 'model')
      .filter(user => (user.model_profile as any)?.model_profile_visibility !== 'private')
      .filter(user => {
        const profile = user.model_profile as any
        const displayName = profile?.model_display_name || user.model_signup_name || user.name || ''
        const haystack = `${displayName} ${user.email} ${profile?.model_activity_area ?? ''} ${profile?.model_self_intro ?? ''}`.toLowerCase()
        
        // Keyword filter
        const matchesKeyword = kw ? haystack.includes(kw) : true
        
        // Area filter
        const matchesArea = areaLabel ? (profile?.model_activity_area ?? '').includes(areaLabel) : true
        
        // Age filter
        const birthdate = profile?.model_birthdate || user.model_signup_birthdate || ''
        const age = calculateAge(birthdate)
        const matchesAge = filters.age ? isAgeInRange(age, filters.age) : true
        
        // Hair style filter
        const userHairStyle = profile?.model_hair_style ?? ''
        const matchesHair = hairLabel ? userHairStyle.includes(hairLabel) : true
        
        // Gender filter
        const userGender = profile?.model_gender ?? ''
        const matchesGender = genderLabel ? userGender === genderLabel || userGender === filters.gender : true
        
        // Category filter (job_category)
        const jobCategory = profile?.model_job_category ?? ''
        const matchesCategory = filters.category ? jobCategory.toLowerCase().includes(filters.category.toLowerCase()) : true

        return matchesKeyword && matchesArea && matchesAge && matchesHair && matchesGender && matchesCategory
      })
  }, [filters, users])

  const filteredClients = useMemo(() => {
    const kw = filters.keyword.trim().toLowerCase()
    const areaLabel = filters.area ? areaLabelMap[filters.area] ?? filters.area : ''
    return users
      .filter(user => user.role === 'client')
      .filter(user => {
        const profile = user.client_profile as any
        const displayName = profile?.client_display_name || user.client_company_or_personal_name || user.name || ''
        const haystack = `${displayName} ${user.email} ${profile?.client_address ?? ''}`.toLowerCase()
        const matchesKeyword = kw ? haystack.includes(kw) : true
        const matchesArea = areaLabel ? (profile?.client_address ?? '').includes(areaLabel) : true
        return matchesKeyword && matchesArea
      })
  }, [filters, users])

  const handleTabChange = (tab: 'models' | 'jobs') => {
    setActiveTab(tab)
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
            {activeTab === 'models' ? 'モデルを探す' : 'お仕事を探す'}
          </h1>
        </header>

        <section className="rounded-2xl border border-border bg-white/90 backdrop-blur shadow-xl shadow-primary/10 p-5 md:p-6">
          <SearchPanel 
            embedded 
            initialTab={activeTab}
            onTabChange={handleTabChange}
            noContainer
          />
        </section>

        <section className="space-y-3">
          {error && <p className="text-sm text-destructive">{error}</p>}
          {loading && !error && <p className="text-sm text-muted-foreground">読み込み中...</p>}

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {activeTab === 'models'
                ? `モデルの候補を${filteredModels.length}件表示中`
                : `お仕事の候補を${filteredClients.length}件表示中`}
            </p>
          </div>

          {activeTab === 'models' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredModels.map(item => (
                <Link
                  key={item.id}
                  href={`/profile/${item.id}`}
                  className="group relative block overflow-hidden rounded-2xl border border-border shadow-md hover:shadow-lg transition-all"
                >
                  <div className="aspect-[4/5] bg-neutral-100">
                    <img
                      src={
                        (item.model_profile as any)?.model_main_image ||
                        'https://placehold.co/400x500?text=Profile'
                      }
                      alt={(item.model_profile as any)?.model_display_name || 'プロフィール画像'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredClients.map(item => {
                const profile = item.client_profile as any
                const displayName =
                  profile?.client_display_name || item.client_company_or_personal_name || item.name || '店舗名未設定'
                const area = profile?.client_address || item.client_address || 'エリア未設定'
                const description =
                  profile?.client_company_or_personal_name ||
                  '募集概要はまだ登録されていません。'
                const image = profile?.client_student_id_image

                return (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-border bg-white/90 backdrop-blur shadow-md shadow-secondary/10 p-4 md:p-5 flex flex-col md:flex-row gap-4 hover:translate-y-[-2px] transition-transform"
                  >
                    <div className="w-full md:w-40 h-32 md:h-32 rounded-xl overflow-hidden bg-neutral-100 border border-border/60">
                      <img
                        src={image || 'https://placehold.co/320x200?text=Shop'}
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <p className="text-xs text-muted-foreground">募集中</p>
                          <h3 className="text-lg font-semibold leading-tight line-clamp-2">{displayName}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
                        </div>
                        <Button variant="outline" size="sm" className="shrink-0">
                          募集を見る
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span className="px-3 py-1 rounded-full bg-primary-light text-primary border border-primary/20">
                          {area}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-neutral-soft text-foreground border border-border/60">
                          登録日: {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
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
