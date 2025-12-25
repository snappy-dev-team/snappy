"use client"

import { useEffect, useMemo, useState } from 'react'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { TextInput } from '@/components/ui/TextInput'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { listApplications, updateApplicationStatus, type ApplicationRecord, type ApplicationStatus } from '@/lib/applications'
import { createNotice, deleteNotice, listNotices, updateNotice, type NoticeRecord } from '@/lib/notices'
import { listJobs, listUsers, runSeed, updateStudentStatus, type StudentAccountStatus, type UserRecord, type JobGeneralPayload, type JobStudentPayload } from '@/lib/users'

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

const formatDateTime = (value?: string) => {
  if (!value) return '日時未設定'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '日時未設定'
  return new Intl.DateTimeFormat('ja-JP', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

const sortNotices = (items: NoticeRecord[]) =>
  [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

export default function AdminPage() {
  const [users, setUsers] = useState<UserRecord[]>([])
  const [applications, setApplications] = useState<ApplicationRecord[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [notices, setNotices] = useState<NoticeRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [noticeTitle, setNoticeTitle] = useState('')
  const [noticeUrl, setNoticeUrl] = useState('')
  const [editingNoticeId, setEditingNoticeId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editUrl, setEditUrl] = useState('')

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
      const [fetchedUsers, fetchedApplications, fetchedJobs, fetchedNotices] = await Promise.all([
        listUsers(),
        listApplications(),
        listJobs(),
        listNotices(),
      ])
      setUsers(fetchedUsers)
      setApplications(fetchedApplications)
      setJobs(fetchedJobs as any[])
      setNotices(fetchedNotices)
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

  const handleCreateNotice = async () => {
    setError(null)
    setMessage(null)
    const title = noticeTitle.trim()
    if (!title) {
      setError('タイトルは必須です。')
      return
    }
    try {
      const notice = await createNotice({ title, url: noticeUrl.trim() })
      setNotices(prev => sortNotices([notice, ...prev]))
      setNoticeTitle('')
      setNoticeUrl('')
      setMessage('お知らせを作成しました。')
    } catch (err) {
      console.error(err)
      setError('お知らせの作成に失敗しました。')
    }
  }

  const handleStartEditNotice = (notice: NoticeRecord) => {
    setEditingNoticeId(notice.id)
    setEditTitle(notice.title)
    setEditUrl(notice.url ?? '')
  }

  const handleCancelEditNotice = () => {
    setEditingNoticeId(null)
    setEditTitle('')
    setEditUrl('')
  }

  const handleUpdateNotice = async () => {
    if (!editingNoticeId) return
    setError(null)
    setMessage(null)
    const title = editTitle.trim()
    if (!title) {
      setError('タイトルは必須です。')
      return
    }
    try {
      const updated = await updateNotice({ id: editingNoticeId, title, url: editUrl.trim() })
      setNotices(prev => sortNotices(prev.map(item => (item.id === updated.id ? updated : item))))
      handleCancelEditNotice()
      setMessage('お知らせを更新しました。')
    } catch (err) {
      console.error(err)
      setError('お知らせの更新に失敗しました。')
    }
  }

  const handleDeleteNotice = async (id: number) => {
    setError(null)
    setMessage(null)
    if (typeof window !== 'undefined' && !window.confirm('このお知らせを削除しますか？')) return
    try {
      await deleteNotice(id)
      setNotices(prev => prev.filter(item => item.id !== id))
      if (editingNoticeId === id) handleCancelEditNotice()
      setMessage('お知らせを削除しました。')
    } catch (err) {
      console.error(err)
      setError('お知らせの削除に失敗しました。')
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

  const sortedNotices = useMemo(() => sortNotices(notices), [notices])

  const allClients = useMemo(
    () => users.filter(user => user.role === 'client'),
    [users],
  )

  const allModels = useMemo(
    () => users.filter(user => user.role === 'model'),
    [users],
  )

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">管理用マイページ</p>
            <h1 className="text-2xl font-bold text-foreground">管理ダッシュボード</h1>
          </div>
          <Button variant="outline" onClick={handleSeed}>
            サンプルデータ投入
          </Button>
        </div>

        {loading && <p className="text-sm text-muted-foreground">読み込み中...</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {message && <p className="text-sm text-primary">{message}</p>}

        <Tabs defaultValue="students" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="students">学生管理</TabsTrigger>
            <TabsTrigger value="jobs">全募集 ({jobs.length})</TabsTrigger>
            <TabsTrigger value="clients">全クライアント ({allClients.length})</TabsTrigger>
            <TabsTrigger value="models">全モデル ({allModels.length})</TabsTrigger>
            <TabsTrigger value="notices">お知らせ ({notices.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="jobs">
            <AllJobsSection jobs={jobs} userMap={userMap} />
          </TabsContent>

          <TabsContent value="clients">
            <AllClientsSection clients={allClients} />
          </TabsContent>

          <TabsContent value="models">
            <AllModelsSection models={allModels} />
          </TabsContent>

          <TabsContent value="notices">
            <NoticesSection
              notices={sortedNotices}
              noticeTitle={noticeTitle}
              noticeUrl={noticeUrl}
              onChangeTitle={setNoticeTitle}
              onChangeUrl={setNoticeUrl}
              onCreate={handleCreateNotice}
              onEditStart={handleStartEditNotice}
              onDelete={handleDeleteNotice}
              editingNoticeId={editingNoticeId}
              editTitle={editTitle}
              editUrl={editUrl}
              onEditTitle={setEditTitle}
              onEditUrl={setEditUrl}
              onUpdate={handleUpdateNotice}
              onEditCancel={handleCancelEditNotice}
            />
          </TabsContent>
        </Tabs>
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
                <p className="text-xs text-muted-foreground">対象: {target}</p>
                <p className="text-xs text-muted-foreground">応募日時: {formatDateTime(app.createdAt)}</p>
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

function AllJobsSection({
  jobs,
  userMap,
}: {
  jobs: (JobGeneralPayload | JobStudentPayload)[]
  userMap: Map<number, UserRecord>
}) {
  if (jobs.length === 0) {
    return (
      <section className="rounded-2xl border border-border bg-white shadow-sm">
        <div className="p-4 md:p-5 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">全募集一覧</h2>
        </div>
        <p className="p-4 text-sm text-muted-foreground">募集はまだありません。</p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-border bg-white shadow-sm">
      <div className="p-4 md:p-5 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">全募集一覧</h2>
        <span className="text-xs text-muted-foreground">{jobs.length} 件</span>
      </div>
      <div className="divide-y divide-border">
        {jobs.map((job) => {
          const client = userMap.get(job.client_id)
          const clientName = client?.client_company_or_personal_name || client?.email || '不明'
          const title = ('job_title_general' in job ? job.job_title_general : job.job_title_student) || '無題'
          const accountType = job.account_type === 'student' ? '学生' : '一般'
          const status = job.job_status === 'paused' ? '一時停止' : '公開中'

          return (
            <div key={job.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">
                  ID: {job.id} / クライアント: {clientName}
                </p>
                <p className="text-xs text-muted-foreground">
                  種別: {accountType} / ステータス: {status}
                </p>
                <p className="text-xs text-muted-foreground">
                  作成日: {formatDateTime(job.createdAt)}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function AllClientsSection({ clients }: { clients: UserRecord[] }) {
  if (clients.length === 0) {
    return (
      <section className="rounded-2xl border border-border bg-white shadow-sm">
        <div className="p-4 md:p-5 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">全クライアント一覧</h2>
        </div>
        <p className="p-4 text-sm text-muted-foreground">クライアントはまだいません。</p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-border bg-white shadow-sm">
      <div className="p-4 md:p-5 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">全クライアント一覧</h2>
        <span className="text-xs text-muted-foreground">{clients.length} 件</span>
      </div>
      <div className="divide-y divide-border">
        {clients.map((client) => {
          const displayName = client.client_profile?.client_display_name || client.client_company_or_personal_name || '名称未設定'
          const clientType = client.client_type === 'corporation' ? '法人' : '個人'
          const isStudent = client.client_student_plan || client.client_profile?.client_student_plan
          const contact = getContactInfo(client)

          return (
            <div key={client.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">{displayName}</p>
                <p className="text-xs text-muted-foreground">
                  ID: {client.id} / メール: {client.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  種別: {clientType} {isStudent && '(学生プラン)'}
                </p>
                {contact && (
                  <p className="text-xs text-muted-foreground">連絡先: {contact}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  登録日: {formatDateTime(client.createdAt)}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function AllModelsSection({ models }: { models: UserRecord[] }) {
  if (models.length === 0) {
    return (
      <section className="rounded-2xl border border-border bg-white shadow-sm">
        <div className="p-4 md:p-5 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">全モデル一覧</h2>
        </div>
        <p className="p-4 text-sm text-muted-foreground">モデルはまだいません。</p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-border bg-white shadow-sm">
      <div className="p-4 md:p-5 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">全モデル一覧</h2>
        <span className="text-xs text-muted-foreground">{models.length} 件</span>
      </div>
      <div className="divide-y divide-border">
        {models.map((model) => {
          const displayName = model.model_profile?.model_display_name || model.model_signup_name || model.name || '名前未設定'
          const activityArea = model.model_profile?.model_activity_area || '未設定'
          const visibility = model.model_profile?.model_profile_visibility === 'public' ? '公開' : '非公開'
          const contact = getContactInfo(model)

          return (
            <div key={model.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">{displayName}</p>
                <p className="text-xs text-muted-foreground">
                  ID: {model.id} / メール: {model.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  活動エリア: {activityArea} / プロフィール: {visibility}
                </p>
                {contact && (
                  <p className="text-xs text-muted-foreground">連絡先: {contact}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  登録日: {formatDateTime(model.createdAt)}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function NoticesSection({
  notices,
  noticeTitle,
  noticeUrl,
  onChangeTitle,
  onChangeUrl,
  onCreate,
  onEditStart,
  onDelete,
  editingNoticeId,
  editTitle,
  editUrl,
  onEditTitle,
  onEditUrl,
  onUpdate,
  onEditCancel,
}: {
  notices: NoticeRecord[]
  noticeTitle: string
  noticeUrl: string
  onChangeTitle: (value: string) => void
  onChangeUrl: (value: string) => void
  onCreate: () => void
  onEditStart: (notice: NoticeRecord) => void
  onDelete: (id: number) => void
  editingNoticeId: number | null
  editTitle: string
  editUrl: string
  onEditTitle: (value: string) => void
  onEditUrl: (value: string) => void
  onUpdate: () => void
  onEditCancel: () => void
}) {
  return (
    <section className="rounded-2xl border border-border bg-white shadow-sm">
      <div className="p-4 md:p-5 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">お知らせ</h2>
        <p className="text-xs text-muted-foreground mt-1">お知らせの追加・編集・削除ができます。</p>
      </div>

      <div className="p-4 md:p-5 space-y-4 border-b border-border">
        <div className="grid gap-3 md:grid-cols-2">
          <TextInput label="タイトル" value={noticeTitle} onChange={onChangeTitle} placeholder="お知らせタイトル" />
          <TextInput label="URL（任意）" value={noticeUrl} onChange={onChangeUrl} placeholder="https://..." />
        </div>
        <Button onClick={onCreate}>追加</Button>
      </div>

      {notices.length === 0 ? (
        <p className="p-4 text-sm text-muted-foreground">お知らせはまだありません。</p>
      ) : (
        <div className="divide-y divide-border">
          {notices.map((notice) => {
            const isEditing = editingNoticeId === notice.id
            return (
              <div key={notice.id} className="p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div className="space-y-2 flex-1">
                  {isEditing ? (
                    <div className="grid gap-3 md:grid-cols-2">
                      <TextInput label="タイトル" value={editTitle} onChange={onEditTitle} />
                      <TextInput label="URL（任意）" value={editUrl} onChange={onEditUrl} />
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-foreground">{notice.title}</p>
                      {notice.url ? (
                        <a
                          href={notice.url}
                          className="text-xs text-primary hover:underline break-words"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {notice.url}
                        </a>
                      ) : (
                        <p className="text-xs text-muted-foreground">リンクなし</p>
                      )}
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Button size="sm" onClick={onUpdate}>
                        保存
                      </Button>
                      <Button size="sm" variant="outline" onClick={onEditCancel}>
                        キャンセル
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => onEditStart(notice)}>
                        編集
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onDelete(notice.id)}>
                        削除
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
