"use client"

import { Button } from '@/components/ui/button'
import Header from '@/components/header'
import { setSessionUser } from '@/lib/auth'
import {
  ClientSignupPayload,
  createUser,
  ModelSignupPayload,
  RegistrationPayload,
} from '@/lib/users'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, FormEvent, Suspense, useMemo, useState } from 'react'

type Step = 'input' | 'confirm'

type ModelFormState = {
  model_signup_name: string
  model_signup_email: string
  model_signup_birthdate: string
  model_signup_address: string
  model_signup_password: string
  model_signup_password_confirm: string
}

type ClientFormState = {
  client_type: 'individual' | 'corporation'
  client_company_or_personal_name: string
  client_contact_name: string
  client_contact_gender: 'male' | 'female' | 'other'
  client_address: string
  client_email: string
  client_phone: string
  client_password: string
  client_password_confirm: string
  client_student_plan: boolean
  client_student_id_image: string
}

const modelFields: { name: keyof ModelFormState; label: string; type?: string; required?: boolean }[] = [
  { name: 'model_signup_name', label: 'Name', required: true },
  { name: 'model_signup_email', label: 'Email', required: true },
  { name: 'model_signup_birthdate', label: 'Birthdate', type: 'date', required: true },
  { name: 'model_signup_address', label: 'Address', required: true },
  { name: 'model_signup_password', label: 'Password', type: 'password', required: true },
  { name: 'model_signup_password_confirm', label: 'Password (Confirm)', type: 'password', required: true },
]

const clientFields: { name: keyof ClientFormState; label: string; type?: string; required?: boolean }[] = [
  { name: 'client_company_or_personal_name', label: 'Company or Personal Name', required: true },
  { name: 'client_contact_name', label: 'Contact Name', required: true },
  { name: 'client_contact_gender', label: 'Contact Gender', required: true },
  { name: 'client_address', label: 'Address', required: true },
  { name: 'client_email', label: 'Email', required: true },
  { name: 'client_phone', label: 'Phone', required: false },
  { name: 'client_password', label: 'Password', type: 'password', required: true },
  { name: 'client_password_confirm', label: 'Password (Confirm)', type: 'password', required: true },
]

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const typeParam = searchParams.get('type')
  const [userType, setUserType] = useState<'model' | 'client'>(typeParam === 'client' ? 'client' : 'model')
  const isModel = userType === 'model'
  const [step, setStep] = useState<Step>('input')
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [modelForm, setModelForm] = useState<ModelFormState>({
    model_signup_name: '',
    model_signup_email: '',
    model_signup_birthdate: '',
    model_signup_address: '',
    model_signup_password: '',
    model_signup_password_confirm: '',
  })

  const [clientForm, setClientForm] = useState<ClientFormState>({
    client_type: 'individual',
    client_company_or_personal_name: '',
    client_contact_name: '',
    client_contact_gender: 'male',
    client_address: '',
    client_email: '',
    client_phone: '',
    client_password: '',
    client_password_confirm: '',
    client_student_plan: false,
    client_student_id_image: '',
  })

  const currentForm = isModel ? modelForm : clientForm

  const handleModelChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement
    if (target.type === 'checkbox') {
      setModelForm(prev => ({ ...prev, [target.name]: target.checked }))
      return
    }
    const { name, value } = target
    setModelForm(prev => ({ ...prev, [name]: value }))
  }

  const handleClientChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement
    if (target.type === 'checkbox') {
      const nextChecked = target.checked
      setClientForm(prev => ({
        ...prev,
        [target.name]: nextChecked,
        client_student_id_image: target.name === 'client_student_plan' && !nextChecked ? '' : prev.client_student_id_image,
      }))
      return
    }
    setClientForm(prev => ({ ...prev, [target.name]: target.value }))
  }

  const handleStudentIdFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('画像ファイルを選択してください')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('画像サイズは5MB以下にしてください')
      return
    }
    setError(null)
    const reader = new FileReader()
    reader.onload = ev => {
      const base64 = ev.target?.result as string
      setClientForm(prev => ({ ...prev, client_student_id_image: base64 }))
    }
    reader.readAsDataURL(file)
  }

  const passwordsMatch = useMemo(() => {
    if (isModel) return modelForm.model_signup_password === modelForm.model_signup_password_confirm
    return clientForm.client_password === clientForm.client_password_confirm
  }, [clientForm.client_password, clientForm.client_password_confirm, isModel, modelForm.model_signup_password, modelForm.model_signup_password_confirm])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!passwordsMatch) {
      setError('パスワードと確認用パスワードが一致しません。')
      return
    }

    setStep('confirm')
  }

  const handleConfirm = async () => {
    setError(null)
    if (!termsAgreed) {
      setError('利用規約への同意が必要です。')
      return
    }

    setSubmitting(true)
    try {
    const payload: RegistrationPayload = isModel
        ? ({ role: 'model', ...modelForm } as ModelSignupPayload)
        : ({
            role: 'client',
            ...clientForm,
          } as ClientSignupPayload)

      const user = await createUser(payload)
      setSessionUser(user)
      router.push('/mypage')
    } catch (err) {
      console.error(err)
      setError('登録に失敗しました。時間をおいて再度お試しください。')
    } finally {
      setSubmitting(false)
    }
  }

  const renderModelForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            名前 <span className="text-secondary">*</span>
          </label>
          <input
            type="text"
            name="model_signup_name"
            value={modelForm.model_signup_name}
            onChange={handleModelChange}
            placeholder="山田 花子"
            className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            生年月日 <span className="text-secondary">*</span>
          </label>
          <input
            type="date"
            name="model_signup_birthdate"
            value={modelForm.model_signup_birthdate}
            onChange={handleModelChange}
            className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">20歳未満は保護者同意が必要フラグを立てます。</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          メールアドレス <span className="text-secondary">*</span>
        </label>
        <input
          type="email"
          name="model_signup_email"
          value={modelForm.model_signup_email}
          onChange={handleModelChange}
          placeholder="model@example.com"
          className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          住所 <span className="text-secondary">*</span>
        </label>
        <input
          type="text"
          name="model_signup_address"
          value={modelForm.model_signup_address}
          onChange={handleModelChange}
          placeholder="東京都渋谷区..."
          className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            パスワード <span className="text-secondary">*</span>
          </label>
          <input
            type="password"
            name="model_signup_password"
            value={modelForm.model_signup_password}
            onChange={handleModelChange}
            placeholder="8文字以上で入力"
            className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            パスワード（確認用） <span className="text-secondary">*</span>
          </label>
          <input
            type="password"
            name="model_signup_password_confirm"
            value={modelForm.model_signup_password_confirm}
            onChange={handleModelChange}
            placeholder="確認用"
            className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
      </div>
    </div>
  )

  const renderClientForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            個人 / 法人 <span className="text-secondary">*</span>
          </label>
          <select
            name="client_type"
            value={clientForm.client_type}
            onChange={handleClientChange}
            className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="individual">個人</option>
            <option value="corporation">法人</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            会社名（個人名） <span className="text-secondary">*</span>
          </label>
          <input
            type="text"
            name="client_company_or_personal_name"
            value={clientForm.client_company_or_personal_name}
            onChange={handleClientChange}
            placeholder="Snappy美容室"
            className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            担当者名 <span className="text-secondary">*</span>
          </label>
          <input
            type="text"
            name="client_contact_name"
            value={clientForm.client_contact_name}
            onChange={handleClientChange}
            placeholder="山田 太郎"
            className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            担当者の性別 <span className="text-secondary">*</span>
          </label>
          <select
            name="client_contact_gender"
            value={clientForm.client_contact_gender}
            onChange={handleClientChange}
            className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="male">男性</option>
            <option value="female">女性</option>
            <option value="other">その他</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          所在地（本社 / 現住所） <span className="text-secondary">*</span>
        </label>
        <input
          type="text"
          name="client_address"
          value={clientForm.client_address}
          onChange={handleClientChange}
          placeholder="東京都渋谷区..."
          className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            メールアドレス <span className="text-secondary">*</span>
          </label>
          <input
            type="email"
            name="client_email"
            value={clientForm.client_email}
            onChange={handleClientChange}
            placeholder="client@example.com"
            className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">携帯電話番号（任意）</label>
          <input
            type="tel"
            name="client_phone"
            value={clientForm.client_phone}
            onChange={handleClientChange}
            placeholder="090-1234-5678"
            className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            パスワード <span className="text-secondary">*</span>
          </label>
          <input
            type="password"
            name="client_password"
            value={clientForm.client_password}
            onChange={handleClientChange}
            placeholder="8文字以上で入力"
            className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            パスワード（確認用） <span className="text-secondary">*</span>
          </label>
          <input
            type="password"
            name="client_password_confirm"
            value={clientForm.client_password_confirm}
            onChange={handleClientChange}
            placeholder="確認用"
            className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">学生プランを希望する</p>
            <p className="text-xs text-muted-foreground">学生証アップロードが必要です。審査承認後に学生用募集フォームが有効になります。</p>
          </div>
          <input
            type="checkbox"
            name="client_student_plan"
            checked={clientForm.client_student_plan}
            onChange={handleClientChange}
            className="w-4 h-4 rounded border-border"
          />
        </div>

        {clientForm.client_student_plan && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground mb-1">
              学生証画像 <span className="text-secondary">*</span>
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {clientForm.client_student_id_image ? (
                  <img
                    src={clientForm.client_student_id_image}
                    alt="学生証プレビュー"
                    className="w-24 h-24 object-cover rounded-lg border border-border"
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">学生証画像をアップロードしてください</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="student-id-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleStudentIdFileChange}
                />
                <label
                  htmlFor="student-id-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted cursor-pointer transition-colors text-sm"
                >
                  画像を選択
                </label>
                {clientForm.client_student_id_image && (
                  <button
                    type="button"
                    onClick={() => setClientForm(prev => ({ ...prev, client_student_id_image: '' }))}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    削除
                  </button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">画像は5MBまで。アップロード後に審査が行われます。</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderConfirmTable = () => {
    const entries = isModel ? modelFields : clientFields
    const formatted = entries.map(item => {
      const value = (currentForm as Record<string, string>)[item.name]
      const masked = item.name.includes('password') ? '********' : value
      return { label: item.label, value: masked }
    })

    const extra = isModel
      ? [
          {
            label: 'Minor Flag',
            value: modelForm.model_signup_birthdate
              ? (new Date().getFullYear() - new Date(modelForm.model_signup_birthdate).getFullYear() < 20
                  ? 'Guardian consent needed'
                  : 'Not a minor')
              : '-',
          },
        ]
      : [
          { label: 'Student Plan', value: clientForm.client_student_plan ? 'Yes' : 'No' },
          {
            label: 'Student ID Image',
            value: clientForm.client_student_plan
              ? (clientForm.client_student_id_image ? 'Uploaded' : 'Not uploaded')
              : '-',
          },
        ]
    return (
      <div className="rounded-xl border border-border bg-white shadow-sm">
        <div className="divide-y divide-border">
          {[...formatted, ...extra].map(row => (
            <div key={row.label} className="flex justify-between gap-3 px-4 py-3">
              <p className="text-sm text-muted-foreground">{row.label}</p>
              <p className="text-sm font-medium text-foreground text-right break-all">{row.value || '未入力'}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 space-y-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">新規会員登録</h1>
            <Link href="/terms" className="text-sm text-primary hover:underline">
              利用規約
            </Link>
          </div>
          <p className="text-muted-foreground">
            入力 → 確認 → 利用規約への同意 → 登録完了の流れです。サインアップ後、マイページで詳細プロフィールを編集できます。
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setUserType('model')
              setStep('input')
            }}
            className={`w-full px-4 py-3 rounded-lg border text-sm font-semibold transition-all ${
              isModel ? 'border-primary bg-primary/10 text-primary shadow-sm' : 'border-border bg-white text-foreground'
            }`}
          >
            モデル会員
          </button>
          <button
            onClick={() => {
              setUserType('client')
              setStep('input')
            }}
            className={`w-full px-4 py-3 rounded-lg border text-sm font-semibold transition-all ${
              !isModel ? 'border-primary bg-primary/10 text-primary shadow-sm' : 'border-border bg-white text-foreground'
            }`}
          >
            クライアント会員
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 'input' && (
            <div className="rounded-2xl border border-border bg-white shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                {isModel ? '新規登録フォーム（モデル）' : '新規登録フォーム（クライアント）'}
              </h2>
                <span className="text-xs text-muted-foreground">* は必須</span>
              </div>

              {isModel ? renderModelForm() : renderClientForm()}

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <p className="text-sm text-muted-foreground">確認画面で内容をチェックし、利用規約へ同意してください。</p>
                <Button type="submit" size="lg" className="bg-primary text-primary-foreground">
                  確認画面へ
                </Button>
              </div>
            </div>
          )}

          {step === 'confirm' && (
            <div className="space-y-6 rounded-2xl border border-border bg-white shadow-sm p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">入力内容の確認</h2>
                <Button variant="outline" size="sm" onClick={() => setStep('input')}>
                  修正する
                </Button>
              </div>

              {renderConfirmTable()}

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={e => setTermsAgreed(e.target.checked)}
                    className="w-4 h-4 rounded border-border"
                  />
                  <label htmlFor="terms" className="text-sm text-foreground">
                    <Link href="/terms" className="text-primary underline underline-offset-4 mr-1">
                      利用規約
                    </Link>
                    に同意します
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">チェックがないと登録完了ボタンは押せません。</p>
              </div>

              {error && <p className="text-sm text-destructive text-center">{error}</p>}

              <div className="flex flex-col gap-3">
                <Button
                  type="button"
                  size="lg"
                  disabled={submitting}
                  onClick={handleConfirm}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-3 font-medium disabled:opacity-70"
                >
                  {submitting ? '登録中...' : '利用規約に同意して登録する'}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  登録すると、プライバシーポリシーにも同意したものとみなされます。
                </p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">読み込み中...</div>}>
      <RegisterForm />
    </Suspense>
  )
}
