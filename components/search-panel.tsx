'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChevronDown, Plus, X } from 'lucide-react'
import Link from 'next/link'

const categories = [
  { label: 'ヘア', active: true },
  { label: 'ネイル', active: false },
  { label: 'アイラッシュ', active: false },
]

export default function SearchPanel() {
  const [activeTab, setActiveTab] = useState<'models' | 'jobs'>('models')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Filters (shared across tabs)
  const [femaleStaff, setFemaleStaff] = useState(false)
  const [maleStaff, setMaleStaff] = useState(false)
  const [creditCardOk, setCreditCardOk] = useState(false)
  const [maxPrice, setMaxPrice] = useState('50000')

  const buildQuery = (tab: 'models' | 'jobs') => {
    const params = new URLSearchParams()
    params.set('tab', tab)
    if (femaleStaff || maleStaff) {
      params.set('gender', femaleStaff && maleStaff ? 'both' : femaleStaff ? 'female' : 'male')
    }
    if (creditCardOk) params.set('card', '1')
    if (maxPrice) params.set('price', maxPrice)
    return params.toString()
  }

  return (
    <div className="relative px-4 md:px-8 pb-12">
      <div className="max-w-4xl mx-auto -mt-8 md:-mt-12">
        <div className="bg-white rounded-2xl shadow-lg p-5 md:p-6 border border-border">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={value => setActiveTab(value as 'models' | 'jobs')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-transparent gap-2 p-0 h-auto mb-4 md:mb-5">
              <TabsTrigger
                value="models"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-neutral-soft data-[state=inactive]:text-muted-foreground rounded-full py-2 px-4 font-medium text-sm md:text-base transition-all"
              >
                モデルをお探しの方
              </TabsTrigger>
              <TabsTrigger
                value="jobs"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-neutral-soft data-[state=inactive]:text-muted-foreground rounded-full py-2 px-4 font-medium text-sm md:text-base transition-all"
              >
                お仕事をお探しの方
              </TabsTrigger>
            </TabsList>

            {/* Jobs tab */}
            <TabsContent value="jobs" className="space-y-4 mt-4">
              {/* Category Pills */}
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.label}
                    className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${
                      cat.active ? 'bg-primary text-primary-foreground' : 'bg-neutral-soft text-muted-foreground hover:bg-border'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_auto] gap-3 items-end mt-4">
                {/* Area Select */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs md:text-sm font-semibold text-foreground">エリア</label>
                  <div className="relative">
                    <select className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                      <option>エリアを選択</option>
                      <option>東京</option>
                      <option>渋谷</option>
                      <option>表参道</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* DateTime Select */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs md:text-sm font-semibold text-foreground">日時</label>
                  <div className="relative">
                    <select className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                      <option>いつ行きたいか選択</option>
                      <option>今週末</option>
                      <option>来週</option>
                      <option>来月</option>
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
                        <option value="50000">¥50,000以内</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <Link href={`/search?${buildQuery('jobs')}`}>
                  <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-6">
                    この条件で検索
                  </Button>
                </Link>
              </div>
            </TabsContent>

            {/* Salon Search Tab - モデルをお探しの方 */}
            <TabsContent value="models" className="space-y-4 mt-4">
              {/* Category Pills */}
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.label}
                    className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${
                      cat.active ? 'bg-primary text-primary-foreground' : 'bg-neutral-soft text-muted-foreground hover:bg-border'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] gap-3 items-end mt-4">
                {/* Age Range */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs md:text-sm font-semibold text-foreground">年齢</label>
                  <div className="relative">
                    <select className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                      <option>年齢を選択</option>
                      <option>18-20歳</option>
                      <option>20-25歳</option>
                      <option>25-30歳</option>
                      <option>その他</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Hair Type */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs md:text-sm font-semibold text-foreground">髪質</label>
                  <div className="relative">
                    <select className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                      <option>髪質を選択</option>
                      <option>ストレート</option>
                      <option>ウェーブ</option>
                      <option>くせ毛</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Location */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs md:text-sm font-semibold text-foreground">地域</label>
                  <div className="relative">
                    <select className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                      <option>地域を選択</option>
                      <option>東京</option>
                      <option>渋谷</option>
                      <option>表参道</option>
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

                  {/* Staff Gender for Salon */}
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

                  {/* Credit Card for Salon */}
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

                  {/* Price Range for Salon */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground block">料金上限</label>
                    <div className="relative">
                      <select
                        value={maxPrice}
                        onChange={e => setMaxPrice(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      >
                        <option value="50000">¥50,000以内</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <Link href={`/search?${buildQuery('models')}`}>
                  <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-6">
                    モデルを検索
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
