"use client"

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { isLoggedIn } from '@/lib/auth'

type ClientProfile = {
  client_display_name?: string
  client_address?: string
}

type Client = {
  id: number
  name?: string
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
    job?.account_type === 'general' && Array.isArray(job.job_portfolio_images_general)
      ? job.job_portfolio_images_general[0]
      : FALLBACK_IMAGE

  const handleApply = () => {
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
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">募集の詳細</p>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">{displayTitle}</h1>
            <p className="text-sm text-muted-foreground">
              {client?.client_profile?.client_display_name || client?.name || 'クライアント名未設定'}
            </p>
          </div>
          <Button variant="outline" onClick={() => router.back()}>
            戻る
          </Button>
        </div>

        <section className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
          <div className="w-full aspect-video bg-neutral-100">
            <img src={heroImage} alt={displayTitle} className="w-full h-full object-cover" />
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
          </div>
        </section>
      </main>
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
