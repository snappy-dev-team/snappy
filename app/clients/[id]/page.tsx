"use client"

import Header from '@/components/header'
import { ClientProfile, listUsers, UserRecord } from '@/lib/users'
import { useParams } from 'next/navigation'
import { Suspense, useEffect, useState, type ReactNode } from 'react'

const FALLBACK_MAIN_IMAGE = 'https://placehold.co/800x600?text=Salon+Photo'
const FALLBACK_CONTACT_IMAGE = 'https://placehold.co/200x200?text=Staff'

function ClientIntroContent() {
  const params = useParams()
  const id = params?.id ? Number(params.id) : NaN
  const [user, setUser] = useState<UserRecord | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (Number.isNaN(id)) {
      setLoading(false)
      return
    }
    listUsers()
      .then(users => {
        const target = users.find(u => u.id === id)
        if (target) setUser(target)
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center text-muted-foreground">読み込み中...</div>
  }

  if (!user || user.role !== 'client') {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-4xl mx-auto px-4 md:px-8 py-12">
          <p className="text-sm text-muted-foreground">クライアント情報が見つかりませんでした。</p>
        </main>
      </div>
    )
  }

  const profile = user.client_profile as ClientProfile | undefined
  const displayName = profile?.client_display_name || user.client_company_or_personal_name || user.name || 'サロン'
  const mainImage = profile?.client_main_image || FALLBACK_MAIN_IMAGE
  const subImages = (profile?.client_sub_images ?? []).filter(Boolean)
  const mood = profile?.client_shop_mood || '雰囲気は未入力です。'
  const features = profile?.client_shop_features || '特徴は未入力です。'
  const contactName = profile?.client_contact_name || user.client_contact_name || '担当者未設定'
  const contactImage = profile?.client_contact_image || FALLBACK_CONTACT_IMAGE
  const address = profile?.client_address || user.client_address || '所在地未入力'

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-10 space-y-8">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">クライアント紹介</p>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{displayName}</h1>
          <p className="text-sm text-muted-foreground">{mood}</p>
        </div>

        <section className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-0">
            <div className="p-6 md:p-8 space-y-3 bg-neutral-50">
              <div className="w-full aspect-[4/3] max-h-[320px] bg-neutral-100 rounded-2xl overflow-hidden">
                <img src={mainImage} alt={displayName} className="w-full h-full object-cover" />
              </div>
              {subImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {subImages.map((image, index) => (
                    <div key={`${image}-${index}`} className="aspect-[4/3] bg-neutral-100 rounded-xl overflow-hidden">
                      <img src={image} alt={`${displayName} ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6 md:p-8 space-y-4">
              <DetailRow label="店名">{displayName}</DetailRow>
              <DetailRow label="雰囲気">{mood}</DetailRow>
              <DetailRow label="特徴">{features}</DetailRow>
              <DetailRow label="所在地">{address}</DetailRow>
              <div className="rounded-xl border border-border bg-neutral-soft/60 p-4">
                <p className="text-xs text-muted-foreground">担当者</p>
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={contactImage}
                    alt={contactName}
                    className="w-14 h-14 rounded-full object-cover border border-border"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{contactName}</p>
                    <p className="text-xs text-muted-foreground">ご質問はお気軽にご連絡ください</p>
                  </div>
                </div>
              </div>
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

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="p-3 rounded-xl border border-border bg-neutral-soft/60 text-foreground">{children}</div>
    </div>
  )
}
