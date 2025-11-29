import { UserRecord } from './users'

const STORAGE_KEY = 'snappy-user'

export const setSessionUser = (user: UserRecord) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export const getSessionUser = (): UserRecord | null => {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as UserRecord
  } catch (error) {
    console.error('Failed to parse stored user', error)
    return null
  }
}

export const clearSessionUser = () => {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY)
}

export const isLoggedIn = () => Boolean(getSessionUser())
