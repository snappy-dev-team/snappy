"use client"

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { isLoggedIn } from '@/lib/auth'

type ClientProfile = {
  client_display_name?: string
  client_address?: string
  client_main_image?: string
  client_sub_images?: string[]
  client_mood?: string
  client_features?: string
  client_contact_photo?: string
  client_contact_name?: string
}

type Client = {
  id: number
  name?: string
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
  const [applyMessage, setApplyMessage] = useState<string | null>(null)
  const [applyError, setApplyError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [applicantName, setApplicantName] = useState<string>('あなた')
  const [applicantId, setApplicantId] = useState<number | null>(null)

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

  const heroImage =
    job?.account_type === 'general' && Array.isArray(job.job_portfolio_images_general) && job.job_portfolio_images_general[0]
      ? job.job_portfolio_images_general[0]
      : FALLBACK_IMAGE

  const clientDisplayName = client?.client_profile?.client_display_name || client?.name || 'ショップ名未設定'
  const clientMainImage = client?.client_profile?.client_main_image || heroImage
  const clientSubImages =
    (client?.client_profile?.client_sub_images ??
      (job?.account_type === 'general' ? job.job_portfolio_images_general?.slice(1) : []) ??
      []
    ).filter(Boolean)
  const clientMood = client?.client_profile?.client_mood || job?.job_salon_mood_general || '雰囲気は準備中です'
  const clientFeatures = client?.client_profile?.client_features
    ? client.client_profile.client_features.split(/\r?\n/).filter(Boolean)
    : []
  const clientContactName =
    client?.client_profile?.client_contact_name || client?.client_contact_name || job?.job_stylist_name_general || '担当者未設定'
  const clientContactPhoto = client?.client_profile?.client_contact_photo || ''

  const handleApply = () => {
    setApplyError(null)
    setApplyMessage(null)
    if (!job?.id) return
    if (!isLoggedIn()) {
      router.push(`/login?redirect=/jobs/${job.id}`)
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
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">募集の詳細</p>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">{displayTitle}</h1>
            <p className="text-sm text-muted-foreground">
              {client?.client_profile?.client_display_name || client?.name || 'クライアント名未設定'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {client?.id && (
              <Link href={`/clients/${client.id}`} className="text-sm text-primary underline">
                クライアント紹介を見る
              </Link>
            )}
            <Button variant="outline" onClick={() => router.back()}>
              戻る
            </Button>
          </div>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-3">
            <div className="rounded-2xl border border-border bg-neutral-100 overflow-hidden">
              <img src={clientMainImage} alt={displayTitle} className="w-full h-[320px] object-cover" />
            </div>
            {clientSubImages.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {clientSubImages.slice(0, 4).map((img, index) => (
                  <div key={`${img}-${index}`} className="rounded-xl overflow-hidden border border-border bg-neutral-50">
                    <img src={img} alt={`${displayTitle} サブ画像 ${index + 1}`} className="w-full h-32 object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-7 rounded-2xl border border-border bg-white shadow-sm p-6 md:p-8 space-y-6">
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
              <DetailRow label="報酬">{reward}</DetailRow>
              <DetailRow label="交通費">{(job as any).job_reward_transport || '記載なし'}</DetailRow>
              <DetailRow label="希望する条件">
                {job?.account_type === 'student'
                  ? job.job_model_other_conditions || job.job_model_hair_conditions || '記載なし'
                  : job?.job_model_other_conditions || job?.job_model_hair_conditions || '記載なし'}
              </DetailRow>
              <DetailRow label="施術・撮影内容">
                {job?.account_type === 'student'
                  ? job.job_service_contents || job.job_style_after || '記載なし'
                  : job?.job_service_contents || job?.job_style_after || '記載なし'}
              </DetailRow>
            </div>

            <div className="flex justify-end">
              <Button size="lg" onClick={handleApply}>
                応募する
              </Button>
            </div>

            {applyMessage && (
              <p className="text-sm text-primary mt-2">{applyMessage}</p>
            )}
          </div>
        </section>

        <ClientHighlight
          clientId={client?.id}
          name={clientDisplayName}
          mainImage={clientMainImage}
          contactName={clientContactName}
          contactPhoto={clientContactPhoto}
          mood={clientMood}
          features={clientFeatures}
        />
      </main>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground">応募内容の確認</p>
                <h3 className="text-xl font-semibold text-foreground">{displayTitle}</h3>
                <p className="text-sm text-muted-foreground">応募者: {applicantName}</p>
                <p className="text-sm text-muted-foreground">クライアント: {clientDisplayName}</p>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-neutral-soft/60 p-4 space-y-2 text-sm text-foreground">
              <p>場所: {location}</p>
              <p>時間: {timeframe}</p>
              <p>報酬: {reward}</p>
            </div>

            {applyError && <p className="text-sm text-destructive">{applyError}</p>}

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowConfirm(false)} disabled={isSubmitting}>
                戻る
              </Button>
              <Button onClick={handleConfirmApply} disabled={isSubmitting || !applicantId}>
                {isSubmitting ? '送信中...' : 'この内容で送信'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="p-3 rounded-xl border border-border bg-neutral-soft/60 text-foreground">{children}</div>
    </div>
  )
}

function ClientHighlight({
  clientId,
  name,
  mainImage,
  contactName,
  contactPhoto,
  mood,
  features,
}: {
  clientId?: number
  name: string
  mainImage: string
  contactName: string
  contactPhoto: string
  mood: string
  features: string[]
}) {
  return (
    <section className="rounded-2xl border border-border bg-neutral-soft/40 p-6 md:p-8 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">クライアントの詳細</h3>
        {clientId && (
          <Link href={`/clients/${clientId}`} className="text-sm text-primary underline">
            もっと見る
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-4 rounded-xl overflow-hidden border border-border bg-white">
          <img src={mainImage} alt={name} className="w-full h-40 object-cover" />
        </div>
        <div className="md:col-span-8 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">ショップ名</p>
              <p className="text-base font-semibold text-foreground">{name}</p>
            </div>
            <div className="flex items-center gap-2">
              {contactPhoto ? (
                <img src={contactPhoto} alt={contactName} className="w-10 h-10 rounded-full object-cover border border-border" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-xs text-muted-foreground">
                  {contactName.slice(0, 1).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-[11px] text-muted-foreground">担当者</p>
                <p className="text-sm font-medium text-foreground">{contactName}</p>
              </div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {mood}
          </div>
          {features.length > 0 && (
            <div className="text-sm text-foreground">
              <p className="text-xs text-muted-foreground mb-1">特徴</p>
              <div className="flex flex-wrap gap-2">
                {features.map(feature => (
                  <span key={feature} className="px-3 py-1 rounded-full bg-white border border-border text-xs">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
