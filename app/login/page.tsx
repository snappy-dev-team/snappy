"use client"

import { Button } from '@/components/ui/button'
import { getSessionUser, setSessionUser } from '@/lib/auth'
import { loginUser } from '@/lib/users'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, Suspense, useEffect, useState } from 'react'

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/mypage'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'model' | 'client'>('model')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const stored = getSessionUser()
    if (stored) {
      router.replace(redirectPath)
    }
  }, [redirectPath, router])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const user = await loginUser(email, password, role)
      setSessionUser(user)
      router.replace(redirectPath)
    } catch (err) {
      console.error(err)
      const message =
        err instanceof Error ? err.message : 'ログインに失敗しました。時間をおいて再度お試しください。'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-border">
        <div className="max-w-2xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-primary font-bold text-lg hover:opacity-80 transition-opacity">
            Snappy
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            トップへ戻る
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 md:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">ログイン</h1>
          <p className="text-muted-foreground">
            マイページを利用するには、メールアドレスとパスワードでログインしてください。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border border-border shadow-sm">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="8文字以上のパスワード"
              className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">ご利用区分</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('model')}
                className={`w-full px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                  role === 'model' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-foreground'
                }`}
              >
                モデルとして
              </button>
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`w-full px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                  role === 'client' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-foreground'
                }`}
              >
                クライアントとして
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-destructive text-center">{error}</p>}

          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-3 font-medium disabled:opacity-70"
          >
            {submitting ? 'ログイン中...' : 'ログイン'}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            はじめての方は
            <a href="/register" className="text-primary ml-1 underline underline-offset-4">
              新規登録
            </a>
            へどうぞ。
          </p>
        </form>
      </main>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">読み込み中...</div>}>
      <LoginPageContent />
    </Suspense>
  )
}
