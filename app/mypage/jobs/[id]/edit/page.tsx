"use client"

import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { SelectInput } from '@/components/ui/SelectInput'
import { TextInput } from '@/components/ui/TextInput'
import { Textarea } from '@/components/ui/Textarea'
import { AREA_OPTIONS, AGE_RANGE_OPTIONS, DATE_RANGE_OPTIONS, GENDER_OPTIONS, HAIR_STYLE_OPTIONS } from '@/constants/search-options'
import { clearSessionUser, getSessionUser } from '@/lib/auth'
import { JobGeneralPayload, JobStudentPayload, StudentAccountStatus, UserRecord, listJobs, updateJob } from '@/lib/users'
import { Camera, CalendarClock, CircleDollarSign, LogOut, MapPin, Sparkles, UserCheck, Wand2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { Suspense, useEffect, useMemo, useState, type ReactNode } from 'react'

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
  job_nearest_station_general: '最寄駅',
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
  job_reward_type: '報酬区分（有償/無償など）',
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

type FieldConfig = {
  type?: 'text' | 'textarea' | 'select' | 'images'
  required?: boolean
  placeholder?: string
  helperText?: string
  rows?: number
  options?: { value: string; label: string }[]
}

const fieldConfigs: Record<string, FieldConfig> = {
  job_title_general: { type: 'text', required: true, placeholder: '例：撮影モデル募集' },
  job_title_student: { type: 'text', required: true, placeholder: '例：学生向け撮影モデル募集' },
  job_purpose_general: { type: 'textarea', required: true, rows: 3 },
  job_purpose_student: { type: 'textarea', required: true, rows: 3 },
  job_genre_general: { type: 'text', placeholder: '例：ヘアカタログ / SNS用' },
  job_genre_student: { type: 'text', placeholder: '例：学内コンテスト / SNS用' },
  job_number_general: { type: 'text', placeholder: '例：1～2名' },
  job_number_student: { type: 'text', placeholder: '例：2名' },
  job_salon_name_general: { type: 'text', placeholder: '店舗名' },
  job_salon_area_general: { type: 'select', options: AREA_OPTIONS },
  job_nearest_station_general: { type: 'text', placeholder: '最寄駅・路線など' },
  job_salon_mood_general: { type: 'textarea', rows: 2, placeholder: 'お店の雰囲気やこだわり' },
  job_stylist_name_general: { type: 'text', placeholder: '担当スタイリスト名' },
  job_stylist_name_student: { type: 'text', placeholder: '代表者名でも可' },
  job_school_name_student: { type: 'text', placeholder: '学校名' },
  job_location_address_student: { type: 'textarea', rows: 2, placeholder: '施術場所の住所や目印' },
  job_sns_student: { type: 'text', placeholder: 'Instagram / TikTok など' },
  job_salon_sns_general: { type: 'text', placeholder: 'Instagram / Webサイトなど' },
  job_model_gender: { type: 'select', options: GENDER_OPTIONS, required: true },
  job_model_age_range: { type: 'select', options: AGE_RANGE_OPTIONS },
  job_model_hair_conditions: { type: 'select', options: HAIR_STYLE_OPTIONS },
  job_model_face_visibility: { type: 'textarea', rows: 2, placeholder: '顔出しの可否・条件' },
  job_model_experience: { type: 'textarea', rows: 2, placeholder: '希望する経験やスキル' },
  job_model_other_conditions: { type: 'textarea', rows: 2, placeholder: 'その他の希望条件' },
  job_service_contents: { type: 'textarea', rows: 3, placeholder: '施術内容の詳細' },
  job_style_after: { type: 'textarea', rows: 2, placeholder: '仕上がりイメージ' },
  job_required_time: { type: 'text', placeholder: '所要時間の目安' },
  job_dress_makeup: { type: 'textarea', rows: 2, placeholder: '服装やメイクの指定' },
  job_staff_count: { type: 'text', placeholder: '同席スタッフや撮影人数' },
  job_reward_type: { type: 'text', placeholder: '有償 / 無償 / 商品提供 など' },
  job_reward_cash: { type: 'text', placeholder: '金額目安や条件' },
  job_reward_transport: { type: 'text', placeholder: '交通費の有無・上限' },
  job_reward_details: { type: 'textarea', rows: 2, placeholder: '報酬の補足や備考' },
  job_date_candidates: { type: 'select', options: DATE_RANGE_OPTIONS },
  job_time_range: { type: 'select', options: DATE_RANGE_OPTIONS },
  job_shoot_location: { type: 'text', placeholder: '撮影・施術場所' },
  job_meeting_point: { type: 'text', placeholder: '集合場所や待ち合わせ詳細' },
  job_photo_usage_scope: { type: 'textarea', rows: 3, placeholder: '写真の掲載媒体・期間・範囲など' },
  job_portfolio_images_general: { type: 'images' },
  job_portfolio_images_student: { type: 'images' },
}

type SectionConfig = {
  title: string
  icon: ReactNode
  fields: string[]
  description?: string
  fullWidth?: boolean
}

const generalSections: SectionConfig[] = [
  {
    title: '募集概要',
    icon: <Sparkles className="size-4" />,
    fields: ['job_title_general', 'job_purpose_general', 'job_genre_general', 'job_number_general'],
  },
  {
    title: 'サロン・担当情報',
    icon: <MapPin className="size-4" />,
    fields: [
      'job_salon_name_general',
      'job_salon_area_general',
      'job_nearest_station_general',
      'job_salon_mood_general',
      'job_stylist_name_general',
      'job_salon_sns_general',
    ],
  },
  {
    title: 'モデル条件',
    icon: <UserCheck className="size-4" />,
    fields: [
      'job_model_gender',
      'job_model_age_range',
      'job_model_hair_conditions',
      'job_model_face_visibility',
      'job_model_experience',
      'job_model_other_conditions',
    ],
  },
  {
    title: '施術・撮影内容',
    icon: <Wand2 className="size-4" />,
    fields: ['job_service_contents', 'job_style_after', 'job_required_time', 'job_dress_makeup', 'job_staff_count'],
  },
  {
    title: '日程と場所',
    icon: <CalendarClock className="size-4" />,
    fields: ['job_date_candidates', 'job_time_range', 'job_shoot_location', 'job_meeting_point'],
  },
  {
    title: '報酬・費用',
    icon: <CircleDollarSign className="size-4" />,
    fields: ['job_reward_type', 'job_reward_cash', 'job_reward_transport', 'job_reward_details'],
  },
  {
    title: '写真の利用',
    icon: <Camera className="size-4" />,
    fields: ['job_photo_usage_scope'],
    fullWidth: true,
  },
  {
    title: '募集画像',
    icon: <Camera className="size-4" />,
    fields: ['job_portfolio_images_general'],
    fullWidth: true,
  },
]

const studentSections: SectionConfig[] = [
  {
    title: '募集概要',
    icon: <Sparkles className="size-4" />,
    fields: ['job_title_student', 'job_purpose_student', 'job_genre_student', 'job_number_student'],
  },
  {
    title: '担当・学校情報',
    icon: <MapPin className="size-4" />,
    fields: [
      'job_stylist_name_student',
      'job_school_name_student',
      'job_location_address_student',
      'job_sns_student',
    ],
  },
  {
    title: 'モデル条件',
    icon: <UserCheck className="size-4" />,
    fields: [
      'job_model_gender',
      'job_model_age_range',
      'job_model_hair_conditions',
      'job_model_face_visibility',
      'job_model_experience',
      'job_model_other_conditions',
    ],
  },
  {
    title: '施術・撮影内容',
    icon: <Wand2 className="size-4" />,
    fields: ['job_service_contents', 'job_style_after', 'job_required_time', 'job_dress_makeup', 'job_staff_count'],
  },
  {
    title: '日程と場所',
    icon: <CalendarClock className="size-4" />,
    fields: ['job_date_candidates', 'job_time_range', 'job_shoot_location', 'job_meeting_point'],
  },
  {
    title: '報酬・費用',
    icon: <CircleDollarSign className="size-4" />,
    fields: ['job_reward_type', 'job_reward_cash', 'job_reward_transport', 'job_reward_details'],
  },
  {
    title: '写真の利用',
    icon: <Camera className="size-4" />,
    fields: ['job_photo_usage_scope'],
    fullWidth: true,
  },
  {
    title: '募集画像',
    icon: <Camera className="size-4" />,
    fields: ['job_portfolio_images_student'],
    fullWidth: true,
  },
]

function JobEditContent() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const jobId = useMemo(() => Number(params?.id), [params?.id])

  const [user, setUser] = useState<UserRecord | null>(null)
  const [job, setJob] = useState<JobGeneralPayload | JobStudentPayload | null>(null)
  const [isStudentAccount, setIsStudentAccount] = useState(false)
  const [studentStatus, setStudentStatus] = useState<StudentAccountStatus>('pending')
  const [generalForm, setGeneralForm] = useState<GeneralForm>(emptyGeneralForm)
  const [studentForm, setStudentForm] = useState<StudentForm>(emptyStudentForm)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const formType: 'general' | 'student' = job?.account_type === 'student' ? 'student' : 'general'
  const studentLocked = formType === 'student' && (!isStudentAccount || studentStatus !== 'approved')

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
        if (!target || Number(target.client_id) !== Number(user.id)) {
          setError('募集が見つかりませんでした')
          setJob(null)
          router.replace('/mypage')
          return
        }
        if (target.account_type === 'student' && !isStudentAccount) {
          setError('学生アカウントではないため、この募集は編集できません')
          setJob(null)
          router.replace('/mypage')
          return
        }
        setJob(target)
        if (target.account_type === 'student') {
          const studentTarget = target as JobStudentPayload
          setStudentForm({
            ...emptyStudentForm,
            ...studentTarget,
            client_id: Number(user.id),
            job_portfolio_images_student: (studentTarget.job_portfolio_images_student ?? []).join(','),
          })
        } else {
          const generalTarget = target as JobGeneralPayload
          setGeneralForm({
            ...emptyGeneralForm,
            ...generalTarget,
            client_id: Number(user.id),
            job_portfolio_images_general: (generalTarget.job_portfolio_images_general ?? []).join(','),
          })
        }
      })
      .catch(err => {
        console.error(err)
        setError('募集情報の取得に失敗しました。時間をおいて再度お試しください')
      })
      .finally(() => setLoading(false))
  }, [jobId, user, isStudentAccount, router])

  const parseJobImages = (value: string) =>
    (value ?? '')
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)

  const handleJobImageFiles = (files: FileList | null, targetForm: 'general' | 'student') => {
    if (!files || files.length === 0) return
    if (targetForm === 'student' && studentLocked) {
      setError('学生アカウントが承認されてから画像を追加できます')
      return
    }
    const fileArray = Array.from(files)

    for (const file of fileArray) {
      if (!file.type.startsWith('image/')) {
        setError('画像ファイルを選択してください')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('画像サイズは5MB以下にしてください')
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
      if (targetForm === 'general') {
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

  const handleRemoveJobImage = (index: number, targetForm: 'general' | 'student') => {
    if (targetForm === 'general') {
      setGeneralForm(prev => {
        const next = parseJobImages(prev.job_portfolio_images_general).filter((_, i) => i !== index)
        return { ...prev, job_portfolio_images_general: next.join(',') }
      })
      return
    }
    if (studentLocked) return
    setStudentForm(prev => {
      const next = parseJobImages(prev.job_portfolio_images_student).filter((_, i) => i !== index)
      return { ...prev, job_portfolio_images_student: next.join(',') }
    })
  }

  const handleSubmit = async () => {
    if (!user || !jobId || !job) return
    setError(null)
    try {
      if (formType === 'student') {
        if (studentLocked) {
          setError('学生アカウントの承認後に学生向け募集を更新できます')
          return
        }
        const payload: JobStudentPayload = {
          ...studentForm,
          account_type: 'student',
          client_id: Number(user.id),
          job_status: job.job_status ?? 'active',
          job_portfolio_images_student: parseJobImages(studentForm.job_portfolio_images_student),
        }
        await updateJob(jobId, Number(user.id), payload)
        router.push('/mypage')
      } else {
        const payload: JobGeneralPayload = {
          ...generalForm,
          account_type: 'general',
          client_id: Number(user.id),
          job_status: job.job_status ?? 'active',
          job_portfolio_images_general: parseJobImages(generalForm.job_portfolio_images_general),
        }
        await updateJob(jobId, Number(user.id), payload)
        router.push('/mypage')
      }
    } catch (err) {
      console.error(err)
      setError('仕事募集の更新に失敗しました。時間をおいて再度お試しください')
    }
  }

  const updateField = (key: string, value: string) => {
    if (formType === 'student') {
      setStudentForm(prev => ({ ...prev, [key]: value }))
      return
    }
    setGeneralForm(prev => ({ ...prev, [key]: value }))
  }

  const renderImageField = (key: string) => {
    const value = formType === 'student' ? studentForm.job_portfolio_images_student : generalForm.job_portfolio_images_general
    const images = parseJobImages(value)
    const isStudentField = formType === 'student'

    return (
      <div key={key} className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-foreground">{labels[key] ?? key}</span>
          <span className="text-xs text-muted-foreground">最大5MB / 複数可</span>
        </div>
        {images.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {images.map((image, index) => (
              <div key={`${image}-${index}`} className="relative inline-block">
                <img src={image} alt={`${labels[key] ?? '募集画像'} ${index + 1}`} className="w-28 h-28 rounded-lg border border-border object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveJobImage(index, isStudentField ? 'student' : 'general')}
                  className="absolute -top-2 -right-2 rounded-full bg-destructive px-2 py-1 text-[10px] text-white shadow"
                  disabled={isStudentField && studentLocked}
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <input
            id={`job-image-upload-${key}`}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => handleJobImageFiles(e.target.files, isStudentField ? 'student' : 'general')}
            disabled={isStudentField && studentLocked}
          />
          <label
            htmlFor={`job-image-upload-${key}`}
            className={`inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors ${isStudentField && studentLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-muted'}`}
          >
            画像を追加
          </label>
          {isStudentField && studentLocked && (
            <span className="text-xs text-muted-foreground">学生アカウント承認後にアップロードできます</span>
          )}
        </div>
        <Textarea
          label="画像URLをカンマ区切りで入力（任意）"
          rows={2}
          value={value}
          onChange={next => updateField(key, next)}
          disabled={isStudentField && studentLocked}
          helperText="URLを貼り付けても追加できます"
        />
      </div>
    )
  }

  const renderField = (key: string) => {
    const config = fieldConfigs[key] ?? { type: 'textarea' }
    if (config.type === 'images') return renderImageField(key)

    const rawValue =
      formType === 'student'
        ? (studentForm as Record<string, string | number | undefined>)[key]
        : (generalForm as Record<string, string | number | undefined>)[key]
    const value = typeof rawValue === 'string' ? rawValue : rawValue !== undefined ? String(rawValue) : ''

    if (config.type === 'select' && config.options) {
      return (
        <SelectInput
          key={key}
          label={labels[key] ?? key}
          value={value}
          options={config.options}
          onChange={next => updateField(key, next)}
          required={config.required}
          placeholder={config.placeholder}
          helperText={config.helperText}
          disabled={formType === 'student' && studentLocked}
        />
      )
    }

    if (config.type === 'text') {
      return (
        <TextInput
          key={key}
          label={labels[key] ?? key}
          value={value}
          onChange={next => updateField(key, next)}
          required={config.required}
          placeholder={config.placeholder}
          helperText={config.helperText}
          disabled={formType === 'student' && studentLocked}
        />
      )
    }

    return (
      <Textarea
        key={key}
        label={labels[key] ?? key}
        value={value}
        onChange={next => updateField(key, next)}
        rows={config.rows ?? 3}
        required={config.required}
        placeholder={config.placeholder}
        helperText={config.helperText}
        disabled={formType === 'student' && studentLocked}
      />
    )
  }

  const renderSections = () => {
    const sections = formType === 'student' ? studentSections : generalSections
    return sections.map(section => (
      <FormSection
        key={section.title}
        title={section.title}
        icon={section.icon}
        description={section.description}
      >
        <div className={`grid grid-cols-1 gap-4 ${section.fullWidth ? '' : 'md:grid-cols-2'}`}>
          {section.fields.map(renderField)}
        </div>
      </FormSection>
    ))
  }

  const jobTitle =
    formType === 'student'
      ? studentForm.job_title_student || '仕事募集（学生アカウント）'
      : generalForm.job_title_general || '仕事募集（一般アカウント）'

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center">読み込み中...</div>
  }

  if (!user || !job) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="mx-auto max-w-4xl px-4 md:px-8 py-10">
          <p className="text-sm text-muted-foreground">募集が見つかりませんでした。</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-white to-white">
      <Header />
      <main className="mx-auto max-w-6xl px-4 md:px-8 py-10 space-y-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-primary/20 bg-white/90 p-6 shadow-lg shadow-primary/10 backdrop-blur">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-primary">
                <Sparkles className="size-4" />
                Job Studio
              </p>
              <h1 className="text-xl md:text-3xl font-bold text-foreground">{jobTitle}</h1>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
                  {formType === 'student' ? '学生プラン向け' : '一般プラン向け'}
                </span>
                {formType === 'student' && (
                  <span className="rounded-full bg-secondary/10 px-3 py-1 font-semibold text-secondary">
                    学生ステータス：{studentStatus}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => router.push('/mypage')}>
                マイページへ戻る
              </Button>
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
            <div className="rounded-xl border border-border bg-neutral-50 px-4 py-3">
              <p className="text-xs text-muted-foreground">募集ID</p>
              <p className="font-semibold text-foreground">{job.id ?? '-'}</p>
            </div>
            <div className="rounded-xl border border-border bg-neutral-50 px-4 py-3">
              <p className="text-xs text-muted-foreground">作成日時</p>
              <p className="font-semibold text-foreground">{formatDateTime((job as any).createdAt)}</p>
            </div>
            <div className="rounded-xl border border-border bg-neutral-50 px-4 py-3">
              <p className="text-xs text-muted-foreground">ステータス</p>
              <p className="font-semibold text-foreground">{job.job_status === 'paused' ? '一時停止中' : '募集中'}</p>
            </div>
          </div>
          {formType === 'student' && studentStatus !== 'approved' && (
            <div className="rounded-xl border border-amber-300/80 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              学生アカウントの承認待ちです。承認完了後に入力・保存できるようになります。
            </div>
          )}
        </div>

        <div className="space-y-6">{renderSections()}</div>

        <div className="sticky bottom-6 flex justify-end">
          <Button
            onClick={handleSubmit}
            className="bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/40"
            disabled={formType === 'student' && studentLocked}
          >
            更新する
          </Button>
        </div>
      </main>
    </div>
  )
}

function FormSection({
  title,
  icon,
  children,
  description,
}: {
  title: string
  icon?: ReactNode
  children: ReactNode
  description?: string
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-white/95 shadow-lg shadow-primary/10">
      <div className="flex items-center gap-3 bg-gradient-to-r from-primary to-primary/80 px-4 py-3 text-primary-foreground">
        <div className="size-8 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">{icon}</div>
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold leading-tight">{title}</h3>
          {description && <p className="text-xs text-primary-foreground/80">{description}</p>}
        </div>
      </div>
      <div className="p-6 md:p-8 space-y-4">{children}</div>
    </section>
  )
}

export default function JobEditPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">読み込み中...</div>}>
      <JobEditContent />
    </Suspense>
  )
}
