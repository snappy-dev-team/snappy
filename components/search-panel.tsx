"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, X } from "lucide-react"
import { SelectInput } from "@/components/ui/SelectInput"
import {
  AREA_OPTIONS,
  AGE_RANGE_OPTIONS,
  HAIR_STYLE_OPTIONS,
  GENDER_OPTIONS,
  DATE_RANGE_OPTIONS,
  PRICE_RANGE_OPTIONS,
} from "@/constants/search-options"

type SearchPanelProps = {
  embedded?: boolean
  initialTab?: "models" | "jobs"
  onTabChange?: (tab: "models" | "jobs") => void
  onSearch?: (params: URLSearchParams) => void
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

  const getInitialTab = (): "models" | "jobs" => {
    if (initialTab) return initialTab
    if (embedded) {
      const tabParam = searchParams.get("tab")
      return tabParam === "models" ? "models" : "jobs"
    }
    return "jobs"
  }

  const [activeTab, setActiveTab] = useState<"models" | "jobs">(getInitialTab())
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const [jobArea, setJobArea] = useState(embedded ? searchParams.get("area") ?? "" : "")
  const [jobDateRange, setJobDateRange] = useState(embedded ? searchParams.get("date") ?? "" : "")

  const [modelArea, setModelArea] = useState(embedded ? searchParams.get("area") ?? "" : "")
  const [modelAgeRange, setModelAgeRange] = useState(embedded ? searchParams.get("age") ?? "" : "")
  const [modelHairStyle, setModelHairStyle] = useState(embedded ? searchParams.get("hair") ?? "" : "")
  const [modelGender, setModelGender] = useState(embedded ? searchParams.get("gender") ?? "" : "")

  const [femaleStaff, setFemaleStaff] = useState(false)
  const [maleStaff, setMaleStaff] = useState(false)
  const [creditCardOk, setCreditCardOk] = useState(embedded ? searchParams.get("card") === "1" : false)
  const [maxPrice, setMaxPrice] = useState(embedded ? searchParams.get("price") ?? "" : "")

  useEffect(() => {
    if (!embedded) return
    const tabParam = searchParams.get("tab")
    if (tabParam === "models" || tabParam === "clients") {
      setActiveTab(tabParam === "models" ? "models" : "jobs")
    }
    setJobArea(searchParams.get("area") ?? "")
    setModelArea(searchParams.get("area") ?? "")
    setModelAgeRange(searchParams.get("age") ?? "")
    setModelHairStyle(searchParams.get("hair") ?? "")
    setModelGender(searchParams.get("gender") ?? "")
  }, [embedded, searchParams])

  const buildJobQuery = () => {
    const params = new URLSearchParams()
    params.set("tab", "clients")
    if (jobArea) params.set("area", jobArea)
    if (jobDateRange) params.set("date", jobDateRange)
    if (femaleStaff || maleStaff) {
      params.set("staffGender", femaleStaff && maleStaff ? "both" : femaleStaff ? "female" : "male")
    }
    if (creditCardOk) params.set("card", "1")
    if (maxPrice) params.set("price", maxPrice)
    return params
  }

  const buildModelQuery = () => {
    const params = new URLSearchParams()
    params.set("tab", "models")
    if (modelArea) params.set("area", modelArea)
    if (modelAgeRange) params.set("age", modelAgeRange)
    if (modelHairStyle) params.set("hair", modelHairStyle)
    if (modelGender) params.set("gender", modelGender)
    return params
  }

  const handleTabChange = (tab: "models" | "jobs") => {
    setActiveTab(tab)
    onTabChange?.(tab)

    if (embedded) {
      const params = tab === "models" ? buildModelQuery() : buildJobQuery()
      router.replace(`/search?${params.toString()}`)
      onSearch?.(params)
    }
  }

  const handleSearch = (tab: "models" | "jobs") => {
    const params = tab === "models" ? buildModelQuery() : buildJobQuery()

    if (embedded) {
      router.replace(`/search?${params.toString()}`)
      onSearch?.(params)
    } else {
      router.push(`/search?${params.toString()}`)
    }
  }

  const tabsContent = (
    <Tabs value={activeTab} onValueChange={value => handleTabChange(value as "models" | "jobs")} className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-transparent gap-2 p-0 h-auto mb-4 md:mb-5">
        <TabsTrigger
          value="jobs"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-neutral-soft data-[state=inactive]:text-muted-foreground rounded-full py-2 px-4 font-medium text-sm md:text-base transition-all"
        >
          仕事を探す
        </TabsTrigger>
        <TabsTrigger
          value="models"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-neutral-soft data-[state=inactive]:text-muted-foreground rounded-full py-2 px-4 font-medium text-sm md:text-base transition-all"
        >
          モデルを探す
        </TabsTrigger>
      </TabsList>

      {/* Jobs tab */}
      <TabsContent value="jobs" className="space-y-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_auto] gap-3 items-end mt-4">
          <SelectInput
            label="エリア"
            value={jobArea}
            options={AREA_OPTIONS}
            onChange={setJobArea}
            className="text-xs md:text-sm"
          />
          <SelectInput
            label="日付"
            value={jobDateRange}
            options={DATE_RANGE_OPTIONS}
            onChange={setJobDateRange}
            className="text-xs md:text-sm"
          />
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="text-primary hover:text-secondary text-sm md:text-base font-medium flex items-center gap-1 hover:gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            さらに絞り込み
          </button>
        </div>

        {showAdvancedFilters && (
          <div className="bg-neutral-soft p-4 rounded-lg space-y-4 border border-border">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-foreground">さらに絞り込み</h3>
              <button onClick={() => setShowAdvancedFilters(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

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

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={creditCardOk}
                  onChange={e => setCreditCardOk(e.target.checked)}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm font-medium text-foreground">クレジットカードOK</span>
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">予算上限</label>
              <SelectInput
                label=""
                value={maxPrice}
                options={PRICE_RANGE_OPTIONS}
                onChange={setMaxPrice}
                className="text-sm"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button
            onClick={() => handleSearch("jobs")}
            className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-6"
          >
            探す
          </Button>
        </div>
      </TabsContent>

      {/* Models tab */}
      <TabsContent value="models" className="space-y-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-end mt-4">
          <SelectInput
            label="年齢"
            value={modelAgeRange}
            options={AGE_RANGE_OPTIONS}
            onChange={setModelAgeRange}
            className="text-xs md:text-sm"
          />
          <SelectInput
            label="髪質"
            value={modelHairStyle}
            options={HAIR_STYLE_OPTIONS}
            onChange={setModelHairStyle}
            className="text-xs md:text-sm"
          />
          <SelectInput
            label="エリア"
            value={modelArea}
            options={AREA_OPTIONS}
            onChange={setModelArea}
            className="text-xs md:text-sm"
          />
          <SelectInput
            label="性別"
            value={modelGender}
            options={GENDER_OPTIONS}
            onChange={setModelGender}
            className="text-xs md:text-sm"
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            onClick={() => handleSearch("models")}
            className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-6"
          >
            探す
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
