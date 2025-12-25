"use client"

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { getSessionUser, isLoggedIn } from '@/lib/auth'

type ClientProfile = {
  client_display_name?: string
  client_address?: string
  client_main_image?: string
  client_sub_images?: string[]
  client_shop_mood?: string
  client_shop_features?: string
  client_contact_image?: string
  client_contact_name?: string
}

type Client = {
  id: number
  name?: string
  client_company_or_personal_name?: string
  client_contact_name?: string
  client_profile?: ClientProfile
}

type JobDetail =
  | {
      id?: number
      account_type?: 'general'
      client_id?: number
      job_title_general?: string
      job_purpose_general?: string
      job_genre_general?: string
      job_number_general?: string
      job_salon_name_general?: string
      job_salon_area_general?: string
      job_nearest_station_general?: string
      job_salon_mood_general?: string
      job_stylist_name_general?: string
      job_salon_sns_general?: string
      job_portfolio_images_general?: string[]
      job_model_gender?: string
      job_model_age_range?: string
      job_model_hair_conditions?: string
      job_model_face_visibility?: string
      job_model_experience?: string
      job_model_other_conditions?: string
      job_service_contents?: string
      job_style_after?: string
      job_required_time?: string
      job_dress_makeup?: string
      job_staff_count?: string
      job_reward_type?: string
      job_reward_cash?: string
      job_reward_transport?: string
      job_reward_details?: string
      job_date_candidates?: string
      job_time_range?: string
      job_shoot_location?: string
      job_meeting_point?: string
      job_photo_usage_scope?: string
    }
  | {
      id?: number
      account_type?: 'student'
      client_id?: number
      job_title_student?: string
      job_purpose_student?: string
      job_genre_student?: string
      job_number_student?: string
      job_stylist_name_student?: string
      job_school_name_student?: string
      job_location_address_student?: string
      job_sns_student?: string
      job_portfolio_images_student?: string[]
      job_model_gender?: string
      job_model_age_range?: string
      job_model_hair_conditions?: string
      job_model_face_visibility?: string
      job_model_experience?: string
      job_model_other_conditions?: string
      job_service_contents?: string
      job_style_after?: string
      job_required_time?: string
      job_dress_makeup?: string
      job_staff_count?: string
      job_reward_type?: string
      job_reward_cash?: string
      job_reward_transport?: string
      job_reward_details?: string
      job_date_candidates?: string
      job_time_range?: string
      job_shoot_location?: string
      job_meeting_point?: string
      job_photo_usage_scope?: string
    }

const FALLBACK_IMAGE = 'https://placehold.co/800x500?text=Recruiting+Detail'

export default function JobDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [job, setJob] = useState<JobDetail | null>(null)
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)

  const jobId = useMemo(() => Number(params?.id), [params?.id])

  useEffect(() => {
    const load = async () => {
      if (!jobId) return
      try {
        const [jobsRes, usersRes] = await Promise.all([fetch('/api/jobs'), fetch('/api/users')])
        if (!jobsRes.ok || !usersRes.ok) throw new Error('failed to fetch job detail')
        const jobs = (await jobsRes.json()) as JobDetail[]
        const users = (await usersRes.json()) as Client[]
        const matchedJob = jobs.find(item => item.id === jobId) ?? null
        const matchedClient = matchedJob?.client_id != null ? users.find(user => user.id === matchedJob.client_id) ?? null : null
        setJob(matchedJob)
        setClient(matchedClient)
      } catch (error) {
        console.error('Failed to load job detail', error)
        setJob(null)
        setClient(null)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [jobId])

  const displayTitle =
    job?.account_type === 'student' ? job.job_title_student || '学生募集' : job?.job_title_general || '一般募集'
  const description =
    job?.account_type === 'student'
      ? job.job_purpose_student || job.job_model_other_conditions
      : job?.job_purpose_general || job?.job_model_other_conditions
  const location =
    job?.account_type === 'student'
      ? job.job_location_address_student || 'エリア未設定'
      : job?.job_salon_area_general || job?.job_shoot_location || 'エリア未設定'
  const timeframe = job?.job_time_range || job?.job_date_candidates || '日程未設定'
  const reward =
    job?.job_reward_cash && job.job_reward_cash !== '0'
      ? `¥${job.job_reward_cash}`
      : job?.job_reward_type && /free|無償|無料/i.test(job.job_reward_type)
        ? '謝礼なし'
        : job?.job_reward_details || '謝礼未設定'
  const imageList =
    job?.account_type === 'student'
      ? job.job_portfolio_images_student
      : job?.job_portfolio_images_general
  const heroImage = Array.isArray(imageList) && imageList[0] ? imageList[0] : FALLBACK_IMAGE
  const subImages = Array.isArray(imageList) ? imageList.slice(1, 5).filter(Boolean) : []
  const clientDisplayName =
    client?.client_profile?.client_display_name || client?.client_company_or_personal_name || client?.name || 'クライアント名未設定'
  const clientMainImage = client?.client_profile?.client_main_image || 'https://placehold.co/600x450?text=Salon'
  const clientMood = client?.client_profile?.client_shop_mood || '雰囲気は未入力です。'
  const clientFeatures = client?.client_profile?.client_shop_features || '特徴は未入力です。'
  const clientContactName =
    client?.client_profile?.client_contact_name || client?.client_contact_name || '担当者未設定'
  const clientContactImage = client?.client_profile?.client_contact_image || 'https://placehold.co/120x120?text=Staff'

  const handleApply = () => {
    if (!job?.id) return
    if (!isLoggedIn()) {
      router.push(`/login?redirect=/jobs/${job.id}`)
      return
    }
    const session = getSessionUser()
    if (!session || session.role !== 'model') {
      window.alert('モデルアカウントのみ募集に応募できます。')
      return
    }
    router.push(`/apply/confirm?type=job&targetId=${job.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        読み込み中...
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-muted-foreground">募集が見つかりませんでした。</p>
        <Button variant="outline" onClick={() => router.push('/')}>
          トップへ戻る
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">募集の詳細</p>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">{displayTitle}</h1>
            <p className="text-sm text-muted-foreground">
              {clientDisplayName}
            </p>
          </div>
          <Button variant="outline" onClick={() => router.back()}>
            戻る
          </Button>
        </div>

        <section className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-0">
            <div className="p-6 md:p-8 space-y-3 bg-neutral-50">
              <div className="w-full aspect-[4/3] max-h-[320px] bg-neutral-100 rounded-2xl overflow-hidden">
                <img src={heroImage} alt={displayTitle} className="w-full h-full object-cover" />
              </div>
              {subImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {subImages.map((image, index) => (
                    <div key={`${image}-${index}`} className="aspect-[4/3] bg-neutral-100 rounded-xl overflow-hidden">
                      <img src={image} alt={`${displayTitle} ${index + 2}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex flex-wrap gap-2 text-xs md:text-sm text-muted-foreground">
                <span className="px-3 py-1 rounded-full bg-primary-light text-primary border border-primary/20">
                  {location}
                </span>
                <span className="px-3 py-1 rounded-full bg-accent/20 text-foreground border border-border/60">
                  {timeframe}
                </span>
                <span className="px-3 py-1 rounded-full bg-neutral-soft text-foreground border border-border/60">
                  {job.account_type === 'student' ? '学生アカウント' : '一般アカウント'}
                </span>
              </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold">募集概要</h2>
              <p className="text-sm text-foreground leading-relaxed">{description || '詳細は未入力です。'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {job.account_type === 'student' ? (
                <>
                  <DetailRow label="募集タイトル" fullWidth>
                    {job.job_title_student || '記載なし'}
                  </DetailRow>
                  <DetailRow label="目的" fullWidth>
                    {job.job_purpose_student || '記載なし'}
                  </DetailRow>
                  <DetailRow label="ジャンル">{job.job_genre_student || '記載なし'}</DetailRow>
                  <DetailRow label="人数">{job.job_number_student || '記載なし'}</DetailRow>
                  <DetailRow label="スタイリスト名">{job.job_stylist_name_student || '記載なし'}</DetailRow>
                  <DetailRow label="学校名">{job.job_school_name_student || '記載なし'}</DetailRow>
                  <DetailRow label="施術場所住所">{job.job_location_address_student || '記載なし'}</DetailRow>
                </>
              ) : (
                <>
                  <DetailRow label="募集タイトル" fullWidth>
                    {job.job_title_general || '記載なし'}
                  </DetailRow>
                  <DetailRow label="目的" fullWidth>
                    {job.job_purpose_general || '記載なし'}
                  </DetailRow>
                  <DetailRow label="ジャンル">{job.job_genre_general || '記載なし'}</DetailRow>
                  <DetailRow label="人数">{job.job_number_general || '記載なし'}</DetailRow>
                  <DetailRow label="店名">{job.job_salon_name_general || '記載なし'}</DetailRow>
                  <DetailRow label="店名エリア">{job.job_salon_area_general || '記載なし'}</DetailRow>
                  <DetailRow label="最寄り駅">{job.job_nearest_station_general || '記載なし'}</DetailRow>
                  <DetailRow label="店の雰囲気">{job.job_salon_mood_general || '記載なし'}</DetailRow>
                  <DetailRow label="担当スタイリスト名">{job.job_stylist_name_general || '記載なし'}</DetailRow>
                </>
              )}
              <DetailRow label="モデルの性別条件">{job.job_model_gender || '記載なし'}</DetailRow>
              <DetailRow label="年齢・年代">{job.job_model_age_range || '記載なし'}</DetailRow>
              <DetailRow label="髪の条件">{job.job_model_hair_conditions || '記載なし'}</DetailRow>
              <DetailRow label="顔出し範囲">{job.job_model_face_visibility || '記載なし'}</DetailRow>
              <DetailRow label="経験">{job.job_model_experience || '記載なし'}</DetailRow>
              <DetailRow label="その他条件" fullWidth>
                {job.job_model_other_conditions || '記載なし'}
              </DetailRow>
              <DetailRow label="施術内容" fullWidth>
                {job.job_service_contents || '記載なし'}
              </DetailRow>
              <DetailRow label="施術後スタイル">{job.job_style_after || '記載なし'}</DetailRow>
              <DetailRow label="所要時間">{job.job_required_time || '記載なし'}</DetailRow>
              <DetailRow label="服装・メイク">{job.job_dress_makeup || '記載なし'}</DetailRow>
              <DetailRow label="同伴・撮影人数">{job.job_staff_count || '記載なし'}</DetailRow>
              <DetailRow label="報酬区分">{job.job_reward_type || '記載なし'}</DetailRow>
              <DetailRow label="報酬金額">{job.job_reward_cash || '記載なし'}</DetailRow>
              <DetailRow label="交通費">{job.job_reward_transport || '記載なし'}</DetailRow>
              <DetailRow label="報酬詳細">{job.job_reward_details || '記載なし'}</DetailRow>
              <DetailRow label="日付候補" fullWidth>
                {job.job_date_candidates || '記載なし'}
              </DetailRow>
              <DetailRow label="時間帯">{job.job_time_range || '記載なし'}</DetailRow>
              <DetailRow label="撮影場所">{job.job_shoot_location || '記載なし'}</DetailRow>
              <DetailRow label="集合場所">{job.job_meeting_point || '記載なし'}</DetailRow>
              <DetailRow label="写真の使用範囲">{job.job_photo_usage_scope || '記載なし'}</DetailRow>
            </div>

              <div className="flex justify-end">
                <Button size="lg" onClick={handleApply}>
                  応募する
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white shadow-sm p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-1/2">
              <div className="aspect-[4/3] bg-neutral-100 rounded-2xl overflow-hidden">
                <img src={clientMainImage} alt={clientDisplayName} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">クライアント紹介</p>
                <h2 className="text-xl font-semibold text-foreground">{clientDisplayName}</h2>
                <p className="text-sm text-muted-foreground">{clientMood}</p>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={clientContactImage}
                  alt={clientContactName}
                  className="w-14 h-14 rounded-full object-cover border border-border"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">{clientContactName}</p>
                  <p className="text-xs text-muted-foreground">担当者</p>
                </div>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{clientFeatures}</p>
              {client?.id && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/clients/${client.id}`}>クライアント詳細を見る</Link>
                </Button>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function DetailRow({
  label,
  children,
  fullWidth = false,
}: {
  label: string
  children: ReactNode
  fullWidth?: boolean
}) {
  return (
    <div className={`space-y-1 ${fullWidth ? 'md:col-span-2' : ''}`}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="p-3 rounded-xl border border-border bg-neutral-soft/60 text-foreground">{children}</div>
    </div>
  )
}
