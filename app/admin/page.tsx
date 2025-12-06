"use client"

import { Button } from '@/components/ui/button'
import Header from '@/components/header'
import { updateStudentStatus, listUsers, runSeed, UserRecord, StudentAccountStatus } from '@/lib/users'
import { useEffect, useState } from 'react'

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
      setMessage(`ユーザー${userId}の学生ステータスを${status}に更新しました。`)
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

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">管理画面</h1>
          <Button variant="outline" onClick={handleSeed}>
            サンプルデータ投入
          </Button>
        </div>

        {loading && <p className="text-sm text-muted-foreground">読み込み中...</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {message && <p className="text-sm text-primary">{message}</p>}

        <div className="rounded-2xl border border-border bg-white shadow-sm divide-y divide-border">
          {users.map(user => (
            <div key={user.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {user.email} ({user.role})
                </p>
                <p className="text-xs text-muted-foreground">
                  {user.client_company_or_personal_name || user.model_signup_name || '名称未設定'} / ID: {user.id}
                </p>
                {user.client_student_plan && (
                  <p className="text-xs text-primary mt-1">学生プラン希望: {user.client_student_plan ? 'あり' : 'なし'}</p>
                )}
              </div>
              {user.role === 'client' && (
                <div className="flex items-center gap-2">
                  {(['pending', 'approved', 'rejected'] as StudentAccountStatus[]).map(status => (
                    <Button
                      key={status}
                      size="sm"
                      variant={user.student_account_status === status ? 'default' : 'outline'}
                      onClick={() => handleUpdateStatus(user.id, status)}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
