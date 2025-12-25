import { Suspense } from 'react'
import Header from '@/components/header'
import HeroSection from '@/components/hero-section'
import SearchPanel from '@/components/search-panel'
import Notices from '@/components/notices'
import TopModels from '@/components/top-models'
import FeaturedShops from '@/components/featured-shops'
import RegistrationCTA from '@/components/registration-cta'
import Footer from '@/components/footer'

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
