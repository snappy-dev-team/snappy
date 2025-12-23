"use client"

import Header from '@/components/header'
import { listUsers, UserRecord } from '@/lib/users'
import { useParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

const publicFields: { key: string; label: string }[] = [
  { key: 'model_activity_area', label: '活動地域' },
  { key: 'model_available_time', label: '活動可能時間' },
  { key: 'model_types', label: 'モデルタイプ' },
  { key: 'model_height', label: '身長' },
  { key: 'model_body_type', label: '体形' },
  { key: 'model_hair_style', label: '髪型' },
  { key: 'model_job_category', label: '職業' },
  { key: 'model_hobbies', label: '趣味' },
  { key: 'model_self_intro', label: '自己紹介' },
  { key: 'model_achievements', label: '実績' },
]

function ProfilePageContent() {
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
  if (!user || user.role !== 'model') {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-4xl mx-auto px-4 md:px-8 py-12">
          <p className="text-sm text-muted-foreground">プロフィールが見つかりませんでした。</p>
        </main>
      </div>
    )
  }

  const profile = user.model_profile as any
  if (profile?.model_profile_visibility === 'private') {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-4xl mx-auto px-4 md:px-8 py-12">
          <p className="text-sm text-muted-foreground">このプロフィールは非公開です。</p>
        </main>
      </div>
    )
  }

  const displayName = profile?.model_display_name || user.model_signup_name || user.name || 'モデル'

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2 rounded-2xl overflow-hidden border border-border bg-neutral-100">
            <img
              src={profile?.model_main_image || 'https://placehold.co/600x800?text=Profile'}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">モデルプロフィール</p>
              <h1 className="text-3xl font-bold text-foreground">{displayName}</h1>
              <p className="text-sm text-muted-foreground mt-1">{profile?.model_activity_area}</p>
            </div>
            {profile?.model_sub_images?.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {profile.model_sub_images.map((img: string) => (
                  <img key={img} src={img} alt="サブ画像" className="w-full h-28 object-cover rounded-lg border border-border" />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {publicFields.map(field => {
            const value = field.key === 'model_types'
              ? (profile?.model_types ?? []).join(' / ')
              : profile?.[field.key]
            if (!value) return null
            return (
              <div key={field.key} className="rounded-xl border border-border p-4 bg-white shadow-sm">
                <p className="text-xs text-muted-foreground">{field.label}</p>
                <p className="text-sm font-medium text-foreground mt-1 whitespace-pre-line">{value}</p>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">読み込み中...</div>}>
      <ProfilePageContent />
    </Suspense>
  )
}
