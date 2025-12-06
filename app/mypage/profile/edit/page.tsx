"use client"

import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { clearSessionUser, getSessionUser } from '@/lib/auth'
import { ClientProfile, ModelProfile, StudentAccountStatus, updateUserProfile, UserRecord } from '@/lib/users'
import { LogOut, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

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

export default function ProfileEditPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserRecord | null>(null)
  const [modelProfile, setModelProfile] = useState<ModelProfile>(emptyModelProfile)
  const [clientProfile, setClientProfile] = useState<ClientProfile>(emptyClientProfile)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const session = getSessionUser()
    if (!session) {
      router.replace('/login?redirect=/mypage/profile/edit')
      return
    }
    setUser(session)
    if (session.model_profile) setModelProfile(session.model_profile as ModelProfile)
    if (session.client_profile) setClientProfile(session.client_profile as ClientProfile)
  }, [router])

  const isModel = user?.role === 'model'

  const handleSave = async () => {
    if (!user) return
    setMessage(null)
    setError(null)
    try {
      const updated = await updateUserProfile(user.id, isModel ? { model_profile: modelProfile } : { client_profile: clientProfile })
      setUser(updated)
      setMessage('プロフィールを保存しました。')
    } catch (err) {
      console.error(err)
      setError('保存に失敗しました。')
    }
  }

  const handleLogout = () => {
    clearSessionUser()
    router.replace('/login')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">プロフィール編集</p>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {isModel ? 'モデルプロフィール' : 'クライアントプロフィール'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push('/mypage')}>
              マイページへ戻る
            </Button>
            <Button variant="outline" size="sm" className="border-destructive text-destructive" onClick={handleLogout}>
              <LogOut className="size-4" />
              ログアウト
            </Button>
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {message && <p className="text-sm text-primary">{message}</p>}

        {isModel ? (
          <section className="rounded-2xl border border-border bg-white shadow-sm p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="モデル名 *" value={modelProfile.model_display_name} onChange={v => setModelProfile(prev => ({ ...prev, model_display_name: v }))} />
              <Field label="生年月日 *" type="date" value={modelProfile.model_birthdate} onChange={v => setModelProfile(prev => ({ ...prev, model_birthdate: v }))} />
              <SelectField
                label="性別 *"
                value={modelProfile.model_gender}
                options={[
                  { value: '', label: '選択してください' },
                  { value: 'female', label: '女性' },
                  { value: 'male', label: '男性' },
                  { value: 'other', label: 'その他' },
                ]}
                onChange={v => setModelProfile(prev => ({ ...prev, model_gender: v as ModelProfile['model_gender'] }))}
              />
              <Field label="活動地域 *" value={modelProfile.model_activity_area} onChange={v => setModelProfile(prev => ({ ...prev, model_activity_area: v }))} />
              <Field
                label="モデルタイプ（カンマ区切り）"
                value={modelProfile.model_types.join(', ')}
                onChange={v => setModelProfile(prev => ({ ...prev, model_types: v.split(',').map(item => item.trim()).filter(Boolean) }))}
                placeholder="スチール, CF, ショー"
              />
              <Field label="身長 *" value={modelProfile.model_height} onChange={v => setModelProfile(prev => ({ ...prev, model_height: v }))} />
              <Field label="バスト" value={modelProfile.model_bust} onChange={v => setModelProfile(prev => ({ ...prev, model_bust: v }))} />
              <Field label="ウエスト" value={modelProfile.model_waist} onChange={v => setModelProfile(prev => ({ ...prev, model_waist: v }))} />
              <Field label="ヒップ" value={modelProfile.model_hip} onChange={v => setModelProfile(prev => ({ ...prev, model_hip: v }))} />
              <Field label="靴サイズ" value={modelProfile.model_shoes_size} onChange={v => setModelProfile(prev => ({ ...prev, model_shoes_size: v }))} />
              <Field label="体形 *" value={modelProfile.model_body_type} onChange={v => setModelProfile(prev => ({ ...prev, model_body_type: v }))} />
              <SelectField
                label="髪型 *"
                value={modelProfile.model_hair_style}
                options={[
                  { value: '', label: '選択してください' },
                  ...['ショート', 'ミディアム', 'ロング', 'セミロング', 'ベリーショート', 'スーパーロング', 'ウルフ', 'アシンメトリー', 'サーファー', 'ボブ', 'モヒカン', 'ストレート', 'ドレッド', 'マッシュ', '坊主', 'スキンヘッド'].map(style => ({
                    value: style,
                    label: style,
                  })),
                ]}
                onChange={v => setModelProfile(prev => ({ ...prev, model_hair_style: v }))}
              />
              <Field label="メイン画像URL *" value={modelProfile.model_main_image} onChange={v => setModelProfile(prev => ({ ...prev, model_main_image: v }))} placeholder="https://..." />
              <Field
                label="サブ画像URL（カンマ区切り）"
                value={modelProfile.model_sub_images.join(', ')}
                onChange={v => setModelProfile(prev => ({ ...prev, model_sub_images: v.split(',').map(item => item.trim()).filter(Boolean) }))}
                placeholder="https://... , https://..."
              />
              <Field label="職業 *" value={modelProfile.model_job_category} onChange={v => setModelProfile(prev => ({ ...prev, model_job_category: v }))} placeholder="学生 / 会社員 など" />
              <Field label="趣味 *" value={modelProfile.model_hobbies} onChange={v => setModelProfile(prev => ({ ...prev, model_hobbies: v }))} />
              <TextareaField label="避けたい条件" value={modelProfile.model_ng_conditions} onChange={v => setModelProfile(prev => ({ ...prev, model_ng_conditions: v }))} />
              <TextareaField label="自己紹介" value={modelProfile.model_self_intro} onChange={v => setModelProfile(prev => ({ ...prev, model_self_intro: v }))} />
              <TextareaField label="実績" value={modelProfile.model_achievements} onChange={v => setModelProfile(prev => ({ ...prev, model_achievements: v }))} />
              <SelectField
                label="公開設定 *"
                value={modelProfile.model_profile_visibility}
                options={[
                  { value: 'public', label: '公開する' },
                  { value: 'private', label: '公開しない' },
                ]}
                onChange={v => setModelProfile(prev => ({ ...prev, model_profile_visibility: v as ModelProfile['model_profile_visibility'] }))}
                helper="「公開しない」の場合は検索・一覧から除外されます。"
              />
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-border bg-white shadow-sm p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="公開名 *" value={clientProfile.client_display_name} onChange={v => setClientProfile(prev => ({ ...prev, client_display_name: v }))} />
              <Field label="会社名（個人名） *" value={clientProfile.client_company_or_personal_name} onChange={v => setClientProfile(prev => ({ ...prev, client_company_or_personal_name: v }))} />
              <Field label="担当者名 *" value={clientProfile.client_contact_name} onChange={v => setClientProfile(prev => ({ ...prev, client_contact_name: v }))} />
              <SelectField
                label="担当者の性別 *"
                value={clientProfile.client_contact_gender}
                options={[
                  { value: 'male', label: '男性' },
                  { value: 'female', label: '女性' },
                  { value: 'other', label: 'その他' },
                ]}
                onChange={v => setClientProfile(prev => ({ ...prev, client_contact_gender: v as ClientProfile['client_contact_gender'] }))}
              />
              <Field label="住所 *" value={clientProfile.client_address} onChange={v => setClientProfile(prev => ({ ...prev, client_address: v }))} />
              <Field label="電話番号" value={clientProfile.client_phone} onChange={v => setClientProfile(prev => ({ ...prev, client_phone: v }))} />
              <Field label="学生証画像URL" value={clientProfile.client_student_id_image} onChange={v => setClientProfile(prev => ({ ...prev, client_student_id_image: v }))} />
              <SelectField
                label="学生アカウントステータス"
                value={clientProfile.student_account_status}
                options={[
                  { value: 'pending', label: 'pending' },
                  { value: 'approved', label: 'approved' },
                  { value: 'rejected', label: 'rejected' },
                ]}
                onChange={v => setClientProfile(prev => ({ ...prev, student_account_status: v as StudentAccountStatus }))}
                helper="承認済みの場合のみ学生用の募集フォームが有効です。"
              />
            </div>
          </section>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSave} className="bg-primary text-primary-foreground">
            <Save className="size-4 mr-2" />
            保存する
          </Button>
        </div>
      </main>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string
  value: string
  type?: string
  placeholder?: string
  onChange: (v: string) => void
}) {
  return (
    <label className="space-y-2 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border border-border"
      />
    </label>
  )
}

function TextareaField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <label className="space-y-2 text-sm md:col-span-2">
      <span className="font-medium text-foreground">{label}</span>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={3}
        className="w-full px-4 py-2 rounded-lg border border-border"
      />
    </label>
  )
}

function SelectField({
  label,
  value,
  options,
  onChange,
  helper,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  helper?: string
  onChange: (v: string) => void
}) {
  return (
    <label className="space-y-2 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border border-border"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helper && <p className="text-xs text-muted-foreground">{helper}</p>}
    </label>
  )
}
