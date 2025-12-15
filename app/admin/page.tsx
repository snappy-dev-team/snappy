"use client"

import { useEffect, useMemo, useState } from 'react'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { StudentAccountStatus, UserRecord, listUsers, runSeed, updateStudentStatus } from '@/lib/users'

const statusLabel: Record<StudentAccountStatus, string> = {
  pending: '承認待ち',
  approved: '有効',
  rejected: '無効',
}

export default function AdminPage() {
  const [users, setUsers] = useState<UserRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listUsers()
      .then(setUsers)
      .catch(err => {
        console.error(err)
        setError('ユーザー取得に失敗しました')
      })
      .finally(() => setLoading(false))
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
