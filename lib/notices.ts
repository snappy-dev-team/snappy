export type NoticeRecord = {
  id: number
  title: string
  url?: string
  createdAt: string
}

const jsonHeaders = {
  'Content-Type': 'application/json',
}

export async function listNotices(): Promise<NoticeRecord[]> {
  const res = await fetch('/api/notices')
  if (!res.ok) {
    throw new Error('お知らせの取得に失敗しました')
  }
  return res.json()
}

export async function createNotice(payload: { title: string; url?: string }) {
  const res = await fetch('/api/notices', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error ?? 'お知らせの作成に失敗しました')
  }
  return data.notice as NoticeRecord
}

export async function updateNotice(payload: { id: number; title: string; url?: string }) {
  const res = await fetch('/api/notices', {
    method: 'PATCH',
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error ?? 'お知らせの更新に失敗しました')
  }
  return data.notice as NoticeRecord
}

export async function deleteNotice(id: number) {
  const res = await fetch('/api/notices', {
    method: 'DELETE',
    headers: jsonHeaders,
    body: JSON.stringify({ id }),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error ?? 'お知らせの削除に失敗しました')
  }
  return data
}
