"use client"

import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { clearSessionUser, getSessionUser } from '@/lib/auth'
import { JobGeneralPayload, JobStudentPayload, StudentAccountStatus, UserRecord, listJobs, updateJob } from '@/lib/users'
import { LogOut } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { Suspense, useEffect, useMemo, useState } from 'react'

type GeneralForm = Omit<JobGeneralPayload, 'id' | 'createdAt' | 'job_portfolio_images_general'> & {
  job_portfolio_images_general: string
}

type StudentForm = Omit<JobStudentPayload, 'id' | 'createdAt' | 'job_portfolio_images_student'> & {
  job_portfolio_images_student: string
}

const emptyGeneralForm: GeneralForm = {
  client_id: 0,
  account_type: 'general',
  job_title_general: '',
  job_purpose_general: '',
  job_genre_general: '',
  job_number_general: '',
  job_salon_name_general: '',
  job_salon_area_general: '',
  job_nearest_station_general: '',
  job_salon_mood_general: '',
  job_stylist_name_general: '',
  job_salon_sns_general: '',
  job_portfolio_images_general: '',
  job_model_gender: '',
  job_model_age_range: '',
  job_model_hair_conditions: '',
  job_model_face_visibility: '',
  job_model_experience: '',
  job_model_other_conditions: '',
  job_service_contents: '',
  job_style_after: '',
  job_required_time: '',
  job_dress_makeup: '',
  job_staff_count: '',
  job_reward_type: '',
  job_reward_cash: '',
  job_reward_transport: '',
  job_reward_details: '',
  job_date_candidates: '',
  job_time_range: '',
  job_shoot_location: '',
  job_meeting_point: '',
  job_photo_usage_scope: '',
  job_status: 'active',
}

const emptyStudentForm: StudentForm = {
  client_id: 0,
  account_type: 'student',
  job_title_student: '',
  job_purpose_student: '',
  job_genre_student: '',
  job_number_student: '',
  job_stylist_name_student: '',
  job_school_name_student: '',
  job_location_address_student: '',
  job_sns_student: '',
  job_portfolio_images_student: '',
  job_model_gender: '',
  job_model_age_range: '',
  job_model_hair_conditions: '',
  job_model_face_visibility: '',
  job_model_experience: '',
  job_model_other_conditions: '',
  job_service_contents: '',
  job_style_after: '',
  job_required_time: '',
  job_dress_makeup: '',
  job_staff_count: '',
  job_reward_type: '',
  job_reward_cash: '',
  job_reward_transport: '',
  job_reward_details: '',
  job_date_candidates: '',
  job_time_range: '',
  job_shoot_location: '',
  job_meeting_point: '',
  job_photo_usage_scope: '',
  job_status: 'active',
}

const labels: Record<string, string> = {
  job_title_general: 'タイトル',
  job_purpose_general: '目的',
  job_genre_general: 'ジャンル',
  job_number_general: '人数',
  job_salon_name_general: '店名',
  job_salon_area_general: '店名エリア',
  job_nearest_station_general: '最寄り駅',
  job_salon_mood_general: '店の雰囲気',
  job_stylist_name_general: '担当スタイリスト名',
  job_salon_sns_general: 'サロンSNS',
  job_portfolio_images_general: '募集画像',
  job_model_gender: 'モデルの性別条件',
  job_model_age_range: '年齢・年代',
  job_model_hair_conditions: '髪の条件',
  job_model_face_visibility: '顔出し範囲',
  job_model_experience: '経験',
  job_model_other_conditions: 'その他条件',
  job_service_contents: '施術内容',
  job_style_after: '施術後スタイル',
  job_required_time: '所要時間',
  job_dress_makeup: '服装・メイク',
  job_staff_count: '同伴・撮影人数',
  job_reward_type: '報酬区分（有償/無料など）',
  job_reward_cash: '報酬金額',
  job_reward_transport: '交通費支給',
  job_reward_details: '報酬詳細',
  job_date_candidates: '日付候補',
  job_time_range: '時間帯',
  job_shoot_location: '撮影場所',
  job_meeting_point: '集合場所',
  job_photo_usage_scope: '写真の使用範囲',
  job_title_student: '募集タイトル',
  job_purpose_student: '目的',
  job_genre_student: 'ジャンル',
  job_number_student: '人数',
  job_stylist_name_student: 'スタイリスト名（代表可）',
  job_school_name_student: '学校名',
  job_location_address_student: '施術場所住所',
  job_sns_student: 'SNS',
  job_portfolio_images_student: '募集画像',
}

function JobEditContent() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const jobId = useMemo(() => Number(params?.id), [params?.id])

  const [user, setUser] = useState<UserRecord | null>(null)
  const [job, setJob] = useState<any | null>(null)
  const [isStudentAccount, setIsStudentAccount] = useState(false)
  const [studentStatus, setStudentStatus] = useState<StudentAccountStatus>('pending')
  const [generalForm, setGeneralForm] = useState<GeneralForm>(emptyGeneralForm)
  const [studentForm, setStudentForm] = useState<StudentForm>(emptyStudentForm)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const formatDateTime = (value?: string) => {
    if (!value) return '未設定'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '未設定'
    return new Intl.DateTimeFormat('ja-JP', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date)
  }

  useEffect(() => {
    const session = getSessionUser()
    if (!session) {
      router.replace(`/login?redirect=/mypage/jobs/${jobId}/edit`)
      return
    }
    setUser(session)
    setIsStudentAccount(Boolean(session.client_student_plan ?? session.client_profile?.client_student_plan))
    setStudentStatus((session.student_account_status ?? 'pending') as StudentAccountStatus)
  }, [jobId, router])

  useEffect(() => {
    if (!user || !jobId) return
    setLoading(true)
    listJobs()
      .then(jobs => {
        const target = (jobs ?? []).find(item => item.id === jobId)
        if (!target || target.client_id !== user.id) {
          setError('募集が見つかりませんでした。')
          setJob(null)
          router.replace('/mypage')
          return
        }
        if (target.account_type === 'student' && !isStudentAccount) {
          setError('学生アカウントではないため、この募集は編集できません。')
          setJob(null)
          router.replace('/mypage')
          return
        }
        setJob(target)
        const { id: _ignoredId, createdAt: _ignoredCreatedAt, ...rest } = target
        if (target.account_type === 'student') {
          setStudentForm({
            ...emptyStudentForm,
            ...rest,
            client_id: user.id,
            job_portfolio_images_student: (target.job_portfolio_images_student ?? []).join(','),
          })
        } else {
          setGeneralForm({
            ...emptyGeneralForm,
            ...rest,
            client_id: user.id,
            job_portfolio_images_general: (target.job_portfolio_images_general ?? []).join(','),
          })
        }
      })
      .catch(err => {
        console.error(err)
        setError('募集情報の取得に失敗しました。')
      })
      .finally(() => setLoading(false))
  }, [jobId, user])

  const isStudentJob = job?.account_type === 'student'
  const studentLocked = isStudentJob && (!isStudentAccount || studentStatus !== 'approved')

  const parseJobImages = (value: string) =>
    value
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)

  const handleJobImageFiles = (files: FileList | null, formType: 'general' | 'student') => {
    if (!files || files.length === 0) return
    const fileArray = Array.from(files)

    for (const file of fileArray) {
      if (!file.type.startsWith('image/')) {
        setError('画像ファイルを選択してください。')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('画像サイズは5MB以下にしてください。')
        return
      }
    }

    setError(null)
    Promise.all(
      fileArray.map(
        file =>
          new Promise<string>(resolve => {
            const reader = new FileReader()
            reader.onload = event => resolve(event.target?.result as string)
            reader.readAsDataURL(file)
          }),
      ),
    ).then(images => {
      if (formType === 'general') {
        setGeneralForm(prev => {
          const merged = [...parseJobImages(prev.job_portfolio_images_general), ...images]
          return { ...prev, job_portfolio_images_general: merged.join(',') }
        })
        return
      }
      setStudentForm(prev => {
        const merged = [...parseJobImages(prev.job_portfolio_images_student), ...images]
        return { ...prev, job_portfolio_images_student: merged.join(',') }
      })
    })
  }

  const handleRemoveJobImage = (index: number, formType: 'general' | 'student') => {
    if (formType === 'general') {
      setGeneralForm(prev => {
        const next = parseJobImages(prev.job_portfolio_images_general).filter((_, i) => i !== index)
        return { ...prev, job_portfolio_images_general: next.join(',') }
      })
      return
    }
    setStudentForm(prev => {
      const next = parseJobImages(prev.job_portfolio_images_student).filter((_, i) => i !== index)
      return { ...prev, job_portfolio_images_student: next.join(',') }
    })
  }

  const handleSubmit = async () => {
    if (!user || !jobId || !job) return
    setMessage(null)
    setError(null)
    try {
      if (isStudentJob) {
        if (!isStudentAccount) {
          setError('学生アカウントのみ学生向け募集を編集できます。')
          return
        }
        const payload: JobStudentPayload = {
          ...studentForm,
          account_type: 'student',
          client_id: user.id,
          job_status: job.job_status ?? 'active',
          job_portfolio_images_student: studentForm.job_portfolio_images_student
            ? studentForm.job_portfolio_images_student.split(',').map(item => item.trim()).filter(Boolean)
            : [],
        }
        await updateJob(jobId, user.id, payload)
        router.push('/mypage')
      } else {
        const payload: JobGeneralPayload = {
          ...generalForm,
          account_type: 'general',
          client_id: user.id,
          job_status: job.job_status ?? 'active',
          job_portfolio_images_general: generalForm.job_portfolio_images_general
            ? generalForm.job_portfolio_images_general.split(',').map(item => item.trim()).filter(Boolean)
            : [],
        }
        await updateJob(jobId, user.id, payload)
        router.push('/mypage')
      }
    } catch (err) {
      console.error(err)
      setError('仕事募集の更新に失敗しました。')
    }
  }

  const renderFields = () => {
    const usingStudentForm = isStudentJob
    const entries = Object.entries(usingStudentForm ? studentForm : generalForm).filter(
      ([key]) => key !== 'client_id' && key !== 'account_type' && key !== 'job_status' && key !== 'id' && key !== 'createdAt',
    )
    return entries.map(([key, value]) => {
      if (key === 'job_portfolio_images_general' && !usingStudentForm) {
        const images = parseJobImages(generalForm.job_portfolio_images_general)
        return (
          <div key={key} className="space-y-2 text-sm md:col-span-2">
            <span className="font-medium text-foreground">募集画像</span>
            <div className="space-y-3">
              {images.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {images.map((image, index) => (
                    <div key={`${image}-${index}`} className="relative inline-block">
                      <img
                        src={image}
                        alt={`募集画像 ${index + 1}`}
                        className="w-28 h-28 object-cover rounded-lg border border-border"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveJobImage(index, 'general')}
                        className="absolute -top-2 -right-2 bg-destructive text-white rounded-full px-2 py-1 text-[10px]"
                      >
                        削除
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  id="job-image-upload-edit"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={e => handleJobImageFiles(e.target.files, 'general')}
                />
                <label
                  htmlFor="job-image-upload-edit"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted cursor-pointer transition-colors text-sm"
                >
                  画像を追加
                </label>
                <span className="text-xs text-muted-foreground">最大5MBまで</span>
              </div>
              <textarea
                value={generalForm.job_portfolio_images_general}
                onChange={e => setGeneralForm(prev => ({ ...prev, job_portfolio_images_general: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-border"
                placeholder="画像URLをカンマ区切りで入力も可能です"
              />
            </div>
          </div>
        )
      }
      if (key === 'job_portfolio_images_student' && usingStudentForm) {
        const images = parseJobImages(studentForm.job_portfolio_images_student)
        return (
          <div key={key} className="space-y-2 text-sm md:col-span-2">
            <span className="font-medium text-foreground">募集画像</span>
            <div className="space-y-3">
              {images.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {images.map((image, index) => (
                    <div key={`${image}-${index}`} className="relative inline-block">
                      <img
                        src={image}
                        alt={`募集画像 ${index + 1}`}
                        className="w-28 h-28 object-cover rounded-lg border border-border"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveJobImage(index, 'student')}
                        className="absolute -top-2 -right-2 bg-destructive text-white rounded-full px-2 py-1 text-[10px]"
                        disabled={studentLocked}
                      >
                        削除
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  id="job-image-upload-edit-student"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={e => handleJobImageFiles(e.target.files, 'student')}
                  disabled={studentLocked}
                />
                <label
                  htmlFor="job-image-upload-edit-student"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted cursor-pointer transition-colors text-sm"
                >
                  画像を追加
                </label>
                <span className="text-xs text-muted-foreground">最大5MBまで</span>
              </div>
              <textarea
                value={studentForm.job_portfolio_images_student}
                onChange={e => setStudentForm(prev => ({ ...prev, job_portfolio_images_student: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-border"
                placeholder="画像URLをカンマ区切りで入力も可能です"
                disabled={studentLocked}
              />
            </div>
          </div>
        )
      }
      return (
        <label key={key} className="space-y-2 text-sm">
          <span className="font-medium text-foreground">{labels[key] ?? key}</span>
          <textarea
            value={value as string}
            onChange={e =>
              isStudentJob
                ? setStudentForm(prev => ({ ...prev, [key]: e.target.value }))
                : setGeneralForm(prev => ({ ...prev, [key]: e.target.value }))
            }
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-border"
            disabled={studentLocked}
          />
        </label>
      )
    })
  }

  if (!user) return null

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        読み込み中...
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-5xl mx-auto px-4 md:px-8 py-10">
          <p className="text-sm text-muted-foreground">募集が見つかりませんでした。</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">仕事募集の編集</p>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {isStudentJob ? '仕事募集（学生アカウント）' : '仕事募集（一般アカウント）'}
            </h1>
            {isStudentJob && (
              <div className="text-xs text-muted-foreground mt-1 space-y-1">
                <p>学生ステータス: {studentStatus}。approved でない場合は入力できません。</p>
                {!isStudentAccount && <p className="text-destructive">学生アカウントではないため学生募集は利用できません。</p>}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push('/mypage')}>
              マイページへ戻る
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-destructive text-destructive"
              onClick={() => {
                clearSessionUser()
                router.replace('/login')
              }}
            >
              <LogOut className="size-4" />
              ログアウト
            </Button>
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {message && <p className="text-sm text-primary">{message}</p>}

        <section className="rounded-2xl border border-border bg-white shadow-sm p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">募集ID</p>
              <div className="p-3 rounded-xl border border-border bg-neutral-soft/60 text-foreground">
                {job.id ?? '未設定'}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">作成日時</p>
              <div className="p-3 rounded-xl border border-border bg-neutral-soft/60 text-foreground">
                {formatDateTime(job.createdAt)}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{renderFields()}</div>
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              className="bg-primary text-primary-foreground"
              disabled={studentLocked}
            >
              更新する
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default function JobEditPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">読み込み中...</div>}>
      <JobEditContent />
    </Suspense>
  )
}
