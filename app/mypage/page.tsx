'use client'

import { Button } from '@/components/ui/button'
import Header from '@/components/header'
import { clearSessionUser, getSessionUser } from '@/lib/auth'
import { listUsers, UserRecord } from '@/lib/users'
import { CalendarRange, Heart, LogOut, Sparkles, Star } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

const buildProfile = (user: UserRecord) => ({
  name: user.name,
  roleLabel: user.role === 'client' ? 'クライアント' : 'モデル',
  location: '未設定',
  tagline: user.profile || (user.role === 'client' ? 'モデルと出会いたいサロンです。' : 'ヘアモデルとして活動しています。'),
  specialties: user.role === 'client' ? ['サロン運営'] : ['ヘアモデル'],
  stats: [
    { label: 'マッチ数', value: '12件', icon: Sparkles },
    { label: 'レビュー', value: '1件', icon: Star },
    { label: 'お気に入り', value: '8件', icon: Heart },
  ],
})

export default function MyPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'portfolio' | 'matches' | 'reviews'>('portfolio')

  useEffect(() => {
    const session = getSessionUser()
    if (!session) {
      router.replace('/login?redirect=/mypage')
      return
    }
    setUser(session)

    listUsers()
      .then(users => {
        const refreshed = users.find(u => u.id === session.id || u.email === session.email)
        if (refreshed) setUser(refreshed)
      })
      .catch(err => console.error('ユーザー情報の更新に失敗しました', err))
      .finally(() => setLoading(false))
  }, [router])

  const profile = useMemo(() => (user ? buildProfile(user) : null), [user])

  const handleLogout = () => {
    clearSessionUser()
    router.replace('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-muted-foreground">
        マイページを読み込んでいます...
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-10 space-y-8">
        <div className="flex justify-end">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              トップへ戻る
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="border-destructive text-destructive bg-destructive/10 hover:bg-destructive/15 hover:shadow-md"
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
              ログアウト
            </Button>
          </div>
        </div>

        <section className="rounded-2xl border border-border bg-white shadow-sm p-6 md:p-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="size-16 md:size-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl text-primary">
                {profile.name.slice(0, 1)}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{profile.name}</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {profile.roleLabel}・{profile.location}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{profile.tagline}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {profile.specialties.map(tag => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="default"
                size="sm"
                className="bg-primary text-primary-foreground shadow-md hover:shadow-lg"
                onClick={() => router.push('/register')}
              >
                編集
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-primary text-primary shadow-md hover:shadow-lg"
                onClick={() => router.push('/notifications')}
              >
                通知
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {profile.stats.map(stat => (
              <div
                key={stat.label}
                className="border border-primary/20 rounded-xl px-4 py-3 flex items-center justify-between gap-3 bg-primary/5"
              >
                <div className="flex items-center gap-2">
                  <span className="size-8 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                    <stat.icon className="size-4" />
                  </span>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
                <p className="text-lg font-semibold text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: '予約管理', desc: 'スケジュールと予約管理', icon: CalendarRange, action: () => router.push('/bookings') },
            { label: 'お気に入り', desc: '保存したサロン・モデル', icon: Heart, action: () => router.push('/favorites') },
          ].map(item => (
            <button
              key={item.label}
              onClick={item.action}
              className="w-full rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-white to-white shadow-sm hover:shadow-md transition-all px-4 py-5 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="size-9 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                  <item.icon className="size-4" />
                </span>
                <p className="text-base font-semibold text-foreground">{item.label}</p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
            </button>
          ))}
        </section>

        <section className="space-y-5">
          <div className="flex flex-wrap gap-3 text-sm font-medium">
            {[
              { key: 'portfolio', label: 'ポートフォリオ' },
              { key: 'matches', label: 'マッチ履歴' },
              { key: 'reviews', label: 'レビュー' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-4 py-2 rounded-full border transition-all ${
                  activeTab === tab.key
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                    : 'border-border bg-white text-foreground hover:border-primary/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'portfolio' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(idx => (
                <div
                  key={idx}
                  className="aspect-[4/3] rounded-xl border border-primary/15 bg-primary/5 flex items-center justify-center text-muted-foreground"
                >
                  ポートフォリオ {idx}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'matches' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[1, 2, 3].map(idx => (
                <div key={idx} className="rounded-xl border border-primary/20 bg-white shadow-sm p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm">
                      M{idx}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">マッチ {idx}</p>
                      <p className="text-xs text-muted-foreground">場所: {profile.location}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">マッチした履歴がここに表示されます。</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[1, 2, 3].map(idx => (
                <div key={idx} className="rounded-xl border border-primary/20 bg-white shadow-sm p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-secondary/15 text-secondary flex items-center justify-center text-sm">
                      R{idx}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">レビュー {idx}</p>
                      <p className="text-xs text-muted-foreground">お客様</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">レビュー内容がここに表示されます。</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
