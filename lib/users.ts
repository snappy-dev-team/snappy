export type MemberRole = 'model' | 'client'
export type StudentAccountStatus = 'pending' | 'approved' | 'rejected'
export type ClientType = 'individual' | 'corporation'
export type Gender = 'male' | 'female' | 'other'
export type ContactSnsType = 'instagram' | 'twitter' | 'other' | ''

export type ModelSignupPayload = {
  role: 'model'
  model_signup_name: string
  model_signup_email: string
  model_signup_birthdate: string
  model_signup_address: string
  model_signup_password: string
  model_signup_password_confirm: string
}

export type ClientSignupPayload = {
  role: 'client'
  client_type: ClientType
  client_company_or_personal_name: string
  client_contact_name: string
  client_contact_gender: Gender
  client_address: string
  client_email: string
  client_phone?: string
  client_password: string
  client_password_confirm: string
  client_student_plan?: boolean
  client_student_id_image?: string
}

export type ModelProfile = {
  model_display_name: string
  model_birthdate: string
  model_gender: Gender | ''
  model_activity_area: string
  model_types: string[]
  model_height: string
  model_bust: string
  model_waist: string
  model_hip: string
  model_shoes_size: string
  model_body_type: string
  model_hair_style: string
  model_main_image: string
  model_sub_images: string[]
  model_job_category: string
  model_hobbies: string
  model_ng_conditions: string
  model_self_intro: string
  model_achievements: string
  model_profile_visibility: 'public' | 'private'
  contact_sns_type?: ContactSnsType
  contact_sns_id?: string
}

export type ClientProfile = {
  client_display_name: string
  client_company_or_personal_name: string
  client_contact_name: string
  client_contact_gender: Gender | ''
  client_main_image: string
  client_sub_images: string[]
  client_shop_mood: string
  client_shop_features: string
  client_contact_image: string
  client_address: string
  client_phone?: string
  client_student_plan?: boolean
  client_student_id_image?: string
  student_account_status?: StudentAccountStatus
  contact_sns_type?: ContactSnsType
  contact_sns_id?: string
}

export type JobBase = {
  id?: number
  createdAt?: string
  client_id: number
  account_type: 'general' | 'student'
}

export type JobGeneralPayload = JobBase & {
  job_title_general: string
  job_purpose_general: string
  job_genre_general: string
  job_number_general: string
  job_salon_name_general: string
  job_salon_area_general: string
  job_nearest_station_general: string
  job_salon_mood_general: string
  job_stylist_name_general: string
  job_salon_sns_general: string
  job_portfolio_images_general: string[]
  job_model_gender: string
  job_model_age_range: string
  job_model_hair_conditions: string
  job_model_face_visibility: string
  job_model_experience: string
  job_model_other_conditions: string
  job_service_contents: string
  job_style_after: string
  job_required_time: string
  job_dress_makeup: string
  job_staff_count: string
  job_reward_type: string
  job_reward_cash: string
  job_reward_transport: string
  job_reward_details: string
  job_date_candidates: string
  job_time_range: string
  job_shoot_location: string
  job_meeting_point: string
  job_photo_usage_scope: string
}

export type JobStudentPayload = JobBase & {
  job_title_student: string
  job_purpose_student: string
  job_genre_student: string
  job_number_student: string
  job_stylist_name_student: string
  job_school_name_student: string
  job_location_address_student: string
  job_sns_student: string
  job_portfolio_images_student: string[]
  job_model_gender: string
  job_model_age_range: string
  job_model_hair_conditions: string
  job_model_face_visibility: string
  job_model_experience: string
  job_model_other_conditions: string
  job_service_contents: string
  job_style_after: string
  job_required_time: string
  job_dress_makeup: string
  job_staff_count: string
  job_reward_type: string
  job_reward_cash: string
  job_reward_transport: string
  job_reward_details: string
  job_date_candidates: string
  job_time_range: string
  job_shoot_location: string
  job_meeting_point: string
  job_photo_usage_scope: string
}

export type MatchRecord = {
  id: number
  job_id: number
  model_user_id: number
  client_user_id: number
  status: 'matched' | 'completed' | 'cancelled'
  createdAt: string
}

export type ReviewRecord = {
  id: number
  target_user_id: number
  author_user_id: number
  rating: number
  comment: string
  match_id?: number
  createdAt: string
}

export type Metrics = {
  dynamic_match_count: number
  dynamic_review_count: number
  dynamic_review_rating: number
}

export type UserRecord = {
  id: number
  createdAt: string
  role: MemberRole
  name?: string
  email: string
  passwordHash?: string
  model_signup_name?: string
  model_signup_email?: string
  model_signup_birthdate?: string
  model_signup_address?: string
  client_type?: ClientType
  client_company_or_personal_name?: string
  client_contact_name?: string
  client_contact_gender?: Gender
  client_address?: string
  client_email?: string
  client_phone?: string
  client_student_plan?: boolean
  client_student_id_image?: string
  student_account_status?: StudentAccountStatus
  contact_sns_type?: ContactSnsType
  contact_sns_id?: string
  model_profile?: ModelProfile
  client_profile?: ClientProfile
  metrics?: Metrics
}

export type RegistrationPayload = ModelSignupPayload | ClientSignupPayload

const jsonHeaders = {
  'Content-Type': 'application/json',
}

export async function listUsers(): Promise<UserRecord[]> {
  const res = await fetch('/api/users', { cache: 'no-store' })
  if (!res.ok) {
    throw new Error('ユーザー一覧の取得に失敗しました')
  }
  return res.json()
}

export async function createUser(payload: RegistrationPayload): Promise<UserRecord> {
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  })

  const data = await res.json().catch(() => null)
  if (!res.ok || !data?.ok) {
    const message = data?.error ?? 'ユーザー登録に失敗しました'
    throw new Error(message)
  }

  return data.user as UserRecord
}

export async function updateUserProfile(id: number, updates: Partial<UserRecord>): Promise<UserRecord> {
  const res = await fetch('/api/users', {
    method: 'PATCH',
    headers: jsonHeaders,
    body: JSON.stringify({ id, updates }),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error ?? 'プロフィール更新に失敗しました')
  }
  return data.user as UserRecord
}

export async function findUserByEmail(email: string, role?: MemberRole): Promise<UserRecord | null> {
  const users = await listUsers()
  const normalized = email.trim().toLowerCase()
  return (
    users.find(
      user =>
        user.email?.trim().toLowerCase() === normalized &&
        (role ? user.role === role : true),
    ) ?? null
  )
}

export async function loginUser(email: string, password: string, role?: MemberRole): Promise<UserRecord> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ email, password, role }),
  })

  const data = await res.json().catch(() => null)
  if (!res.ok || !data?.ok) {
    const message =
      data?.error === 'invalid_credentials'
        ? 'メールアドレスまたはパスワードが違います'
        : data?.error ?? 'ログインに失敗しました'
    throw new Error(message)
  }

  return data.user as UserRecord
}

export async function listJobs(): Promise<(JobGeneralPayload | JobStudentPayload)[]> {
  const res = await fetch('/api/jobs', { cache: 'no-store' })
  if (!res.ok) throw new Error('仕事募集の取得に失敗しました')
  return res.json()
}

export async function createJob(payload: JobGeneralPayload | JobStudentPayload) {
  const res = await fetch('/api/jobs', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || !data?.ok) throw new Error(data?.error ?? '仕事募集の登録に失敗しました')
  return data.job as JobGeneralPayload | JobStudentPayload
}

export async function listMatches(): Promise<MatchRecord[]> {
  const res = await fetch('/api/matches', { cache: 'no-store' })
  if (!res.ok) throw new Error('マッチ履歴の取得に失敗しました')
  return res.json()
}

export async function listReviews(): Promise<ReviewRecord[]> {
  const res = await fetch('/api/reviews', { cache: 'no-store' })
  if (!res.ok) throw new Error('レビューの取得に失敗しました')
  return res.json()
}

export async function fetchMetrics(userId: number): Promise<Metrics> {
  const res = await fetch(`/api/metrics?userId=${userId}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('指標の取得に失敗しました')
  return res.json()
}

export async function updateStudentStatus(userId: number, status: StudentAccountStatus) {
  const res = await fetch('/api/admin/student-status', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ userId, status }),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || !data?.ok) throw new Error(data?.error ?? '学生ステータスの更新に失敗しました')
  return data.user as UserRecord
}

export async function runSeed() {
  const res = await fetch('/api/admin/seed', { cache: 'no-store' })
  if (!res.ok) throw new Error('サンプルデータの投入に失敗しました')
  return res.json()
}
