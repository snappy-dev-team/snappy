import type { SelectOption } from './search-options'

const buildTimeOptions = (): SelectOption[] => {
  const options: SelectOption[] = [{ label: '選択してください', value: '' }]
  for (let hour = 0; hour < 24; hour += 1) {
    for (let minute = 0; minute < 60; minute += 5) {
      const h = String(hour).padStart(2, '0')
      const m = String(minute).padStart(2, '0')
      const value = `${h}:${m}`
      options.push({ label: value, value })
    }
  }
  return options
}

export const TIME_OPTIONS = buildTimeOptions()
