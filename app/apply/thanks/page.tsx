"use client"

import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ApplyThanksPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-xl mx-auto px-4 md:px-6 py-12 space-y-6 text-center">
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-foreground">応募ありがとうございました。</h1>
          <p className="text-sm text-muted-foreground">
            登録SNS、メールでやりとりをお願いします。管理者より個別にご連絡いたします。
          </p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Button asChild>
            <Link href="/search">一覧に戻る</Link>
          </Button>
          <Link href="/mypage" className="text-sm text-primary hover:underline">
            マイページへ
          </Link>
        </div>
      </main>
    </div>
  )
}
