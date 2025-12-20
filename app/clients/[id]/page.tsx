"use client"

import Header from '@/components/header'
import { listUsers, UserRecord } from '@/lib/users'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Suspense, useEffect, useMemo, useState } from 'react'

type ClientProfile = NonNullable<UserRecord['client_profile']>

const FALLBACK_MAIN = 'https://placehold.co/800x500?text=Shop+Profile'

function ClientIntroContent() {
  const params = useParams()
  const router = useRouter()
  const clientId = useMemo(() => Number(params?.id), [params?.id])
  const [client, setClient] = useState<UserRecord | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!clientId) {
      setLoading(false)
      return
    }
    listUsers()
      .then(users => {
        const target = users.find(u => u.id === clientId && u.role === 'client') ?? null
        setClient(target)
      })
      .finally(() => setLoading(false))
  }, [clientId])

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center text-muted-foreground">読み込み中...</div>
  }

  if (!client || client.role !== 'client') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-muted-foreground">クライアント情報が見つかりませんでした。</p>
        <button
          className="text-primary text-sm underline"
          onClick={() => router.back()}
        >
          前のページに戻る
        </button>
      </div>
    )
  }

  const profile: ClientProfile = (client.client_profile as ClientProfile) ?? {}
  const displayName = profile.client_display_name || client.name || 'ショップ名未設定'
  const mainImage = profile.client_main_image || profile.client_sub_images?.[0] || FALLBACK_MAIN
  const subImages = (profile.client_sub_images ?? []).filter(Boolean)
  const mood = profile.client_mood || '雰囲気は準備中です'
  const features = profile.client_features
    ? profile.client_features.split(/\r?\n/).filter(Boolean)
    : []
  const contactName = profile.client_contact_name || client.client_contact_name || '担当者未設定'
  const contactPhoto = profile.client_contact_photo || ''
  const address = profile.client_address || client.client_address || '住所未設定'

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">クライアント紹介</p>
            <h1 className="text-3xl font-bold text-foreground">{displayName}</h1>
            <p className="text-sm text-muted-foreground">{address}</p>
          </div>
          <Link href="/search" className="text-sm text-primary underline">
            募集中の仕事を見る
          </Link>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-3">
            <div className="rounded-2xl overflow-hidden border border-border bg-neutral-100">
              <img src={mainImage} alt={displayName} className="w-full h-[360px] object-cover" />
            </div>
            {subImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {subImages.map((img, index) => (
                  <div key={`${img}-${index}`} className="rounded-xl overflow-hidden border border-border bg-neutral-50">
                    <img src={img} alt={`${displayName} サブ画像 ${index + 1}`} className="w-full h-32 object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-7 rounded-2xl border border-border bg-white shadow-sm p-6 md:p-8 space-y-6">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">Mood</p>
              <p className="text-base text-foreground leading-relaxed whitespace-pre-line">{mood}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {contactPhoto ? (
                  <img
                    src={contactPhoto}
                    alt={contactName}
                    className="w-14 h-14 rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center text-sm text-muted-foreground border border-border">
                    {contactName.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">担当者</p>
                  <p className="text-base font-semibold text-foreground">{contactName}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{profile.client_phone || '電話番号未設定'}</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">特徴</p>
              {features.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-sm text-foreground">
                  {features.map(feature => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">特徴の入力はまだありません</p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default function ClientIntroPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">読み込み中...</div>}>
      <ClientIntroContent />
    </Suspense>
  )
}
