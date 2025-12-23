"use client"

import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { ImageUpload, MultiImageUpload } from '@/components/ui/ImageUpload'
import { SelectInput } from '@/components/ui/SelectInput'
import { TextInput } from '@/components/ui/TextInput'
import { Textarea } from '@/components/ui/Textarea'
import { AREA_OPTIONS, GENDER_OPTIONS, HAIR_STYLE_OPTIONS } from '@/constants/search-options'
import { clearSessionUser, getSessionUser, setSessionUser } from '@/lib/auth'
import { ClientProfile, ModelProfile, updateUserProfile, UserRecord } from '@/lib/users'
import { LogOut, Palette, Save, Share2, Sparkles, Wand2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type ReactNode, useEffect, useState } from 'react'

const emptyModelProfile: ModelProfile = {
  model_display_name: '',
  model_birthdate: '',
  model_gender: '',
  model_activity_area: '',
  model_available_time: '',
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
  contact_sns_type: '',
  contact_sns_id: '',
}

const emptyClientProfile: ClientProfile = {
  client_display_name: '',
  client_company_or_personal_name: '',
  client_contact_name: '',
  client_contact_gender: '',
  client_main_image: '',
  client_sub_images: [],
  client_shop_mood: '',
  client_shop_features: '',
  client_contact_image: '',
  client_address: '',
  client_phone: '',
  client_student_plan: false,
  client_student_id_image: '',
  student_account_status: 'pending',
  contact_sns_type: '',
  contact_sns_id: '',
}

export default function ProfileEditPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserRecord | null>(null)
  const [modelProfile, setModelProfile] = useState<ModelProfile>(emptyModelProfile)
  const [clientProfile, setClientProfile] = useState<ClientProfile>(emptyClientProfile)
  const [clientEmail, setClientEmail] = useState<string>('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const session = getSessionUser()
    if (!session) {
      router.replace('/login?redirect=/mypage/profile/edit')
      return
    }
    setUser(session)
    if (session.model_profile) setModelProfile({ ...emptyModelProfile, ...(session.model_profile as ModelProfile) })
    if (session.client_profile) setClientProfile({ ...emptyClientProfile, ...(session.client_profile as ClientProfile) })
    if (session.email) setClientEmail(session.email)
  }, [router])

  const isModel = user?.role === 'model'

  const updateModelProfile = (updates: Partial<ModelProfile>) => {
    setModelProfile(prev => ({ ...prev, ...updates }))
  }

  const updateClientProfile = (updates: Partial<ClientProfile>) => {
    setClientProfile(prev => ({ ...prev, ...updates }))
  }

  const handleSave = async () => {
    if (!user) return
    setMessage(null)
    setError(null)
    try {
      const updates = isModel
        ? { model_profile: modelProfile }
        : { client_profile: clientProfile, email: clientEmail }

      const updated = await updateUserProfile(user.id, updates)
      setUser(updated)
      setSessionUser(updated)
      setMessage('プロフィールを保存しました')
      router.push('/mypage')
    } catch (err) {
      console.error(err)
      setError('保存に失敗しました。時間をおいて再度お試しください')
    }
  }

  const handleLogout = () => {
    clearSessionUser()
    router.replace('/login')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-white to-white">
      <Header />
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-10 space-y-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-primary/20 bg-white/90 p-6 shadow-lg shadow-primary/10 backdrop-blur">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-primary">
                <Sparkles className="size-4" />
                Profile Studio
              </p>
              <h1 className="text-xl md:text-4xl font-bold text-foreground">
                {isModel ? 'モデルプロフィール' : 'クライアントプロフィール'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => router.push('/mypage')}>
                マイページへ戻る
              </Button>
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {message && <p className="text-sm text-primary">{message}</p>}
        </div>

        {isModel ? (
          <ModelForm profile={modelProfile} onChange={updateModelProfile} />
        ) : (
          <ClientForm profile={clientProfile} onChange={updateClientProfile} email={clientEmail} onEmailChange={setClientEmail} />
        )}

        <div className="sticky bottom-6 flex justify-end">
          <Button
            onClick={handleSave}
            className="bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/40"
          >
            <Save className="size-4 mr-2" />
            保存する
          </Button>
        </div>
      </main>
    </div>
  )
}

function ModelForm({
  profile,
  onChange,
}: {
  profile: ModelProfile
  onChange: (updates: Partial<ModelProfile>) => void
}) {
  const modelTypesValue = profile.model_types.join(', ')

  return (
    <div className="space-y-6">
      <FormSection
        title="基本情報"
        icon={<Wand2 className="size-4" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="モデル表示名"
            required
            value={profile.model_display_name}
            placeholder="山田 花子"
            onChange={value => onChange({ model_display_name: value })}
          />
          <TextInput
            label="生年月日"
            required
            type="date"
            value={profile.model_birthdate}
            onChange={value => onChange({ model_birthdate: value })}
          />
          <SelectInput
            label="性別"
            required
            value={profile.model_gender}
            options={GENDER_OPTIONS}
            onChange={value => onChange({ model_gender: value as ModelProfile['model_gender'] })}
          />
          <SelectInput
            label="活動エリア"
            required
            value={profile.model_activity_area}
            options={AREA_OPTIONS}
            onChange={value => onChange({ model_activity_area: value })}
          />
          <TextInput
            label="活動可能時間"
            value={profile.model_available_time}
            placeholder="例：平日18:00-22:00 / 土日午前"
            onChange={value => onChange({ model_available_time: value })}
          />
          <TextInput
            label="モデルタイプ"
            value={modelTypesValue}
            placeholder="例：スチール, CF, ショー"
            helperText="カンマ区切りで入力してください"
            onChange={value =>
              onChange({
                model_types: value
                  .split(',')
                  .map(item => item.trim())
                  .filter(Boolean),
              })
            }
          />
          <TextInput
            label="職業"
            required
            placeholder="学生 / 会社員 など"
            value={profile.model_job_category}
            onChange={value => onChange({ model_job_category: value })}
          />
          <TextInput
            label="趣味"
            required
            value={profile.model_hobbies}
            onChange={value => onChange({ model_hobbies: value })}
          />
        </div>
      </FormSection>

      <FormSection
        title="スタイル・サイズ"
        icon={<Palette className="size-4" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TextInput
            label="身長"
            required
            placeholder="例：170cm"
            value={profile.model_height}
            onChange={value => onChange({ model_height: value })}
          />
          <TextInput
            label="バスト"
            required
            placeholder="例：80cm"
            value={profile.model_bust}
            onChange={value => onChange({ model_bust: value })}
          />
          <TextInput
            label="ウエスト"
            required
            placeholder="例：60cm"
            value={profile.model_waist}
            onChange={value => onChange({ model_waist: value })}
          />
          <TextInput
            label="ヒップ"
            required
            placeholder="例：86cm"
            value={profile.model_hip}
            onChange={value => onChange({ model_hip: value })}
          />
          <TextInput
            label="靴サイズ"
            placeholder="例：24.5cm"
            value={profile.model_shoes_size}
            onChange={value => onChange({ model_shoes_size: value })}
          />
          <TextInput
            label="体形"
            required
            placeholder="例：スレンダー"
            value={profile.model_body_type}
            onChange={value => onChange({ model_body_type: value })}
          />
          <SelectInput
            label="髪質"
            required
            value={profile.model_hair_style}
            options={HAIR_STYLE_OPTIONS}
            onChange={value => onChange({ model_hair_style: value })}
          />
        </div>
      </FormSection>

      <FormSection
        title="ビジュアル & 自己紹介"
        icon={<Sparkles className="size-4" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUpload
            label="メイン画像"
            value={profile.model_main_image}
            onChange={value => onChange({ model_main_image: value })}
            helperText="5MB以内・正方形推奨"
          />
          <MultiImageUpload
            label="サブ画像"
            values={profile.model_sub_images}
            onChange={values => onChange({ model_sub_images: values })}
            helperText="複数枚アップロードできます"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Textarea
            label="自己紹介"
            rows={4}
            value={profile.model_self_intro}
            onChange={value => onChange({ model_self_intro: value })}
            helperText="あなたらしさが伝わる短い文章でOK"
          />
          <Textarea
            label="実績"
            rows={4}
            value={profile.model_achievements}
            onChange={value => onChange({ model_achievements: value })}
            helperText="出演歴や撮影経験など"
          />
          <Textarea
            label="避けたい条件"
            rows={3}
            value={profile.model_ng_conditions}
            onChange={value => onChange({ model_ng_conditions: value })}
          />
        </div>
      </FormSection>

      <FormSection
        title="連絡・公開設定"
        icon={<Share2 className="size-4" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectInput
            label="SNS種別（任意）"
            value={profile.contact_sns_type ?? ''}
            options={[
              { value: '', label: '選択してください' },
              { value: 'instagram', label: 'Instagram' },
              { value: 'twitter', label: 'Twitter' },
              { value: 'other', label: 'その他' },
            ]}
            helperText="SNSは任意です"
            onChange={value => onChange({ contact_sns_type: value as any })}
          />
          <TextInput
            label="SNS ID / 連絡先（任意）"
            placeholder="@example など。その他の場合は「TikTok @example」のように入力"
            value={profile.contact_sns_id ?? ''}
            onChange={value => onChange({ contact_sns_id: value })}
          />
          <SelectInput
            label="公開設定"
            required
            value={profile.model_profile_visibility}
            options={[
              { value: 'public', label: '公開する' },
              { value: 'private', label: '非公開にする' },
            ]}
            helperText="非公開にすると検索・一覧には表示されません"
            onChange={value =>
              onChange({ model_profile_visibility: value as ModelProfile['model_profile_visibility'] })
            }
          />
        </div>
      </FormSection>
    </div>
  )
}

function ClientForm({
  profile,
  email,
  onEmailChange,
  onChange,
}: {
  profile: ClientProfile
  email: string
  onEmailChange: (email: string) => void
  onChange: (updates: Partial<ClientProfile>) => void
}) {
  const studentStatusLabel: Record<string, string> = {
    pending: '審査中',
    approved: '承認済み',
    rejected: '否認',
  }

  return (
    <div className="space-y-6">
      <FormSection
        title="基本情報"
        icon={<Wand2 className="size-4" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="公開名"
            required
            value={profile.client_display_name}
            placeholder="店舗やブランドの公開名"
            onChange={value => onChange({ client_display_name: value })}
          />
          <TextInput
            label="会社名（個人名）"
            required
            value={profile.client_company_or_personal_name}
            onChange={value => onChange({ client_company_or_personal_name: value })}
          />
          <TextInput
            label="担当者名"
            required
            value={profile.client_contact_name}
            onChange={value => onChange({ client_contact_name: value })}
          />
          <SelectInput
            label="担当者の性別"
            required
            value={profile.client_contact_gender}
            options={GENDER_OPTIONS.filter(option => option.value !== '')}
            onChange={value => onChange({ client_contact_gender: value as ClientProfile['client_contact_gender'] })}
          />
          <TextInput
            label="メールアドレス"
            required
            type="email"
            value={email}
            onChange={onEmailChange}
          />
          <TextInput
            label="電話番号（任意）"
            type="tel"
            value={profile.client_phone ?? ''}
            onChange={value => onChange({ client_phone: value })}
            placeholder="090-1234-5678"
          />
        </div>
      </FormSection>

      <FormSection
        title="ビジュアル"
        icon={<Palette className="size-4" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUpload
            label="担当者画像"
            value={profile.client_contact_image}
            onChange={value => onChange({ client_contact_image: value })}
            helperText="5MB以内"
          />
          <ImageUpload
            label="メイン画像"
            value={profile.client_main_image}
            onChange={value => onChange({ client_main_image: value })}
            helperText="5MB以内"
          />
          <MultiImageUpload
            label="サブ画像"
            values={profile.client_sub_images}
            onChange={values => onChange({ client_sub_images: values })}
            helperText="複数枚アップロードできます"
          />
        </div>
      </FormSection>

      <FormSection
        title="店舗・ブランド情報"
        icon={<Sparkles className="size-4" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="お店の雰囲気"
            value={profile.client_shop_mood}
            onChange={value => onChange({ client_shop_mood: value })}
            placeholder="例：ナチュラル / シック / ポップ"
          />
          <SelectInput
            label="所在エリア"
            required
            value={profile.client_address}
            options={AREA_OPTIONS}
            onChange={value => onChange({ client_address: value })}
          />
          <Textarea
            label="お店の特徴・こだわり"
            rows={4}
            value={profile.client_shop_features}
            onChange={value => onChange({ client_shop_features: value })}
          />
        </div>
        {profile.client_student_plan && (
          <div className="rounded-xl border border-secondary/40 bg-secondary/10 p-4 text-sm flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">学生アカウント申請中</p>
              <p className="text-muted-foreground text-xs">学生プランは審査後に有効になります</p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 font-semibold text-secondary">
              {studentStatusLabel[profile.student_account_status ?? 'pending'] ?? '審査中'}
            </span>
          </div>
        )}
        {profile.client_student_plan && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUpload
              label="学生証画像"
              value={profile.client_student_id_image ?? ''}
              onChange={value => onChange({ client_student_id_image: value })}
              helperText="学生プラン審査に使用します（5MB以内）"
            />
          </div>
        )}
      </FormSection>

      <FormSection
        title="SNS・連絡先"
        icon={<Share2 className="size-4" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectInput
            label="SNS種別（任意）"
            value={profile.contact_sns_type ?? ''}
            options={[
              { value: '', label: '選択してください' },
              { value: 'instagram', label: 'Instagram' },
              { value: 'twitter', label: 'Twitter' },
              { value: 'other', label: 'その他' },
            ]}
            helperText="メールアドレスは既に保存済みです。SNSは任意です。"
            onChange={value => onChange({ contact_sns_type: value as any })}
          />
          <TextInput
            label="SNS ID / 連絡先（任意）"
            placeholder="@example など。その他の場合は「LINE @example」のように入力"
            value={profile.contact_sns_id ?? ''}
            onChange={value => onChange({ contact_sns_id: value })}
          />
        </div>
      </FormSection>
    </div>
  )
}

function FormSection({
  title,
  icon,
  children,
}: {
  title: string
  icon?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-white/95 shadow-lg shadow-primary/10">
      <div className="flex items-center gap-3 bg-gradient-to-r from-primary to-primary/80 px-4 py-3 text-primary-foreground">
        <div className="size-8 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
          {icon}
        </div>
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold leading-tight">{title}</h3>
        </div>
      </div>
      <div className="p-6 md:p-8 space-y-4">{children}</div>
    </section>
  )
}
