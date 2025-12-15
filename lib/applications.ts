export type ApplicationStatus = 'applied' | 'negotiating' | 'contract' | 'no_response'

export type ApplicationRecord = {
  id: number
  createdAt: string
  applicant_user_id: number
  applicant_role: 'model' | 'client'
  target_job_id?: number
  target_model_user_id?: number
  target_owner_user_id?: number
  status: ApplicationStatus
}

const jsonHeaders = { 'Content-Type': 'application/json' }

export async function listApplications(): Promise<ApplicationRecord[]> {
  const res = await fetch('/api/applications', { cache: 'no-store' })
  if (!res.ok) throw new Error('応募一覧の取得に失敗しました')
  return res.json()
}

export async function createApplication(
  payload: Omit<ApplicationRecord, 'id' | 'createdAt' | 'status'> & Partial<Pick<ApplicationRecord, 'status'>>,
): Promise<ApplicationRecord> {
  const res = await fetch('/api/applications', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || !data?.ok) throw new Error(data?.error ?? '応募に失敗しました')
  return data.application as ApplicationRecord
}

export async function updateApplicationStatus(id: number, status: ApplicationStatus): Promise<ApplicationRecord> {
  const res = await fetch('/api/applications', {
    method: 'PATCH',
    headers: jsonHeaders,
    body: JSON.stringify({ id, status }),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || !data?.ok) throw new Error(data?.error ?? '応募ステータスの更新に失敗しました')
  return data.application as ApplicationRecord
}
