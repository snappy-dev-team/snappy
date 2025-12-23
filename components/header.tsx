'use client'

import { getSessionUser } from '@/lib/auth'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Header() {
  const [mypageHref, setMypageHref] = useState('/login')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const stored = getSessionUser()
    setMypageHref(stored ? '/mypage' : '/login')
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-white">
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/register?type=model"
              className="text-sm text-muted-foreground hover:text-foreground transition-all hover:scale-105"
            >
              新規登録
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

          {/* Hamburger Menu Button (Mobile) */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
          >
            <span
              className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${
                isMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${
                isMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${
                isMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </header>

      {/* Full Screen Mobile Menu */}
      <nav
        className={`md:hidden fixed inset-0 z-40 bg-white transition-all duration-500 ease-out ${
          isMenuOpen
            ? 'opacity-100 visible'
            : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {/* Close Button */}
        <button
          className={`absolute top-4 right-4 flex flex-col justify-center items-center w-10 h-10 gap-1.5 transition-all duration-300 hover:rotate-90 ${
            isMenuOpen ? 'rotate-0 delay-300' : 'rotate-180'
          }`}
          onClick={() => setIsMenuOpen(false)}
          aria-label="メニューを閉じる"
        >
          <span className="block w-6 h-0.5 bg-foreground rotate-45 translate-y-1" />
          <span className="block w-6 h-0.5 bg-foreground -rotate-45 -translate-y-1" />
        </button>

        {/* Menu Links */}
        <div className="flex flex-col items-center justify-center h-full gap-8">
          <Link
            href="/register?type=model"
            className={`text-xl text-foreground hover:text-pink-400 transition-all duration-300 hover:scale-110 ${
              isMenuOpen
                ? 'opacity-100 translate-y-0 delay-100'
                : 'opacity-0 translate-y-4'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            新規登録
          </Link>
          <Link
            href={mypageHref}
            className={`text-xl text-foreground hover:text-pink-400 transition-all duration-300 hover:scale-110 ${
              isMenuOpen
                ? 'opacity-100 translate-y-0 delay-200'
                : 'opacity-0 translate-y-4'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            マイページ
          </Link>
          <Link
            href="/help"
            className={`text-xl text-foreground hover:text-pink-400 transition-all duration-300 hover:scale-110 ${
              isMenuOpen
                ? 'opacity-100 translate-y-0 delay-300'
                : 'opacity-0 translate-y-4'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            ヘルプ
          </Link>
        </div>
      </nav>
    </>
  )
}
