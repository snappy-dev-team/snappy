import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import Header from '@/components/header'
import HeroSection from '@/components/hero-section'
import Footer from '@/components/footer'

const SearchPanel = dynamic(() => import('@/components/search-panel'), {
  loading: () => <div className="py-16 text-center">読み込み中...</div>,
})

const Notices = dynamic(() => import('@/components/notices'), {
  loading: () => <div className="py-8 text-center text-gray-400">お知らせを読み込み中...</div>,
})

const TopModels = dynamic(() => import('@/components/top-models'), {
  loading: () => <div className="py-16 text-center text-gray-400">モデルを読み込み中...</div>,
})

const FeaturedShops = dynamic(() => import('@/components/featured-shops'), {
  loading: () => <div className="py-16 text-center text-gray-400">ショップを読み込み中...</div>,
})

const RegistrationCTA = dynamic(() => import('@/components/registration-cta'))

export default function Home() {
  return (
    <main className="bg-background">
      <Header />
      <HeroSection />
      <Suspense fallback={<div className="py-16 text-center">読み込み中...</div>}>
        <SearchPanel />
      </Suspense>
      <Notices />
      <TopModels />
      <FeaturedShops />
      <RegistrationCTA />
      <Footer />
    </main>
  )
}
