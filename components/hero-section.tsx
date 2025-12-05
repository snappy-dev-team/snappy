'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-sky-50 via-white to-white/80 py-6 md:py-12 px-4 md:px-8">
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-44 bg-sky-200/40 blur-3xl" />
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
        {/* Illustration - Mobile First */}
        <div className="flex justify-center md:justify-end md:order-2">
          <div className="relative w-72 md:w-96 overflow-hidden md:-translate-y-6 md:-translate-x-6">
            <Image
              src="/images/hero-woman2.png"
              alt="Hero illustration"
              width={600}
              height={600}
              className="w-full h-auto rounded-3xl shadow-xl md:shadow-2xl"
              priority
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent via-white/40 to-white/90" />
          </div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col gap-3 md:gap-5 md:order-1">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-balance space-y-1">
              <span className="block bg-linear-to-r from-sky-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent animate-gradient">
                モデルをもっと
              </span>
              <span className="block bg-linear-to-r from-sky-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent animate-gradient">
                身近な仕事に。
              </span>
            </h1>
            <p className="text-lg md:text-xl font-medium text-muted-foreground mt-2">
              カットモデル・撮影モデルの募集や応募を、スムーズに。
            </p>
          </div>

      

          <div className="flex flex-col sm:flex-row gap-4 pt-1">
            <Link href="/register?type=client">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-12 py-5 text-lg font-semibold w-full sm:w-auto"
              >
                無料で始める
              </Button>
            </Link>
            <Link href="/how-to-use">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-12 py-5 text-lg font-semibold border-primary text-primary hover:bg-primary-light"
              >
                まずは使い方を見る
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
