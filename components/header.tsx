'use client'

import { getSessionUser } from '@/lib/auth'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Header() {
  const [mypageHref, setMypageHref] = useState('/login')

  useEffect(() => {
    const stored = getSessionUser()
    setMypageHref(stored ? '/mypage' : '/login')
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex items-center justify-between h-14 px-4 md:px-8 max-w-6xl mx-auto">

        {/* Logo */}
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image
            src="/images/logo.png"
            alt="Snappy"
            width={140}
            height={40}
            priority
          />
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 md:gap-8">
          <Link
            href="/register?type=model"
            className="text-sm text-muted-foreground hover:text-foreground transition-all hover:scale-105"
          >
            モデル登録
          </Link>
          <Link
            href={mypageHref}
            className="text-sm text-muted-foreground hover:text-foreground transition-all hover:scale-105"
          >
            マイページ
          </Link>
          <Link
            href="/help"
            className="text-sm text-muted-foreground hover:text-foreground transition-all hover:scale-105"
          >
            ヘルプ
          </Link>
        </nav>
      </div>
    </header>
  )
}
