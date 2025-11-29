'use client'

import { Button } from '@/components/ui/button'
import Header from '@/components/header'
import { setSessionUser } from '@/lib/auth'
import { createUser, UserPayload } from '@/lib/users'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, FormEvent, Suspense, useState } from 'react'

type FormState = {
  name: string
  age: string
  email: string
  phone: string
  location: string
  studio: string
  experience: string
  gender: string
  acceptCard: boolean
  budget: string
  staffGender: string
}

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get('type') === 'client' ? 'client' : 'model'
  const isModel = type === 'model'

  const [formData, setFormData] = useState<FormState>({
    name: '',
    age: '',
    email: '',
    phone: '',
    location: '',
    studio: '',
    experience: '',
    gender: '',
    acceptCard: false,
    budget: '',
    staffGender: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type: inputType } = e.target
    if (inputType === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const payload: UserPayload = {
      role: isModel ? 'model' : 'client',
      name: isModel ? formData.name : formData.studio || formData.name,
      email: formData.email,
      age: isModel && formData.age ? Number(formData.age) : undefined,
      profile: isModel
        ? `希望スタッフ:${formData.staffGender || '未設定'} / 予算:${formData.budget || '未設定'} / カード:${formData.acceptCard ? '可' : '不明'}`
        : `サロン:${formData.studio || '未設定'} / 経験:${formData.experience || '未設定'} / スタッフ構成:${formData.staffGender || '未設定'} / カード:${formData.acceptCard ? '可' : '不明'}`,
    }

    try {
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

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-2xl mx-auto px-4 md:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {isModel ? 'モデル登録' : 'クライアント登録'}
          </h1>
          <p className="text-muted-foreground">
            {isModel
              ? 'カットモデルとして登録してください。無料でご利用いただけます。'
              : 'サロンやサービスを登録して、モデルを探しましょう。'}
          </p>
        </div>

        <div className="flex gap-4 mb-8">
          <Link href="/register?type=model">
            <Button
              variant={isModel ? 'default' : 'outline'}
              className={isModel ? 'bg-primary text-primary-foreground' : ''}
            >
              モデル登録
            </Button>
          </Link>
          <Link href="/register?type=client">
            <Button
              variant={!isModel ? 'default' : 'outline'}
              className={!isModel ? 'bg-primary text-primary-foreground' : ''}
            >
              クライアント登録
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isModel ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    お名前 <span className="text-secondary">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="山田 花子"
                    className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    年齢 <span className="text-secondary">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="25"
                    className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  メールアドレス <span className="text-secondary">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  電話番号 <span className="text-secondary">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="090-1234-5678"
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  性別 <span className="text-secondary">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">選択してください</option>
                  <option value="female">女性</option>
                  <option value="male">男性</option>
                  <option value="other">その他</option>
                </select>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">こだわり条件</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      希望するスタイリストの性別
                    </label>
                    <select
                      name="staffGender"
                      value={formData.staffGender}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">選択してください</option>
                      <option value="any">どちらでもOK</option>
                      <option value="female">女性スタイリスト</option>
                      <option value="male">男性スタイリスト</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="acceptCard"
                        checked={formData.acceptCard}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-border"
                      />
                      <span className="text-sm text-foreground">クレジットカード決済を希望する</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">予算の上限</label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">選択してください</option>
                      <option value="free">無料のみ</option>
                      <option value="5000">5,000円まで</option>
                      <option value="10000">10,000円まで</option>
                      <option value="unlimit">無制限</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  サロン名 <span className="text-secondary">*</span>
                </label>
                <input
                  type="text"
                  name="studio"
                  value={formData.studio}
                  onChange={handleChange}
                  placeholder="○○ヘアサロン"
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    担当者名 <span className="text-secondary">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="田中 太郎"
                    className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    経験年数 <span className="text-secondary">*</span>
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="5年"
                    className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  メールアドレス <span className="text-secondary">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="salon@email.com"
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  電話番号 <span className="text-secondary">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="03-1234-5678"
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">募集条件</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      スタッフ構成 <span className="text-secondary">*</span>
                    </label>
                    <select
                      name="staffGender"
                      value={formData.staffGender}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">選択してください</option>
                      <option value="female">女性スタッフのみ</option>
                      <option value="male">男性スタッフのみ</option>
                      <option value="mixed">男女混合</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="acceptCard"
                        checked={formData.acceptCard}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-border"
                      />
                      <span className="text-sm text-foreground">クレジットカード決済に対応している</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">報酬</label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">選択してください</option>
                      <option value="free">無償</option>
                      <option value="5000">5,000円</option>
                      <option value="10000">10,000円</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {error && <p className="text-sm text-destructive text-center">{error}</p>}

          <div className="pt-4">
            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-3 font-medium disabled:opacity-70"
            >
              {submitting ? '送信中...' : '登録する'}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            登録することで、利用規約とプライバシーポリシーに同意したものとみなされます。
          </p>
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
