/*
 * 生年月日から年齢を計算
 */
export const calculateAge = (birthdate: string): number => {
  if (!birthdate) return 0
  const birth = new Date(birthdate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

/*
 * 年齢が指定範囲内かチェック
 */
export const isAgeInRange = (age: number, range: string): boolean => {
  if (!range) return true
  switch (range) {
    case '18-20':
      return age >= 18 && age <= 20
    case '20-25':
      return age >= 20 && age <= 25
    case '25-30':
      return age >= 25 && age <= 30
    case '30-35':
      return age >= 30 && age <= 35
    case '35+':
      return age >= 35
    default:
      return true
  }
}

/*
 * 日付が指定範囲内かチェック
 * @param jobDateRange - 仕事に設定された日付範囲（today, this-week等）
 * @param searchRange - 検索で指定された日付範囲
 */
export const isDateInRange = (jobDateRange: string, searchRange: string): boolean => {
  if (!searchRange) return true
  if (!jobDateRange) return false

  /* 同じ範囲なら一致 */
  if (jobDateRange === searchRange) return true

  /*
   * 検索範囲に仕事の日付範囲が重なるかチェック
   * 例: 仕事が「今週」で検索が「今日」→ 一致（今週には今日が含まれる）
   * 例: 仕事が「来週」で検索が「今日」→ 不一致（来週には今日が含まれない）
   */

  /* 今日で検索した場合 */
  if (searchRange === 'today') {
    return ['today', 'this-week', 'this-weekend', 'this-month'].includes(jobDateRange)
  }

  /* 今週末で検索した場合 */
  if (searchRange === 'this-weekend') {
    return ['today', 'this-week', 'this-weekend', 'this-month'].includes(jobDateRange)
  }

  /* 今週で検索した場合 */
  if (searchRange === 'this-week') {
    return ['today', 'this-week', 'this-weekend', 'this-month'].includes(jobDateRange)
  }

  /* 来週で検索した場合 */
  if (searchRange === 'next-week') {
    return ['next-week', 'this-month'].includes(jobDateRange)
  }

  /* 今月で検索した場合 */
  if (searchRange === 'this-month') {
    return ['today', 'this-week', 'this-weekend', 'next-week', 'this-month'].includes(jobDateRange)
  }

  return false
}
