'use client'

import { Card } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Star, User } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

type ModelProfile = {
  model_display_name?: string
  model_birthdate?: string
  model_activity_area?: string
}

type Model = {
  id: number | string
  name?: string
  age?: number
  location?: string
  rating?: number
  tags?: string[]
  model_profile?: ModelProfile
  [key: string]: unknown
}

const calcAge = (isoDate?: string) => {
  if (!isoDate) return undefined
  const birth = new Date(isoDate)
  if (Number.isNaN(birth.getTime())) return undefined
  const diff = Date.now() - birth.getTime()
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
  return years > 0 ? years : undefined
}

export default function TopModels() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch('/api/models')
        if (!res.ok) throw new Error('failed to fetch models')
        const data = await res.json()
        setModels(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to load models', error)
        setModels([])
      } finally {
        setLoading(false)
      }
    }

    fetchModels()
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const hasModels = models.length > 0
  const normalizedModels = useMemo(
    () =>
      models.map((model) => {
        const ageFromBirth = calcAge(model.model_profile?.model_birthdate as string | undefined)
        return {
          ...model,
          displayName: (model.model_profile?.model_display_name as string | undefined)?.trim() || (model.name as string | undefined) || '名前未設定',
          activityArea: (model.model_profile?.model_activity_area as string | undefined) || (model.location as string | undefined) || '場所不明',
          displayAge: ageFromBirth ?? model.age,
        }
      }),
    [models],
  )

  return (
    <section className="py-10 md:py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-3xl">✨</span>
            <h2 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-pink-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
              トップモデル
            </h2>
            <span className="text-3xl">✨</span>
          </div>
        </div>

        {/* Scroll Container */}
        <div className="relative">
          {hasModels && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all hover:scale-110"
              aria-label="スクロール左"
            >
              <ChevronLeft className="w-5 h-5 text-primary" />
            </button>
          )}

          {loading && (
            <div className="py-8 text-center text-muted-foreground">
              読み込み中...
            </div>
          )}

          {!loading && !hasModels && (
            <div className="py-8 px-4 text-center text-muted-foreground border border-dashed border-border rounded-xl bg-card/50">
              現在表示できるトップモデルはありません。
            </div>
          )}

          {hasModels && (
            <>
              <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-2 scroll-smooth"
                style={{ scrollBehavior: 'smooth' }}
              >
                {normalizedModels.map((model) => (
                  <Card
                    key={model.id}
                    className="shrink-0 w-40 md:w-44 p-4 rounded-2xl border-border hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="w-full aspect-square bg-linear-to-br from-primary/20 to-secondary/10 rounded-xl flex items-center justify-center mb-3">
                      <User className="w-20 h-20 text-primary/40" />
                    </div>

                    {/* Model Info */}
                    <div className="space-y-2">
                      <div>
                        <p className="font-semibold text-foreground text-sm truncate">{model.displayName}</p>
                        <p className="text-xs text-muted-foreground">
                          {model.displayAge ? `${model.displayAge}歳` : '年齢不明'} / {model.activityArea}
                        </p>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < Math.floor((model.rating as number | undefined) ?? 0)
                                ? 'fill-accent text-accent'
                                : 'text-border'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {(model.tags ?? []).map((tag) => (
                          <span
                            key={tag as string}
                            className="text-xs bg-primary-light text-primary px-2 py-0.5 rounded-full font-medium"
                          >
                            {tag as string}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all hover:scale-110"
                aria-label="スクロール右"
              >
                <ChevronRight className="w-5 h-5 text-primary" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
