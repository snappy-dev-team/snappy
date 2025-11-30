'use client'

import { Card } from '@/components/ui/card'
import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'

type Shop = {
  id: number | string
  name: string
  description1?: string
  description2?: string
  location?: string
  reward?: string
  timeframe?: string
  rating?: number
}

export default function FeaturedShops() {
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await fetch('/api/shops')
        if (!res.ok) throw new Error('failed to fetch shops')
        const data = await res.json()
        setShops(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to load shops', error)
        setShops([])
      } finally {
        setLoading(false)
      }
    }

    fetchShops()
  }, [])

  const hasShops = shops.length > 0

  return (
    <section className="py-8 md:py-10 px-4 md:px-8 bg-neutral-soft/50">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-3xl">💈</span>
            <h2 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
              注目の募集中ショップ
            </h2>
            <span className="text-3xl">💈</span>
          </div>
        </div>

        {/* Shop List */}
        {loading && (
          <div className="py-8 text-center text-muted-foreground">
            読み込み中...
          </div>
        )}

        {!loading && !hasShops && (
          <div className="py-8 px-4 text-center text-muted-foreground border border-dashed border-border rounded-xl bg-card/50">
            現在募集中のショップはありません。
          </div>
        )}

        {hasShops && (
          <div className="space-y-4">
            {shops.map((shop) => (
              <Card
                key={shop.id}
                className="flex gap-4 rounded-2xl p-4 md:p-5 border-border hover:shadow-md transition-shadow cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="shrink-0">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-linear-to-br from-primary/20 to-secondary/10 rounded-xl flex items-center justify-center">
                    <div className="text-3xl">💄</div>
                  </div>

                  {/* Rating */}
                  <div className="flex gap-0.5 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(shop.rating ?? 0)
                            ? 'fill-accent text-accent'
                            : 'text-border'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm md:text-base mb-2 truncate">
                    {shop.name}
                  </h3>

                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-1">
                    {shop.description1 ?? '詳細未登録'}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-3">
                    {shop.description2 ?? ''}
                  </p>

                  {/* Meta Tags */}
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-primary-light text-primary px-3 py-1 rounded-full font-medium">
                      {shop.location ?? '場所未定'}
                    </span>
                    <span className="text-xs bg-secondary/10 text-secondary px-3 py-1 rounded-full font-medium">
                      {shop.reward ?? '謝礼未定'}
                    </span>
                    <span className="text-xs bg-accent/20 text-foreground px-3 py-1 rounded-full font-medium">
                      {shop.timeframe ?? '日程未定'}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
