"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { clearSessionUser, getSessionUser } from '@/lib/auth'
import { ClientProfile, ModelProfile, StudentAccountStatus, UserRecord, fetchMetrics, listUsers } from '@/lib/users'
import { ClipboardList, LogOut, ShieldCheck, Sparkles, Star, UserCog } from 'lucide-react'

const emptyModelProfile: ModelProfile = {
  model_display_name: '',
  model_birthdate: '',
  model_gender: '',
  model_activity_area: '',
  model_types: [],
  model_height: '',
  model_bust: '',
  model_waist: '',
  model_hip: '',
  model_shoes_size: '',
  model_body_type: '',
  model_hair_style: '',
  model_main_image: '',
  model_sub_images: [],
  model_job_category: '',
  model_hobbies: '',
  model_ng_conditions: '',
  model_self_intro: '',
  model_achievements: '',
  model_profile_visibility: 'public',
}

const emptyClientProfile: ClientProfile = {
  client_display_name: '',
  client_company_or_personal_name: '',
  client_contact_name: '',
  client_contact_gender: '',
  client_address: '',
  client_phone: '',
  client_student_plan: false,
  client_student_id_image: '',
  student_account_status: 'pending',
}

const statCards = [
  { key: 'dynamic_match_count', label: 'マッチ数', icon: Sparkles },
  { key: 'dynamic_review_count', label: 'レビュー数', icon: ClipboardList },
  { key: 'dynamic_review_rating', label: '平均評価', icon: Star },
] as const

export default function MyPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState<{ dynamic_match_count: number; dynamic_review_count: number; dynamic_review_rating: number }>(
    {
      dynamic_match_count: 0,
      dynamic_review_count: 0,
      dynamic_review_rating: 0,
    },
  )
  const [modelProfile, setModelProfile] = useState<ModelProfile>(emptyModelProfile)
  const [clientProfile, setClientProfile] = useState<ClientProfile>(emptyClientProfile)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const session = getSessionUser()
    if (!session) {
      router.replace('/login?redirect=/mypage')
      return
    }
    setUser(session)
    setLoading(false)
  }, [router])

  useEffect(() => {
    if (!user) return
    if (user.model_profile) setModelProfile(user.model_profile as ModelProfile)
    if (user.client_profile) setClientProfile(user.client_profile as ClientProfile)
  }, [user])

  useEffect(() => {
    if (!user) return
    listUsers()
      .then(users => {
        const refreshed = users.find(u => u.id === user.id)
        if (refreshed) {
          setUser(refreshed)
          if (refreshed.model_profile) setModelProfile(refreshed.model_profile as ModelProfile)
          if (refreshed.client_profile) setClientProfile(refreshed.client_profile as ClientProfile)
        }
        return fetchMetrics(user.id)
      })
      .then(fetchedMetrics => fetchedMetrics && setMetrics(fetchedMetrics))
      .catch(err => {
        console.error('Failed to refresh user or metrics', err)
        setError('情報の取得に失敗しました。時間をおいて再度お試しください。')
      })
  }, [user?.id])

  const isModel = user?.role === 'model'
  const isStudentClient = !isModel && Boolean(user?.client_student_plan ?? user?.client_profile?.client_student_plan)
  const studentStatus = user?.student_account_status as StudentAccountStatus | undefined

  const profileName = useMemo(() => {
    if (!user) return ''
    if (isModel) return modelProfile.model_display_name || user.model_signup_name || user.name || '未設定'
    return clientProfile.client_display_name || user.client_company_or_personal_name || user.name || '未設定'
  }, [clientProfile.client_display_name, isModel, modelProfile.model_display_name, user])

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

  if (!user) return null

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-10 space-y-10">
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
                {profileName.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{profileName}</h1>
                <p className="text-sm text-muted-foreground mt-1">{isModel ? 'モデル会員' : 'クライアント会員'}</p>
                {isStudentClient && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <ShieldCheck className="size-3 text-primary" />
                    <span>学生アカウント / ステータス: {studentStatus ?? '未設定'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {statCards.map(stat => (
              <div
                key={stat.key}
                className="border border-primary/20 rounded-xl px-4 py-3 flex items-center justify-between gap-3 bg-primary/5"
              >
                <div className="flex items-center gap-2">
                  <span className="size-8 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                    <stat.icon className="size-4" />
                  </span>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {stat.key === 'dynamic_review_rating' ? metrics[stat.key].toFixed(1) : metrics[stat.key]}
                </p>
              </div>
            ))}
          </div>
        </section>

        {error && <p className="text-sm text-destructive text-center">{error}</p>}

        <section className="rounded-2xl border border-border bg-white shadow-sm p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-2">
            <UserCog className="size-4 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">プロフィール編集・登録</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="w-full justify-between" onClick={() => router.push('/mypage/profile/edit')}>
              プロフィール編集
              <span className="text-xs text-primary-foreground/90">詳細入力・画像登録</span>
            </Button>
            {isModel ? (
              <Button variant="outline" className="w-full justify-between" onClick={() => router.push('/search?tab=models')}>
                モデル検索を見る
                <span className="text-xs text-muted-foreground">公開プロフィール確認</span>
              </Button>
            ) : (
              <>
                <Button
                  className="w-full justify-between"
                  onClick={() => router.push('/mypage/jobs/new?type=general')}
                >
                  仕事募集（一般）
                  <span className="text-xs text-primary-foreground/90">一般アカウント用</span>
                </Button>
                {isStudentClient && (
                  <Button
                    variant={studentStatus === 'approved' ? 'default' : 'outline'}
                    disabled={studentStatus !== 'approved'}
                    className="w-full justify-between"
                    onClick={() => router.push('/mypage/jobs/new?type=student')}
                  >
                    仕事募集（学生）
                    <span className="text-xs text-muted-foreground">
                      {studentStatus === 'approved' ? '学生アカウント用' : '承認をお待ちください'}
                    </span>
                  </Button>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
