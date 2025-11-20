'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ChangeEvent, FormEvent, Suspense, useState } from 'react'

function RegisterForm() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || 'model'
  const isModel = type === 'model'

  const [formData, setFormData] = useState({
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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type: inputType } = e.target
    if (inputType === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert('登録ありがとうございます！確認メールをお送りしました。')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-2xl mx-auto px-4 md:px-8 py-4">
          <Link href="/" className="text-primary font-bold text-lg hover:opacity-80 transition-opacity">
            Snappy
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {isModel ? 'モデル登録' : 'クライアント登録'}
          </h1>
          <p className="text-muted-foreground">
            {isModel
              ? 'カットモデルとして登録してください。無料です。'
              : 'あなたのサロンやサービスを登録して、モデルを探しましょう。'}
          </p>
        </div>

        {/* Type Selector */}
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

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {isModel ? (
            <>
              {/* Model Registration Form */}
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
                  地域 <span className="text-secondary">*</span>
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">選択してください</option>
                  <option value="tsukuba">茨城県つくば市</option>
                  <option value="ibaraki">その他茨城県</option>
                  <option value="tokyo">東京都</option>
                  <option value="osaka">大阪府</option>
                  <option value="other">その他</option>
                </select>
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

              {/* Advanced Filter Preferences for Models */}
              <div className="pt-4 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">こだわり条件</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      スタイリストの性別 <span className="text-secondary">*</span>
                    </label>
                    <select
                      name="staffGender"
                      value={formData.staffGender}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">選択してください</option>
                      <option value="any">どちらでもOK</option>
                      <option value="female">女性スタイリストを希望</option>
                      <option value="male">男性スタイリストを希望</option>
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
                      <span className="text-sm text-foreground">クレジットカード決済に対応しているサロンを希望</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      予算の上限
                    </label>
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
              {/* Client Registration Form */}
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
                    スタイリスト名 <span className="text-secondary">*</span>
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

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  地域 <span className="text-secondary">*</span>
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">選択してください</option>
                  <option value="tsukuba">茨城県つくば市</option>
                  <option value="ibaraki">その他茨城県</option>
                  <option value="tokyo">東京都</option>
                  <option value="osaka">大阪府</option>
                  <option value="other">その他</option>
                </select>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">こだわり条件</h3>

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
                      <span className="text-sm text-foreground">クレジットカード決済に対応しています</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      報酬
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">選択してください</option>
                      <option value="free">無料</option>
                      <option value="5000">5,000円</option>
                      <option value="10000">10,000円以上</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-3 font-medium"
            >
              登録する
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
