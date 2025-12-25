import { UserRecord } from './users'

const STORAGE_KEY = 'snappy-user'
const MAX_LOCAL_STORAGE_BYTES = 450_000

const stripLargeImages = (user: UserRecord): UserRecord => {
  const clone: UserRecord = JSON.parse(JSON.stringify(user))

  const stripProfileImages = (profile?: any) => {
    if (!profile) return
    const keys = [
      'model_main_image',
      'client_main_image',
      'client_contact_image',
      'client_student_id_image',
    ]
    for (const key of keys) {
      const value = profile[key]
      if (typeof value === 'string' && value.startsWith('data:image')) {
        profile[key] = ''
      }
    }
    const arrayKeys = ['model_sub_images', 'client_sub_images']
    for (const key of arrayKeys) {
      const value = profile[key]
      if (Array.isArray(value)) {
        profile[key] = value.filter((item: string) => typeof item === 'string' && !item.startsWith('data:image'))
      }
    }
  }

  stripProfileImages(clone.model_profile)
  stripProfileImages(clone.client_profile)
  if (typeof clone.client_student_id_image === 'string' && clone.client_student_id_image.startsWith('data:image')) {
    clone.client_student_id_image = ''
  }

  return clone
}

const safeSerializeUser = (user: UserRecord) => {
  const primary = stripLargeImages(user)
  const payload = JSON.stringify(primary)
  if (payload.length <= MAX_LOCAL_STORAGE_BYTES) return payload

  const minimal: UserRecord = {
    id: primary.id,
    createdAt: primary.createdAt,
    role: primary.role,
    name: primary.name,
    email: primary.email,
    client_student_plan: primary.client_student_plan,
    student_account_status: primary.student_account_status,
    contact_sns_type: primary.contact_sns_type,
    contact_sns_id: primary.contact_sns_id,
  }
  return JSON.stringify(minimal)
}

export const setSessionUser = (user: UserRecord) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, safeSerializeUser(user))
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
