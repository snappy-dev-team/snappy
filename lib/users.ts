export type UserRecord = {
  id: number
  createdAt: string
  name: string
  email: string
  age?: number
  profile?: string
  role?: 'model' | 'client'
  image?: string
}

export type UserPayload = {
  name: string
  email: string
  password: string
  age?: number
  profile?: string
  role?: 'model' | 'client'
  image?: string
}

const jsonHeaders = {
  'Content-Type': 'application/json',
}

export async function listUsers(): Promise<UserRecord[]> {
  const res = await fetch('/api/users', { cache: 'no-store' })
  if (!res.ok) {
    throw new Error('ユーザー一覧の取得に失敗しました')
  }
  return res.json()
}

export async function createUser(payload: UserPayload): Promise<UserRecord> {
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  })

  const data = await res.json().catch(() => null)
  if (!res.ok || !data?.ok) {
    const message = data?.error ?? 'ユーザー登録に失敗しました'
    throw new Error(message)
  }

  return data.user as UserRecord
}

export async function findUserByEmail(email: string, role?: 'model' | 'client'): Promise<UserRecord | null> {
  const users = await listUsers()
  const normalized = email.trim().toLowerCase()
  return (
    users.find(
      user =>
        user.email?.trim().toLowerCase() === normalized &&
        (role ? user.role === role : true),
    ) ?? null
  )
}

export async function loginUser(email: string, password: string, role?: 'model' | 'client'): Promise<UserRecord> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ email, password, role }),
  })

  const data = await res.json().catch(() => null)
  if (!res.ok || !data?.ok) {
    const message =
      data?.error === 'invalid_credentials'
        ? 'メールアドレスまたはパスワードが違います'
        : data?.error ?? 'ログインに失敗しました'
    throw new Error(message)
  }

  return data.user as UserRecord
}
