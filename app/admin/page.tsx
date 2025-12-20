"use client"

import { useEffect, useMemo, useState } from 'react'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { listApplications, updateApplicationStatus, type ApplicationRecord, type ApplicationStatus } from '@/lib/applications'
import { listJobs, listUsers, runSeed, updateStudentStatus, type StudentAccountStatus, type UserRecord } from '@/lib/users'

const studentStatusLabel: Record<StudentAccountStatus, string> = {
  pending: '承認待ち',
  approved: '有効',
  rejected: '無効',
}

const applicationStatusLabel: Record<ApplicationStatus, string> = {
  applied: '応募済み',
  negotiating: '商談中',
  contract: '契約成立',
  no_response: '未返信',
}

export default function AdminPage() {
  const [users, setUsers] = useState<UserRecord[]>([])
  const [applications, setApplications] = useState<ApplicationRecord[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const userMap = useMemo(() => {
    const map = new Map<number, UserRecord>()
    users.forEach(u => map.set(u.id, u))
    return map
  }, [users])

  const jobMap = useMemo(() => new Map<number, any>(jobs.map((j: any) => [j.id, j])), [jobs])

  const loadAll = async () => {
    setError(null)
    setMessage(null)
    setLoading(true)
    try {
      const [fetchedUsers, fetchedApplications, fetchedJobs] = await Promise.all([listUsers(), listApplications(), listJobs()])
      setUsers(fetchedUsers)
      setApplications(fetchedApplications)
      setJobs(fetchedJobs as any[])
    } catch (err) {
      console.error(err)
      setError('データ取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  const handleUpdateStudentStatus = async (userId: number, status: StudentAccountStatus) => {
    setError(null)
    setMessage(null)
    try {
      const updated = await updateStudentStatus(userId, status)
      setUsers(prev => prev.map(user => (user.id === userId ? updated : user)))
      setMessage(`ユーザー${userId}の学生ステータスを${studentStatusLabel[status]}に更新しました。`)
    } catch (err) {
      console.error(err)
      setError('学生ステータス更新に失敗しました')
    }
  }

  const handleSeed = async () => {
    setError(null)
    setMessage(null)
    try {
      const res = await runSeed()
      setMessage(`サンプルデータを投入しました: users +${res.usersAdded}, jobs +${res.jobsAdded}`)
      await loadAll()
    } catch (err) {
      console.error(err)
      setError('サンプルデータ投入に失敗しました')
    }
  }

  const handleUpdateApplication = async (id: number, status: ApplicationStatus) => {
    setError(null)
    setMessage(null)
    try {
      const updated = await updateApplicationStatus(id, status)
      setApplications(prev => prev.map(app => (app.id === id ? updated : app)))
      setMessage(`応募${id}のステータスを${applicationStatusLabel[status]}に更新しました。`)
    } catch (err) {
      console.error(err)
      setError('応募ステータス更新に失敗しました')
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

  const sortedApplications = useMemo(
    () => [...applications].sort((a, b) => b.id - a.id),
    [applications],
  )

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">管理用マイページ</p>
            <h1 className="text-2xl font-bold text-foreground">学生アカウント管理と応募一覧</h1>
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
                <StudentRow key={user.id} user={user} onUpdate={handleUpdateStudentStatus} />
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
                <StudentRow key={user.id} user={user} onUpdate={handleUpdateStudentStatus} />
              ))}
            </div>
          )}
        </section>

        <ApplicationsSection
          applications={sortedApplications}
          userMap={userMap}
          jobMap={jobMap}
          onUpdateStatus={handleUpdateApplication}
        />
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
          ID: {user.id} / ステータス: {studentStatusLabel[status]}
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

function ApplicationsSection({
  applications,
  userMap,
  jobMap,
  onUpdateStatus,
}: {
  applications: ApplicationRecord[]
  userMap: Map<number, UserRecord>
  jobMap: Map<number, any>
  onUpdateStatus: (id: number, status: ApplicationStatus) => void
}) {
  if (applications.length === 0) {
    return (
      <section className="rounded-2xl border border-border bg-white shadow-sm">
        <div className="p-4 md:p-5 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">応募一覧</h2>
          <span className="text-xs text-muted-foreground">0 件</span>
        </div>
        <p className="p-4 text-sm text-muted-foreground">まだ応募はありません。</p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-border bg-white shadow-sm">
      <div className="p-4 md:p-5 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">応募一覧</h2>
        <span className="text-xs text-muted-foreground">{applications.length} 件</span>
      </div>
      <div className="divide-y divide-border">
        {applications.map(app => {
          const applicant = userMap.get(app.applicant_user_id)
          const applicantName =
            applicant?.role === 'model'
              ? (applicant.model_profile as any)?.model_display_name || applicant?.name || applicant?.email
              : applicant?.client_company_or_personal_name || applicant?.name || applicant?.email
          const target =
            app.target_job_id != null
              ? (() => {
                  const job = jobMap.get(app.target_job_id)
                  const title = job?.job_title_general || job?.job_title_student || `募集ID: ${app.target_job_id}`
                  return `${title} (求人ID: ${app.target_job_id})`
                })()
              : app.target_model_user_id != null
                ? (() => {
                    const modelUser = userMap.get(app.target_model_user_id)
                    const name =
                      (modelUser?.model_profile as any)?.model_display_name ||
                      modelUser?.model_signup_name ||
                      modelUser?.name ||
                      `モデルID: ${app.target_model_user_id}`
                    return `${name} (モデルID: ${app.target_model_user_id})`
                  })()
                : '不明'
          const contact = getContactInfo(applicant)

          return (
            <div key={app.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  応募: {applicantName} ({app.applicant_role})
                </p>
                <p className="text-xs text-muted-foreground">対象: {target} / ステータス: {applicationStatusLabel[app.status]}</p>
                {contact && (
                  <p className="text-xs text-muted-foreground">
                    連絡先 (管理者のみ): {contact}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {(['applied', 'negotiating', 'contract', 'no_response'] as ApplicationStatus[]).map(status => (
                  <Button
                    key={status}
                    size="sm"
                    variant={app.status === status ? 'default' : 'outline'}
                    onClick={() => onUpdateStatus(app.id, status)}
                  >
                    {applicationStatusLabel[status]}
                  </Button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function getContactInfo(user?: UserRecord | null) {
  if (!user) return ''
  const profile = (user.role === 'model' ? user.model_profile : user.client_profile) as any
  const snsType = profile?.contact_sns_type || ''
  const snsId = profile?.contact_sns_id || ''
  const snsText = snsType ? `${snsType}: ${snsId || '未入力'}` : snsId ? snsId : ''
  const email = user.email || ''
  return [snsText, email].filter(Boolean).join(' / ')
}
