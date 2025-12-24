export type SelectOption = {
  label: string
  value: string
}

export const AREA_OPTIONS: SelectOption[] = [
  { label: '選択してください', value: '' },
  { label: '東京', value: 'tokyo' },
  { label: '渋谷', value: 'shibuya' },
  { label: '表参道', value: 'omotesando' },
  { label: '新宿', value: 'shinjuku' },
  { label: '大阪', value: 'osaka' },
  { label: '名古屋', value: 'nagoya' },
]

export const AGE_RANGE_OPTIONS: SelectOption[] = [
  { label: '指定なし', value: '' },
  { label: '18-20歳', value: '18-20' },
  { label: '20-25歳', value: '20-25' },
  { label: '25-30歳', value: '25-30' },
  { label: '30-35歳', value: '30-35' },
  { label: '35歳以上', value: '35+' },
]

export const HAIR_STYLE_OPTIONS: SelectOption[] = [
  { label: '指定なし', value: '' },
  { label: 'ストレート', value: 'straight' },
  { label: 'ウェーブ', value: 'wave' },
  { label: 'カール', value: 'curly' },
  { label: 'その他', value: 'other' },
]

export const GENDER_OPTIONS: SelectOption[] = [
  { label: '選択してください', value: '' },
  { label: '女性', value: 'female' },
  { label: '男性', value: 'male' },
  { label: 'その他', value: 'other' },
]

export const DATE_RANGE_OPTIONS: SelectOption[] = [
  { label: '指定なし', value: '' },
  { label: '今日', value: 'today' },
  { label: '今週', value: 'this-week' },
  { label: '今週末', value: 'this-weekend' },
  { label: '来週', value: 'next-week' },
  { label: '今月', value: 'this-month' },
]

export const PRICE_RANGE_OPTIONS: SelectOption[] = [
  { label: '指定なし', value: '' },
  { label: '〜5,000円', value: '5000' },
  { label: '〜10,000円', value: '10000' },
  { label: '〜20,000円', value: '20000' },
  { label: '〜50,000円', value: '50000' },
]
