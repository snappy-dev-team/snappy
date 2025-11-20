'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex items-center justify-between h-14 px-4 md:px-8 max-w-6xl mx-auto">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-wide text-primary hover:opacity-80 transition-opacity">
          Snappy
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
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-all hover:scale-105"
          >
            マイページ
          </Link>
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-all hover:scale-105"
          >
            ヘルプ
          </Link>
        </nav>
      </div>
    </header>
  )
}
