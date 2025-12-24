import { randomBytes } from 'crypto'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

const SESSIONS_KEY = 'sessions'
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7 // 7 days

type SessionEntry = {
  userId: number
  expiresAt: number
}

type SessionStore = Record<string, SessionEntry>

const now = () => Date.now()

const pruneExpiredSessions = async (store: SessionStore): Promise<SessionStore> => {
  const current = now()
  const nextStore: SessionStore = {}
  let mutated = false

  for (const [token, entry] of Object.entries(store)) {
    if (!entry.expiresAt || entry.expiresAt > current) {
      nextStore[token] = entry
    } else {
      mutated = true
    }
  }

  if (mutated) await redis.set(SESSIONS_KEY, nextStore)
  return nextStore
}

const readSessions = async (): Promise<SessionStore> => {
  const stored = ((await redis.get<SessionStore>(SESSIONS_KEY)) ?? {}) as SessionStore
  return pruneExpiredSessions(stored)
}

export const createSession = async (userId: number): Promise<string> => {
  const sessions = await readSessions()
  const token = randomBytes(24).toString('hex')
  sessions[token] = { userId, expiresAt: now() + SESSION_TTL_MS }
  await redis.set(SESSIONS_KEY, sessions)
  return token
}

export const getUserIdBySessionToken = async (token: string): Promise<number | null> => {
  if (!token) return null
  const sessions = await readSessions()
  const session = sessions[token]
  if (!session) return null

  if (session.expiresAt && session.expiresAt <= now()) {
    delete sessions[token]
    await redis.set(SESSIONS_KEY, sessions)
    return null
  }

  return session.userId
}

