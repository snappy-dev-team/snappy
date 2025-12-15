"use client"

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { createApplication } from '@/lib/applications'
import { getSessionUser } from '@/lib/auth'
import { UserRecord } from '@/lib/users'

type JobDetail = {
  id: number
  account_type?: 'general' | 'student'
  client_id?: number
  job_title_general?: string
  job_title_student?: string
}

function ApplyConfirmPage() {
  const router = useRouter()
  const params = useSearchParams()

  const targetId = useMemo(() => Number(params.get('targetId')), [params])
  const type = params.get('type') as 'job' | 'model' | null

  const [job, setJob] = useState<JobDetail | null>(null)
  const [modelUser, setModelUser] = useState<UserRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const session = getSessionUser()
    if (!session) {
      router.replace(`/login?redirect=/apply/confirm?type=${type ?? ''}&targetId=${targetId ?? ''}`)
      return
    }
  }, [router, targetId, type])

  useEffect(() => {
    const load = async () => {
      if (!targetId || !type) {
        setError('応募対象が見つかりませんでした')
        setLoading(false)
        return
      }
      try {
        if (type === 'job') {
          const res = await fetch('/api/jobs', { cache: 'no-store' })
          if (!res.ok) throw new Error('failed to fetch job')
          const jobs = (await res.json()) as JobDetail[]
          const matched = jobs.find(j => j.id === targetId) ?? null
          if (!matched) throw new Error('job not found')
          setJob(matched)
        } else {
          const res = await fetch('/api/users', { cache: 'no-store' })
          if (!res.ok) throw new Error('failed to fetch model')
          const users = (await res.json()) as UserRecord[]
          const matched = users.find(u => u.id === targetId && u.role === 'model') ?? null
          if (!matched) throw new Error('model not found')
          setModelUser(matched)
        }
      } catch (err) {
        console.error('Failed to load target', err)
        setError('応募対象が見つかりませんでした')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [targetId, type])

  const handleSubmit = async () => {
    const session = getSessionUser()
    if (!session) {
      router.replace(`/login?redirect=/apply/confirm?type=${type ?? ''}&targetId=${targetId ?? ''}`)
      return
    }
    if (!type || !targetId) return

    setSubmitting(true)
    setError(null)
    try {
      if (type === 'job' && job) {
        await createApplication({
          applicant_user_id: session.id,
          applicant_role: session.role,
          target_job_id: job.id,
          target_owner_user_id: job.client_id,
        })
      } else if (type === 'model' && modelUser) {
        await createApplication({
          applicant_user_id: session.id,
          applicant_role: session.role,
          target_model_user_id: modelUser.id,
          target_owner_user_id: modelUser.id,
        })
      } else {
        throw new Error('応募対象が不足しています')
      }
      router.replace('/apply/thanks')
    } catch (err) {
      console.error(err)
      setError('応募に失敗しました。時間をおいて再度お試しください。')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        読み込み中...
      </div>
    )
  }

  if (error || (!job && !modelUser)) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-destructive">{error ?? '応募対象が見つかりませんでした。'}</p>
        <Button variant="outline" onClick={() => router.push('/search')}>
          一覧へ戻る
        </Button>
      </div>
    )
  }

  const title = type === 'job' ? job?.job_title_general || job?.job_title_student || '募集' : (modelUser?.model_profile as any)?.model_display_name || modelUser?.name || 'モデル'

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-xl mx-auto px-4 md:px-6 py-10 space-y-6">
        <h1 className="text-2xl font-bold text-foreground">応募の確認</h1>
        <p className="text-sm text-muted-foreground">以下の対象に応募します。内容をご確認ください。</p>

        <div className="rounded-2xl border border-border bg-white shadow-sm p-5 space-y-3">
          <p className="text-sm text-muted-foreground">応募対象</p>
          <p className="text-lg font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">
            {type === 'job' ? '募集への応募' : 'モデルへの応募'}
          </p>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => router.back()} disabled={submitting}>
            戻る
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? '送信中...' : 'この内容で応募する'}
          </Button>
        </div>
      </main>
    </div>
  )
}

export default function ApplyConfirmPageWithSuspense() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">読み込み中...</div>}>
      <ApplyConfirmPage />
    </Suspense>
  )
}
