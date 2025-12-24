const parseTimeToMinutes = (value: string): number | null => {
  if (!value) return null
  const [hourRaw, minuteRaw] = value.split(':')
  if (hourRaw == null || minuteRaw == null) return null
  const hour = Number(hourRaw)
  const minute = Number(minuteRaw)
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null
  return hour * 60 + minute
}

const parseTimeRange = (value: string): { start: number; end: number } | null => {
  if (!value) return null
  const [startRaw, endRaw] = value.split('-')
  const start = parseTimeToMinutes(startRaw?.trim() ?? '')
  const end = parseTimeToMinutes(endRaw?.trim() ?? '')
  if (start == null || end == null) return null
  return start <= end ? { start, end } : { start: end, end: start }
}

export const isTimeInRange = (jobTimeRange: string, searchStart: string, searchEnd: string): boolean => {
  if (!searchStart && !searchEnd) return true
  const jobRange = parseTimeRange(jobTimeRange)
  if (!jobRange) return false

  const searchStartMin = parseTimeToMinutes(searchStart) ?? 0
  const searchEndMin = parseTimeToMinutes(searchEnd) ?? 24 * 60

  return jobRange.start <= searchEndMin && jobRange.end >= searchStartMin
}
