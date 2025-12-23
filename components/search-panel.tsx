'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChevronDown, Plus, X } from 'lucide-react'
import {
  AREA_OPTIONS,
  AGE_RANGE_OPTIONS,
  HAIR_STYLE_OPTIONS,
  GENDER_OPTIONS,
  DATE_RANGE_OPTIONS,
  PRICE_RANGE_OPTIONS,
} from '@/constants/search-options'

type SearchPanelProps = {
  /** 検索結果ページで使用する場合はtrue（ナビゲーションなしで状態を同期） */
  embedded?: boolean
  /** 初期タブ */
  initialTab?: 'models' | 'jobs'
  /** タブが変更された時のコールバック */
  onTabChange?: (tab: 'models' | 'jobs') => void
  /** 検索が実行された時のコールバック（embeddedモード用） */
  onSearch?: (params: URLSearchParams) => void
  /** 外側のコンテナスタイルを無効化 */
  noContainer?: boolean
}

export default function SearchPanel({
  embedded = false,
  initialTab,
  onTabChange,
  onSearch,
  noContainer = false,
}: SearchPanelProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // URLパラメータから初期値を取得（embeddedモード用）
  const getInitialTab = (): 'models' | 'jobs' => {
    if (initialTab) return initialTab
    if (embedded) {
      const tabParam = searchParams.get('tab')
      return tabParam === 'models' ? 'models' : 'jobs'
    }
    return 'jobs'
  }

  const [activeTab, setActiveTab] = useState<'models' | 'jobs'>(getInitialTab())
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Job search filters
  const [jobArea, setJobArea] = useState(embedded ? searchParams.get('area') ?? '' : '')
  // カテゴリーフィルターは廃止
  const [jobDateRange, setJobDateRange] = useState(embedded ? searchParams.get('date') ?? '' : '')

  // Model search filters
  const [modelArea, setModelArea] = useState(embedded ? searchParams.get('area') ?? '' : '')
  const [modelAgeRange, setModelAgeRange] = useState(embedded ? searchParams.get('age') ?? '' : '')
  const [modelHairStyle, setModelHairStyle] = useState(embedded ? searchParams.get('hair') ?? '' : '')
  const [modelGender, setModelGender] = useState(embedded ? searchParams.get('gender') ?? '' : '')
  // カテゴリーフィルターは廃止

  // Advanced filters (shared)
  const [femaleStaff, setFemaleStaff] = useState(false)
  const [maleStaff, setMaleStaff] = useState(false)
  const [creditCardOk, setCreditCardOk] = useState(embedded ? searchParams.get('card') === '1' : false)
  const [maxPrice, setMaxPrice] = useState(embedded ? searchParams.get('price') ?? '' : '')

  // embeddedモードでURLパラメータが変更されたら状態を同期
  useEffect(() => {
    if (embedded) {
      const tabParam = searchParams.get('tab')
      if (tabParam === 'models' || tabParam === 'clients') {
        setActiveTab(tabParam === 'models' ? 'models' : 'jobs')
      }
      setJobArea(searchParams.get('area') ?? '')
      setModelArea(searchParams.get('area') ?? '')
      setModelAgeRange(searchParams.get('age') ?? '')
      setModelHairStyle(searchParams.get('hair') ?? '')
      setModelGender(searchParams.get('gender') ?? '')
      // カテゴリーフィルターは廃止
  }
}, [embedded, searchParams])

  const buildJobQuery = () => {
    const params = new URLSearchParams()
    params.set('tab', 'clients')
    if (jobArea) params.set('area', jobArea)
    // カテゴリーフィルターは廃止
    if (jobDateRange) params.set('date', jobDateRange)
    if (femaleStaff || maleStaff) {
      params.set('staffGender', femaleStaff && maleStaff ? 'both' : femaleStaff ? 'female' : 'male')
    }
    if (creditCardOk) params.set('card', '1')
    if (maxPrice) params.set('price', maxPrice)
    return params
  }

  const buildModelQuery = () => {
    const params = new URLSearchParams()
    params.set('tab', 'models')
    if (modelArea) params.set('area', modelArea)
    if (modelAgeRange) params.set('age', modelAgeRange)
    if (modelHairStyle) params.set('hair', modelHairStyle)
    if (modelGender) params.set('gender', modelGender)
    // カテゴリーフィルターは廃止
    return params
  }

  const handleTabChange = (tab: 'models' | 'jobs') => {
    setActiveTab(tab)
    onTabChange?.(tab)
    
    if (embedded) {
      // embeddedモードではタブ切り替え時にURLを更新
      const params = tab === 'models' ? buildModelQuery() : buildJobQuery()
      router.replace(`/search?${params.toString()}`)
      onSearch?.(params)
    }
  }

  const handleSearch = (tab: 'models' | 'jobs') => {
    const params = tab === 'models' ? buildModelQuery() : buildJobQuery()
    
    if (embedded) {
      router.replace(`/search?${params.toString()}`)
      onSearch?.(params)
    } else {
      router.push(`/search?${params.toString()}`)
    }
  }

  const tabsContent = (
    <Tabs value={activeTab} onValueChange={value => handleTabChange(value as 'models' | 'jobs')} className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-transparent gap-2 p-0 h-auto mb-4 md:mb-5">
        <TabsTrigger
          value="jobs"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-neutral-soft data-[state=inactive]:text-muted-foreground rounded-full py-2 px-4 font-medium text-sm md:text-base transition-all"
        >
          お仕事をお探しの方
        </TabsTrigger>
        <TabsTrigger
          value="models"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-neutral-soft data-[state=inactive]:text-muted-foreground rounded-full py-2 px-4 font-medium text-sm md:text-base transition-all"
        >
          モデルをお探しの方
        </TabsTrigger>
      </TabsList>

            {/* Jobs tab */}
            <TabsContent value="jobs" className="space-y-4 mt-4">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_auto] gap-3 items-end mt-4">
                {/* Area Select */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs md:text-sm font-semibold text-foreground">エリア</label>
                  <div className="relative">
                    <select 
                      value={jobArea}
                      onChange={e => setJobArea(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      {AREA_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* DateTime Select */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs md:text-sm font-semibold text-foreground">日時</label>
                  <div className="relative">
                    <select
                      value={jobDateRange}
                      onChange={e => setJobDateRange(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      {DATE_RANGE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Advanced Filter Button */}
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="text-primary hover:text-secondary text-sm md:text-base font-medium flex items-center gap-1 hover:gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  こだわり条件
                </button>
              </div>

              {showAdvancedFilters && (
                <div className="bg-neutral-soft p-4 rounded-lg space-y-4 border border-border">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-foreground">こだわり条件</h3>
                    <button onClick={() => setShowAdvancedFilters(false)} className="text-muted-foreground hover:text-foreground">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Staff Gender */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground block">スタッフの性別</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={femaleStaff}
                          onChange={e => setFemaleStaff(e.target.checked)}
                          className="w-4 h-4 rounded border-border"
                        />
                        <span className="text-sm text-foreground">女性スタッフ</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={maleStaff}
                          onChange={e => setMaleStaff(e.target.checked)}
                          className="w-4 h-4 rounded border-border"
                        />
                        <span className="text-sm text-foreground">男性スタッフ</span>
                      </label>
                    </div>
                  </div>

                  {/* Credit Card */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={creditCardOk}
                        onChange={e => setCreditCardOk(e.target.checked)}
                        className="w-4 h-4 rounded border-border"
                      />
                      <span className="text-sm font-medium text-foreground">クレジットカード決済OK</span>
                    </label>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground block">料金上限</label>
                    <div className="relative">
                      <select
                        value={maxPrice}
                        onChange={e => setMaxPrice(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      >
                        {PRICE_RANGE_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <Button 
                  onClick={() => handleSearch('jobs')}
                  className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-6"
                >
                  この条件で検索
                </Button>
              </div>
            </TabsContent>

            {/* Salon Search Tab - モデルをお探しの方 */}
            <TabsContent value="models" className="space-y-4 mt-4">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-end mt-4">
                {/* Age Range */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs md:text-sm font-semibold text-foreground">年齢</label>
                  <div className="relative">
                    <select 
                      value={modelAgeRange}
                      onChange={e => setModelAgeRange(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      {AGE_RANGE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Hair Type */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs md:text-sm font-semibold text-foreground">髪質</label>
                  <div className="relative">
                    <select 
                      value={modelHairStyle}
                      onChange={e => setModelHairStyle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      {HAIR_STYLE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Location */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs md:text-sm font-semibold text-foreground">地域</label>
                  <div className="relative">
                    <select 
                      value={modelArea}
                      onChange={e => setModelArea(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      {AREA_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Gender Filter */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs md:text-sm font-semibold text-foreground">性別</label>
                  <div className="relative">
                    <select 
                      value={modelGender}
                      onChange={e => setModelGender(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      {GENDER_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <Button 
                  onClick={() => handleSearch('models')}
                  className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-6"
                >
                  モデルを検索
                </Button>
              </div>
            </TabsContent>
          </Tabs>
  )

  if (noContainer) {
    return tabsContent
  }

  return (
    <div className="relative px-4 md:px-8 pb-12">
      <div className="max-w-4xl mx-auto mt-4 md:-mt-10">
        <div className="bg-white rounded-2xl shadow-lg p-5 md:p-6 border border-border">
          {tabsContent}
        </div>
      </div>
    </div>
  )
}
