"use client"

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { getSessionUser, isLoggedIn } from '@/lib/auth'
import { UserRecord } from '@/lib/users'

export default function ModelDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [modelUser, setModelUser] = useState<UserRecord | null>(null)
  const [loading, setLoading] = useState(true)

  const modelId = useMemo(() => Number(params?.id), [params?.id])

  useEffect(() => {
    const load = async () => {
      if (!modelId) return
      try {
        const res = await fetch('/api/users', { cache: 'no-store' })
        if (!res.ok) throw new Error('failed to fetch model')
        const users = (await res.json()) as UserRecord[]
        const matched = users.find(u => u.id === modelId && u.role === 'model') ?? null
        setModelUser(matched)
      } catch (error) {
        console.error('Failed to load model detail', error)
        setModelUser(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [modelId])

  const profile = modelUser?.model_profile as any
  const displayName = profile?.model_display_name || modelUser?.model_signup_name || modelUser?.name || '名称未設定'
  const mainImage = profile?.model_main_image || 'https://placehold.co/800x500?text=Model'
  const subImages = Array.isArray(profile?.model_sub_images) ? profile.model_sub_images.filter(Boolean).slice(0, 4) : []
  const genderLabel =
    profile?.model_gender === 'male'
      ? '男性'
      : profile?.model_gender === 'female'
        ? '女性'
        : profile?.model_gender === 'other'
          ? 'その他'
          : ''

  const handleApply = () => {
    if (!modelUser?.id) return
    if (!isLoggedIn()) {
      router.push(`/login?redirect=/models/${modelUser.id}`)
      return
    }
    router.push(`/apply/confirm?type=model&targetId=${modelUser.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        読み込み中...
      </div>
    )
  }

  if (!modelUser) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-muted-foreground">モデルが見つかりませんでした。</p>
        <Button variant="outline" onClick={() => router.push('/search?tab=models')}>
          モデル一覧へ戻る
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
            <p className="text-sm text-muted-foreground">モデルの詳細</p>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">{displayName}</h1>
          </div>
          <Button variant="outline" onClick={() => router.back()}>
            戻る
          </Button>
        </div>

        <section className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-0">
            <div className="p-6 md:p-8 space-y-3 bg-neutral-50">
              <div className="w-full aspect-[4/3] max-h-[320px] bg-neutral-100 rounded-2xl overflow-hidden">
                <img src={mainImage} alt={displayName} className="w-full h-full object-cover" />
              </div>
              {subImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {subImages.map((image: string, index: number) => (
                    <div key={`${image}-${index}`} className="aspect-[4/3] bg-neutral-100 rounded-xl overflow-hidden">
                      <img src={image} alt={`${displayName} ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6 md:p-8 space-y-6">
            <div className="flex flex-wrap gap-2 text-xs md:text-sm text-muted-foreground">
              <span className="px-3 py-1 rounded-full bg-primary-light text-primary border border-primary/20">
                {profile?.model_activity_area || '活動エリア未設定'}
              </span>
              <span className="px-3 py-1 rounded-full bg-accent/20 text-foreground border border-border/60">
                {profile?.model_job_category || '職業未設定'}
              </span>
              <span className="px-3 py-1 rounded-full bg-neutral-soft text-foreground border border-border/60">
                {genderLabel || '性別未設定'}
              </span>
              <span className="px-3 py-1 rounded-full bg-neutral-soft text-foreground border border-border/60">
                {profile?.model_height ? `${profile.model_height}cm` : '身長未設定'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <DetailRow label="自己紹介" fullWidth>
                {profile?.model_self_intro || '未入力'}
              </DetailRow>
              <DetailRow label="趣味" fullWidth>
                {profile?.model_hobbies || '未入力'}
              </DetailRow>
              <DetailRow label="髪型">{profile?.model_hair_style || '未入力'}</DetailRow>
              <DetailRow label="体形">{profile?.model_body_type || '未入力'}</DetailRow>
              <DetailRow label="職業">{profile?.model_job_category || '未入力'}</DetailRow>
              <DetailRow label="活動地域">{profile?.model_activity_area || '未入力'}</DetailRow>
              <DetailRow label="性別">{genderLabel || '未入力'}</DetailRow>
              <DetailRow label="身長">{profile?.model_height ? `${profile.model_height}cm` : '未入力'}</DetailRow>
              <DetailRow label="避けたい条件">{profile?.model_ng_conditions || '未入力'}</DetailRow>
              <DetailRow label="実績" fullWidth>
                {profile?.model_achievements || '未入力'}
              </DetailRow>
            </div>

            <div className="flex justify-end">
              <Button size="lg" onClick={handleApply}>
                応募する
              </Button>
            </div>
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
  children: React.ReactNode
  fullWidth?: boolean
}) {
  return (
    <div className={`space-y-1 ${fullWidth ? 'md:col-span-2' : ''}`}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="p-3 rounded-xl border border-border bg-neutral-soft/60 text-foreground">{children}</div>
    </div>
  )
}
