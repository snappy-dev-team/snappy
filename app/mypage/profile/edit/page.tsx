"use client"

import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { clearSessionUser, getSessionUser, setSessionUser } from '@/lib/auth'
import { ClientProfile, ModelProfile, StudentAccountStatus, updateUserProfile, UserRecord } from '@/lib/users'
import { LogOut, Save, Upload, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'

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
  client_main_image: '',
  client_sub_images: [],
  client_mood: '',
  client_features: '',
  client_contact_photo: '',
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
      const updates = isModel
        ? { model_profile: modelProfile }
        : (() => {
            const { student_account_status: _ignoredStatus, ...clientProfilePayload } = clientProfile
            return { client_profile: clientProfilePayload }
          })()

      const updated = await updateUserProfile(user.id, updates)
      setUser(updated)
      setSessionUser(updated)
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
              <ImageUploadField
                label="メイン画像 *"
                value={modelProfile.model_main_image}
                onChange={v => setModelProfile(prev => ({ ...prev, model_main_image: v }))}
              />
              <MultiImageUploadField
                label="サブ画像（複数選択可）"
                values={modelProfile.model_sub_images}
                onChange={v => setModelProfile(prev => ({ ...prev, model_sub_images: v }))}
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
                helper="「公開しない」を選ぶと検索・一覧から除外されます。"
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
              <Field label="電話番号" value={clientProfile.client_phone ?? ''} onChange={v => setClientProfile(prev => ({ ...prev, client_phone: v }))} />
              <Field label="学生証画像URL" value={clientProfile.client_student_id_image ?? ''} onChange={v => setClientProfile(prev => ({ ...prev, client_student_id_image: v }))} />
              <ImageUploadField
                label="店舗メイン画像"
                value={clientProfile.client_main_image ?? ''}
                onChange={v => setClientProfile(prev => ({ ...prev, client_main_image: v }))}
              />
              <MultiImageUploadField
                label="店舗サブ画像（複数選択可）"
                values={clientProfile.client_sub_images ?? []}
                onChange={v => setClientProfile(prev => ({ ...prev, client_sub_images: v }))}
              />
              <TextareaField
                label="雰囲気・コンセプト"
                value={clientProfile.client_mood ?? ''}
                onChange={v => setClientProfile(prev => ({ ...prev, client_mood: v }))}
              />
              <TextareaField
                label="特徴（箇条書き推奨）"
                value={clientProfile.client_features ?? ''}
                onChange={v => setClientProfile(prev => ({ ...prev, client_features: v }))}
              />
              <ImageUploadField
                label="担当者顔写真"
                value={clientProfile.client_contact_photo ?? ''}
                onChange={v => setClientProfile(prev => ({ ...prev, client_contact_photo: v }))}
              />

              <div className="space-y-2 text-sm md:col-span-2">
                <span className="font-medium text-foreground">学生アカウントステータス</span>
                <p className="px-4 py-2 rounded-lg border border-border bg-muted/20 text-foreground">
                  {clientProfile.student_account_status ?? 'pending'}（変更は管理用マイページのみ）
                </p>
                <p className="text-xs text-muted-foreground">
                  学生アカウントの有効化・無効化は管理用マイページでのみ設定できます。個人マイページからは変更できません。
                </p>
              </div>
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

function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // ファイルサイズチェック（5MB制限）
    if (file.size > 5 * 1024 * 1024) {
      alert('ファイルサイズは5MB以下にしてください')
      return
    }

    // 画像ファイルチェック
    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      onChange(base64)
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    onChange('')
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  // base64かURLかを判定して画像を表示
  const isValidImage = value && (value.startsWith('data:image') || value.startsWith('http'))

  return (
    <div className="space-y-2 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      <div className="space-y-3">
        {isValidImage && (
          <div className="relative inline-block">
            <img
              src={value}
              alt="プレビュー"
              className="w-32 h-32 object-cover rounded-lg border border-border"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 hover:bg-destructive/90"
            >
              <X className="size-4" />
            </button>
          </div>
        )}
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={`image-upload-${label}`}
          />
          <label
            htmlFor={`image-upload-${label}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted cursor-pointer transition-colors"
          >
            <Upload className="size-4" />
            画像を選択
          </label>
        </div>
      </div>
    </div>
  )
}

function MultiImageUploadField({
  label,
  values,
  onChange,
}: {
  label: string
  values: string[]
  onChange: (v: string[]) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    
    // ファイルサイズチェック
    for (const file of fileArray) {
      if (file.size > 5 * 1024 * 1024) {
        alert('各ファイルサイズは5MB以下にしてください')
        return
      }
      if (!file.type.startsWith('image/')) {
        alert('画像ファイルを選択してください')
        return
      }
    }

    // すべてのファイルをbase64に変換
    const promises = fileArray.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          resolve(event.target?.result as string)
        }
        reader.readAsDataURL(file)
      })
    })

    Promise.all(promises).then(newImages => {
      onChange([...values, ...newImages])
    })

    // inputをリセット
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleRemove = (index: number) => {
    const newValues = values.filter((_, i) => i !== index)
    onChange(newValues)
  }

  return (
    <div className="space-y-2 text-sm md:col-span-2">
      <span className="font-medium text-foreground">{label}</span>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-3">
          {values.map((value, index) => {
            const isValidImage = value && (value.startsWith('data:image') || value.startsWith('http'))
            if (!isValidImage) return null
            return (
              <div key={index} className="relative inline-block">
                <img
                  src={value}
                  alt={`サブ画像 ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-lg border border-border"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 hover:bg-destructive/90"
                >
                  <X className="size-4" />
                </button>
              </div>
            )
          })}
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id={`multi-image-upload-${label}`}
          />
          <label
            htmlFor={`multi-image-upload-${label}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted cursor-pointer transition-colors"
          >
            <Upload className="size-4" />
            画像を追加
          </label>
          {values.length > 0 && (
            <span className="ml-3 text-xs text-muted-foreground">
              {values.length}枚の画像が選択されています
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
