"use client"

import { useEffect, useMemo, useState } from 'react'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { StudentAccountStatus, UserRecord, listUsers, runSeed, updateStudentStatus, listJobs, listMatches } from '@/lib/users'

type MatchDisplay = {
  id: number
  job_id: number
  model_user_id: number
  client_user_id: number
  status: string
  createdAt: string
  jobTitle: string
  modelName: string
  clientName: string
  contactEmail?: string
  contactSns?: string
  contactSnsType?: string
}

function detectSnsType(value: string): string {
  const lower = value.toLowerCase()
  if (lower.includes('instagram') || lower.includes('insta') || lower.startsWith('@')) return 'Instagram'
  if (lower.includes('twitter') || lower.includes('x.com')) return 'X'
  if (lower.includes('tiktok')) return 'TikTok'
  if (lower.includes('line.me')) return 'LINE'
  if (lower.includes('facebook')) return 'Facebook'
  if (lower.includes('youtube')) return 'YouTube'
  return 'SNS'
}

const statusLabel: Record<StudentAccountStatus, string> = {
  pending: '承認待ち',
  approved: '有効',
  rejected: '無効',
}

const matchStatusLabel: Record<string, string> = {
  applied: '応募済み',
  negotiating: '商談中',
  contract_signed: '契約成立',
  no_response: '未返信',
  matched: 'matched',
  completed: 'completed',
  cancelled: 'cancelled',
}

const matchStatusOptions = Object.entries(matchStatusLabel).map(([value, label]) => ({ value, label }))

export default function AdminPage() {
  const [users, setUsers] = useState<UserRecord[]>([])
  const [matches, setMatches] = useState<MatchDisplay[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [matchUpdating, setMatchUpdating] = useState<number | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [usersData, jobsData, matchesData] = await Promise.all([listUsers(), listJobs(), listMatches()])
        setUsers(usersData)

        const userMap = new Map(usersData.map(u => [u.id, u]))
        const jobMap = new Map((jobsData ?? []).map((job: any) => [job.id, job]))

        const display = matchesData.map(match => {
          const job = jobMap.get(match.job_id)
          const jobTitle = job
            ? (job.account_type === 'student' ? job.job_title_student : job.job_title_general) || 'タイトル未設定'
            : `Job ${match.job_id}`
          const model = userMap.get(match.model_user_id)
          const client = userMap.get(match.client_user_id)
          return {
            ...match,
            jobTitle,
            modelName:
              (model?.model_profile as any)?.model_display_name ||
              model?.model_signup_name ||
              model?.name ||
              `Model ${match.model_user_id}`,
            clientName:
              (client?.client_profile as any)?.client_display_name ||
              client?.client_company_or_personal_name ||
              client?.name ||
              `Client ${match.client_user_id}`,
            contactEmail: model?.email ?? model?.model_signup_email ?? '',
            contactSns:
              job?.job_salon_sns_general ||
              job?.job_sns_student ||
              (model?.model_profile as any)?.model_sns ||
              '',
            contactSnsType: detectSnsType(
              job?.job_salon_sns_general ||
                job?.job_sns_student ||
                (model?.model_profile as any)?.model_sns ||
                '',
            ),
          }
        })
        setMatches(display)
      } catch (err) {
        console.error(err)
        setError('データ取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleUpdateStatus = async (userId: number, status: StudentAccountStatus) => {
    setError(null)
    setMessage(null)
    try {
      const updated = await updateStudentStatus(userId, status)
      setUsers(prev => prev.map(user => (user.id === userId ? updated : user)))
      setMessage(`ユーザー${userId}の学生ステータスを${statusLabel[status]}に更新しました。`)
    } catch (err) {
      console.error(err)
      setError('ステータス更新に失敗しました')
    }
  }

  const handleSeed = async () => {
    setError(null)
    setMessage(null)
    try {
      const res = await runSeed()
      setMessage(`サンプルデータを投入しました: users +${res.usersAdded}, jobs +${res.jobsAdded}`)
      const refreshed = await listUsers()
      setUsers(refreshed)
    } catch (err) {
      console.error(err)
      setError('サンプルデータ投入に失敗しました')
    }
  }

  const handleUpdateMatchStatus = async (matchId: number, status: string) => {
    setMatchUpdating(matchId)
    setError(null)
    setMessage(null)
    try {
      const res = await fetch('/api/matches', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: matchId, status }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? 'ステータス更新に失敗しました')
      }
      setMatches(prev =>
        prev.map(match => (match.id === matchId ? { ...match, status } : match)),
      )
      setMessage('応募ステータスを更新しました')
    } catch (err) {
      console.error(err)
      setError('ステータス更新に失敗しました')
    } finally {
      setMatchUpdating(null)
    }
  }

  const studentCandidates = useMemo(
    () =>
      users
        .filter(user => user.role === 'client')
        .filter(user => (user.client_student_plan ?? user.client_profile?.client_student_plan ?? false)),
    [users],
  )

  const pendingStudents = useMemo(
    () => studentCandidates.filter(user => (user.student_account_status ?? 'pending') === 'pending'),
    [studentCandidates],
  )

  const processedStudents = useMemo(
    () => studentCandidates.filter(user => (user.student_account_status ?? 'pending') !== 'pending'),
    [studentCandidates],
  )

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">学生アカウント管理</p>
            <h1 className="text-2xl font-bold text-foreground">管理用マイページ</h1>
          </div>
          <Button variant="outline" onClick={handleSeed}>
            サンプルデータ投入
          </Button>
        </div>

        {loading && <p className="text-sm text-muted-foreground">読み込み中...</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {message && <p className="text-sm text-primary">{message}</p>}

        <section className="rounded-2xl border border-border bg-white shadow-sm">
          <div className="p-4 md:p-5 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">承認待ちの学生アカウント</h2>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{pendingStudents.length} 件</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">学生アカウントの有効化/無効化はここだけで行えます。</p>
          </div>

          {pendingStudents.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">承認待ちはありません。</p>
          ) : (
            <div className="divide-y divide-border">
              {pendingStudents.map(user => (
                <StudentRow key={user.id} user={user} onUpdate={handleUpdateStatus} />
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-white shadow-sm">
          <div className="p-4 md:p-5 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">処理済み学生アカウント</h2>
            <span className="text-xs text-muted-foreground">{processedStudents.length} 件</span>
          </div>
          {processedStudents.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">まだありません。</p>
          ) : (
            <div className="divide-y divide-border">
              {processedStudents.map(user => (
                <StudentRow key={user.id} user={user} onUpdate={handleUpdateStatus} />
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-white shadow-sm">
          <div className="p-4 md:p-5 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">応募一覧（最新順）</h2>
            <span className="text-xs text-muted-foreground">{matches.length} 件</span>
          </div>
          {matches.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">応募履歴はまだありません。</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-neutral-soft">
                  <tr>
                    <th className="text-left px-4 py-2 border-b border-border">募集</th>
                    <th className="text-left px-4 py-2 border-b border-border">モデル</th>
                    <th className="text-left px-4 py-2 border-b border-border">クライアント</th>
                    <th className="text-left px-4 py-2 border-b border-border">連絡先</th>
                    <th className="text-left px-4 py-2 border-b border-border">ステータス</th>
                    <th className="text-left px-4 py-2 border-b border-border">日時</th>
                  </tr>
                </thead>
                <tbody>
                  {matches
                    .slice()
                    .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
                    .map(match => (
                      <tr key={match.id} className="hover:bg-neutral-soft/50">
                        <td className="px-4 py-2 border-b border-border">
                          <div className="font-medium text-foreground">{match.jobTitle}</div>
                          <div className="text-xs text-muted-foreground">Job ID: {match.job_id}</div>
                        </td>
                        <td className="px-4 py-2 border-b border-border">
                          <div className="text-foreground">{match.modelName}</div>
                          <div className="text-xs text-muted-foreground">ID: {match.model_user_id}</div>
                        </td>
                        <td className="px-4 py-2 border-b border-border">
                          <div className="text-foreground">{match.clientName}</div>
                          <div className="text-xs text-muted-foreground">ID: {match.client_user_id}</div>
                        </td>
                        <td className="px-4 py-2 border-b border-border">
                          <div className="text-xs text-muted-foreground">メール: {match.contactEmail || '未設定'}</div>
                          <div className="text-xs text-muted-foreground">
                            SNS: {match.contactSnsType && match.contactSns ? `${match.contactSnsType}: ` : ''}
                            {match.contactSns || '未設定'}
                          </div>
                        </td>
                        <td className="px-4 py-2 border-b border-border">
                          <select
                            className="w-full rounded-md border border-border px-3 py-2 text-sm"
                            value={match.status}
                            onChange={e => handleUpdateMatchStatus(match.id, e.target.value)}
                            disabled={matchUpdating === match.id}
                          >
                            {matchStatusOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-2 border-b border-border">{new Date(match.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

function StudentRow({
  user,
  onUpdate,
}: {
  user: UserRecord
  onUpdate: (userId: number, status: StudentAccountStatus) => void
}) {
  const status = user.student_account_status ?? 'pending'

  return (
    <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-foreground">
          {user.email} ({user.client_company_or_personal_name || '名称未設定'})
        </p>
        <p className="text-xs text-muted-foreground">
          ID: {user.id} / ステータス: {statusLabel[status]}
        </p>
        {user.client_student_id_image && <p className="text-xs text-muted-foreground">学生証URL: {user.client_student_id_image}</p>}
      </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant={status === 'approved' ? 'default' : 'outline'} onClick={() => onUpdate(user.id, 'approved')}>
            有効化
          </Button>
          <Button size="sm" variant={status === 'rejected' ? 'default' : 'outline'} onClick={() => onUpdate(user.id, 'rejected')}>
            無効化
          </Button>
          <Button size="sm" variant={status === 'pending' ? 'default' : 'ghost'} onClick={() => onUpdate(user.id, 'pending')}>
            保留に戻す
          </Button>
        </div>
    </div>
  )
}
