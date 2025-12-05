'use client'

import { useEffect, useMemo, useState, FormEvent, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { listUsers, UserRecord } from '@/lib/users'

const areaLabelMap: Record<string, string> = {
  shibuya: '渋谷',
  omotesando: '表参道',
  shinjuku: '新宿',
  tokyo: '東京',
}

type FilterState = {
  keyword: string
  area: string
}

function SearchPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialTab = searchParams.get('tab') === 'models' ? 'models' : 'clients'
  const [activeTab, setActiveTab] = useState<'models' | 'clients'>(initialTab)
  const [filters, setFilters] = useState<FilterState>({
    keyword: searchParams.get('q') ?? '',
    area: searchParams.get('area') ?? '',
  })
  const [users, setUsers] = useState<UserRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setFilters({
      keyword: searchParams.get('q') ?? '',
      area: searchParams.get('area') ?? '',
    })
    const tabParam = searchParams.get('tab')
    if (tabParam === 'clients' || tabParam === 'models') setActiveTab(tabParam)
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

  const syncQuery = (nextTab: 'models' | 'clients', nextFilters = filters) => {
    const params = new URLSearchParams()
    params.set('tab', nextTab)
    if (nextFilters.keyword) params.set('q', nextFilters.keyword)
    if (nextFilters.area) params.set('area', nextFilters.area)
    router.replace(`/search?${params.toString()}`)
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    syncQuery(activeTab)
  }

  const handleTabChange = (value: string) => {
    const nextTab = value === 'clients' ? 'clients' : 'models'
    setActiveTab(nextTab)
    syncQuery(nextTab)
  }

  const filteredModels = useMemo(() => {
    const kw = filters.keyword.trim().toLowerCase()
    const areaLabel = filters.area ? areaLabelMap[filters.area] ?? '' : ''
    return users
      .filter(user => (user.role ?? 'model') === 'model')
      .filter(user => {
        const haystack = `${user.name} ${user.email} ${user.profile ?? ''}`.toLowerCase()
        const matchesKeyword = kw ? haystack.includes(kw) : true
        const matchesArea = areaLabel ? (user.profile ?? '').includes(areaLabel) : true
        return matchesKeyword && matchesArea
      })
  }, [filters.area, filters.keyword, users])

  const filteredClients = useMemo(() => {
    const kw = filters.keyword.trim().toLowerCase()
    const areaLabel = filters.area ? areaLabelMap[filters.area] ?? '' : ''
    return users
      .filter(user => user.role === 'client')
      .filter(user => {
        const haystack = `${user.name} ${user.email} ${user.profile ?? ''}`.toLowerCase()
        const matchesKeyword = kw ? haystack.includes(kw) : true
        const matchesArea = areaLabel ? (user.profile ?? '').includes(areaLabel) : true
        return matchesKeyword && matchesArea
      })
  }, [filters.area, filters.keyword, users])

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
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2 bg-transparent gap-2 p-0 h-auto mb-5">
              <TabsTrigger
                value="clients"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-neutral-soft data-[state=inactive]:text-muted-foreground rounded-full py-2 px-4 font-semibold text-sm md:text-base transition-all shadow-sm"
              >
                お仕事をお探しの方
              </TabsTrigger>
              <TabsTrigger
                value="models"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-neutral-soft data-[state=inactive]:text-muted-foreground rounded-full py-2 px-4 font-semibold text-sm md:text-base transition-all shadow-sm"
              >
                モデルをお探しの方
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-3 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs md:text-sm font-semibold text-foreground">キーワード</label>
              <input
                value={filters.keyword}
                onChange={e => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
                placeholder="例: カラー / 撮影 / 土日"
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary shadow-inner bg-white/80"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs md:text-sm font-semibold text-foreground">エリア</label>
              <div className="relative">
                <select
                  value={filters.area}
                  onChange={e => setFilters(prev => ({ ...prev, area: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <option value="">指定なし</option>
                  <option value="shibuya">渋谷</option>
                  <option value="omotesando">表参道</option>
                  <option value="shinjuku">新宿</option>
                  <option value="tokyo">東京</option>
                </select>
                <ChevronDownIcon />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full md:w-auto bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground rounded-lg px-6 shadow-lg shadow-primary/20"
            >
              再検索
            </Button>
          </form>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTab === 'models'
              ? filteredModels.map(item => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-border bg-white/90 backdrop-blur shadow-md shadow-primary/10 p-4 space-y-3 hover:translate-y-[-2px] transition-transform"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        モデル
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <span className="px-3 py-1 rounded-full bg-neutral-soft text-foreground">
                        {item.email}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">
                        {item.profile ? '自己紹介あり' : 'プロフィール未登録'}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{item.profile || '自己紹介はまだありません。'}</p>
                    <p className="text-xs text-muted-foreground">登録日: {new Date(item.createdAt).toLocaleDateString()}</p>
                    <Button variant="outline" size="sm" className="mt-1">
                      詳細を見る
                    </Button>
                  </article>
                ))
              : filteredClients.map(item => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-border bg-white/90 backdrop-blur shadow-md shadow-secondary/10 p-4 space-y-3 hover:translate-y-[-2px] transition-transform"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <span className="text-xs px-3 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                        募集中
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <span className="px-3 py-1 rounded-full bg-neutral-soft text-foreground">
                        {item.email}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary">
                        {item.profile ? '募集内容あり' : '募集内容未登録'}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{item.profile || '募集内容はまだありません。'}</p>
                    <p className="text-xs text-muted-foreground">登録日: {new Date(item.createdAt).toLocaleDateString()}</p>
                    <Button variant="outline" size="sm" className="mt-1">
                      募集を見る
                    </Button>
                  </article>
                ))}
          </div>
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

function ChevronDownIcon() {
  return (
    <svg
      aria-hidden="true"
      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
