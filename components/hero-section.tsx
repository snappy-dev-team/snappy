'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="bg-linear-to-b from-primary-light to-white/50 py-8 md:py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Illustration - Mobile First */}
        <div className="flex justify-center md:justify-end md:order-2">
          <div className="relative w-64 md:w-80">
            <Image
              src="/images/hero-woman.png"
              alt="笑顔の女性のイラスト"
              width={500}
              height={500}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col gap-4 md:gap-6 md:order-1">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-balance">
              <span className="bg-linear-to-r from-pink-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent animate-gradient">
                モデル募集を、もっと身近に。
              </span>
            </h1>
            <p className="text-lg md:text-xl font-medium text-muted-foreground mt-2">
              カットモデル・撮影モデルの募集や応募を、スムーズに管理できるマッチングプラットフォーム。
            </p>
          </div>

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
            美容師さん・サロンと、モデルになりたい方をつなぐサービスです。エリアや日時、スタイル条件から最適な募集を探し、チャットで調整まで完結します。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link href="/register?type=client">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-12 py-6 text-lg font-semibold w-full sm:w-auto"
              >
                無料で始める
              </Button>
            </Link>
            <Link href="/how-to-use">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-12 py-6 text-lg font-semibold border-primary text-primary hover:bg-primary-light"
              >
                サービスの使い方を見る
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
