'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function RegistrationCTA() {
  return (
    <section className="py-12 md:py-16 px-4 md:px-8 bg-linear-to-br from-primary/10 to-secondary/10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center items-center gap-3 mb-8">
          <span className="text-3xl">🌟</span>
          <h2 className="text-2xl md:text-4xl font-bold text-center bg-linear-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Snappyで新しい機会を見つけよう
          </h2>
          <span className="text-3xl">🌟</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Model Registration Card */}
          <Card className="p-6 md:p-8 rounded-2xl border-border hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">モデルの方へ</h3>
              <p className="text-muted-foreground text-sm">
                素敵なサロンでのお仕事やスタイリング体験の機会が待っています。プロフィールを登録して、あなたに合ったお仕事を見つけましょう。
              </p>
              <Link href="/register?type=model" className="block">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-6 text-lg font-semibold">
                  モデル登録
                </Button>
              </Link>
            </div>
          </Card>

          {/* Client Registration Card */}
          <Card className="p-6 md:p-8 rounded-2xl border-border hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">クライアントの方へ</h3>
              <p className="text-muted-foreground text-sm">
                理想のモデルを探して、新しいスタイルや技術の提案ができます。サロンやサービス情報を登録して、登録モデルにアプローチしましょう。
              </p>
              <Link href="/register?type=client" className="block">
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg py-6 text-lg font-semibold">
                  クライアント登録
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
