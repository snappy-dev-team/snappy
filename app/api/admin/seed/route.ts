import { createHash } from 'crypto'
import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

type StoredUser = {
  id: number
  createdAt: string
  role: 'model' | 'client'
  name?: string
  email: string
  passwordHash: string
  model_signup_name?: string
  model_signup_email?: string
  model_signup_birthdate?: string
  model_signup_address?: string
  client_type?: 'individual' | 'corporation'
  client_company_or_personal_name?: string
  client_contact_name?: string
  client_contact_gender?: 'male' | 'female' | 'other'
  client_address?: string
  client_email?: string
  client_phone?: string
  client_student_plan?: boolean
  client_student_id_image?: string
  student_account_status?: 'pending' | 'approved' | 'rejected'
  model_profile?: Record<string, unknown>
  client_profile?: Record<string, unknown>
}

type JobRecord = {
  id: number
  createdAt: string
  client_id: number
  account_type: 'general' | 'student'
  [key: string]: unknown
}

type MatchRecord = {
  id: number
  job_id: number
  model_user_id: number
  client_user_id: number
  status: 'matched' | 'completed' | 'cancelled'
  createdAt: string
}

type ReviewRecord = {
  id: number
  target_user_id: number
  author_user_id: number
  rating: number
  comment: string
  match_id?: number
  createdAt: string
}

const redis = Redis.fromEnv()
const USERS_KEY = 'users'
const JOBS_KEY = 'jobs'
const MATCHES_KEY = 'matches'
const REVIEWS_KEY = 'reviews'

const hashPassword = (password: string) => createHash('sha256').update(password).digest('hex')

export async function GET() {
  try {
    const now = Date.now()
    const createdAt = new Date().toISOString()

    const sampleUsers: StoredUser[] = [
      {
        id: now,
        createdAt,
        role: 'model',
        name: 'モデル 太郎',
        email: 'model1@example.com',
        passwordHash: hashPassword('snappy123'),
        model_signup_name: 'モデル 太郎',
        model_signup_email: 'model1@example.com',
        model_signup_birthdate: '1998-04-10',
        model_signup_address: '東京都渋谷区',
        model_profile: {
          model_display_name: 'Taro Model',
          model_birthdate: '1998-04-10',
          model_gender: 'male',
          model_activity_area: '東京 渋谷',
          model_available_time: '平日夜 / 土日午前',
          model_types: ['スチール', 'ショー'],
          model_height: '178',
          model_bust: '90',
          model_waist: '74',
          model_hip: '90',
          model_shoes_size: '27',
          model_body_type: 'スリム',
          model_hair_style: 'ショート',
          model_main_image: '',
          model_sub_images: [],
          model_job_category: '学生',
          model_hobbies: 'ランニング、カフェ巡り',
          model_ng_conditions: 'ブリーチ不可',
          model_self_intro: 'ヘアモデルを中心に活動中です。',
          model_achievements: '某ヘアショー出演、広告スチール経験あり',
          model_profile_visibility: 'public',
        },
      },
      {
        id: now + 1,
        createdAt,
        role: 'client',
        name: 'Snappyサロン表参道',
        email: 'client1@example.com',
        passwordHash: hashPassword('snappy123'),
        client_type: 'individual',
        client_company_or_personal_name: 'Snappyサロン表参道',
        client_contact_name: '山田 美香',
        client_contact_gender: 'female',
        client_address: '東京都港区北青山',
        client_email: 'client1@example.com',
        client_phone: '090-1111-2222',
        client_student_plan: false,
        student_account_status: 'approved',
        client_profile: {
          client_display_name: 'Snappyサロン表参道',
          client_company_or_personal_name: 'Snappyサロン表参道',
          client_contact_name: '山田 美香',
          client_contact_gender: 'female',
          client_address: '東京都港区北青山',
          client_phone: '090-1111-2222',
          client_student_plan: false,
          student_account_status: 'approved',
        },
      },
      {
        id: now + 2,
        createdAt,
        role: 'client',
        name: '美容学生チーム',
        email: 'student-client@example.com',
        passwordHash: hashPassword('snappy123'),
        client_type: 'individual',
        client_company_or_personal_name: '美容学生チーム',
        client_contact_name: '佐藤 玲',
        client_contact_gender: 'other',
        client_address: '東京都世田谷区',
        client_email: 'student-client@example.com',
        client_phone: '080-3333-4444',
        client_student_plan: true,
        client_student_id_image: 'https://placehold.co/320x200?text=student-id',
        student_account_status: 'approved',
        client_profile: {
          client_display_name: '美容学生チーム',
          client_company_or_personal_name: '美容学生チーム',
          client_contact_name: '佐藤 玲',
          client_contact_gender: 'other',
          client_address: '東京都世田谷区',
          client_phone: '080-3333-4444',
          client_student_plan: true,
          client_student_id_image: 'https://placehold.co/320x200?text=student-id',
          student_account_status: 'approved',
        },
      },
    ]

    const sampleJobs: JobRecord[] = [
      {
        id: now + 100,
        createdAt,
        client_id: now + 1,
        account_type: 'general',
        job_title_general: '春のカラーモデル募集',
        job_purpose_general: 'SNS掲載用',
        job_genre_general: 'カラー',
        job_number_general: '2名',
        job_salon_name_general: 'Snappyサロン表参道',
        job_salon_area_general: '表参道',
        job_nearest_station_general: '表参道駅',
        job_salon_mood_general: '落ち着いたナチュラル系',
        job_stylist_name_general: '山田',
        job_salon_sns_general: '@snappy_omotesando',
        job_portfolio_images_general: ['https://placehold.co/400x300?text=portfolio'],
        job_model_gender: '女性歓迎',
        job_model_age_range: '20-30代',
        job_model_hair_conditions: 'ブリーチ歴あり歓迎',
        job_model_face_visibility: '顔出し必須',
        job_model_experience: '経験不問',
        job_model_other_conditions: '平日午前に来店できる方',
        job_service_contents: 'Wカラー＋トリートメント',
        job_style_after: 'ナチュラルベージュ',
        job_required_time: '2-3時間',
        job_dress_makeup: '指定なし',
        job_staff_count: '3人',
        job_reward_type: '有料',
        job_reward_cash: '5000',
        job_reward_transport: '支給あり',
        job_reward_details: '現金手渡し、交通費込',
        job_date_candidates: '2025-01-10,2025-01-12',
        job_time_range: '10:00-13:00',
        job_shoot_location: '表参道の店舗',
        job_meeting_point: '店舗集合',
        job_photo_usage_scope: 'SNS, HP',
      },
      {
        id: now + 101,
        createdAt,
        client_id: now + 2,
        account_type: 'student',
        job_title_student: '課題作品撮影モデル募集',
        job_purpose_student: '課題制作',
        job_genre_student: 'カット＋撮影',
        job_number_student: '1名',
        job_stylist_name_student: '佐藤',
        job_school_name_student: '東京美容専門学校',
        job_location_address_student: '東京都新宿区',
        job_sns_student: '@beauty_students',
        job_model_gender: '不問',
        job_model_age_range: '10代後半-30代前半',
        job_model_hair_conditions: 'ロング歓迎',
        job_model_face_visibility: '顔出しOK',
        job_model_experience: '経験不問',
        job_model_other_conditions: '日中動ける方',
        job_service_contents: 'カット＋簡易撮影',
        job_style_after: 'ミディアム',
        job_required_time: '2時間',
        job_dress_makeup: 'シンプル私服',
        job_staff_count: '2人',
        job_reward_type: '無料',
        job_reward_cash: '0',
        job_reward_transport: 'なし',
        job_reward_details: '謝礼なし、交通費自己負担',
        job_date_candidates: '2025-01-15',
        job_time_range: '13:00-15:00',
        job_shoot_location: '学校スタジオ',
        job_meeting_point: '学校受付',
        job_photo_usage_scope: '課題提出のみ',
      },
    ]

    const sampleMatches: MatchRecord[] = [
      {
        id: now + 200,
        job_id: now + 100,
        model_user_id: now,
        client_user_id: now + 1,
        status: 'completed',
        createdAt,
      },
      {
        id: now + 201,
        job_id: now + 101,
        model_user_id: now,
        client_user_id: now + 2,
        status: 'matched',
        createdAt,
      },
    ]

    const sampleReviews: ReviewRecord[] = [
      {
        id: now + 300,
        target_user_id: now,
        author_user_id: now + 1,
        rating: 5,
        comment: 'コミュニケーションが丁寧で助かりました。',
        match_id: now + 200,
        createdAt,
      },
      {
        id: now + 301,
        target_user_id: now + 1,
        author_user_id: now,
        rating: 4,
        comment: '仕上がりに満足です！',
        match_id: now + 200,
        createdAt,
      },
    ]

    const existingUsers = ((await redis.get<StoredUser[]>(USERS_KEY)) ?? []) as StoredUser[]
    const mergedUsers = [...existingUsers]

    sampleUsers.forEach(user => {
      const normalized = user.email.trim().toLowerCase()
      const exists = existingUsers.some(
        item =>
          item.email?.trim().toLowerCase() === normalized ||
          item.client_email?.trim().toLowerCase() === normalized ||
          item.model_signup_email?.trim().toLowerCase() === normalized,
      )
      if (!exists) {
        mergedUsers.push(user)
      }
    })

    await redis.set(USERS_KEY, mergedUsers)

    const existingJobs = ((await redis.get<JobRecord[]>(JOBS_KEY)) ?? []) as JobRecord[]
    const mergedJobs = [...existingJobs]
    sampleJobs.forEach(job => {
      if (!mergedJobs.find(j => j.id === job.id)) {
        mergedJobs.push(job)
      }
    })
    await redis.set(JOBS_KEY, mergedJobs)

    const existingMatches = ((await redis.get<MatchRecord[]>(MATCHES_KEY)) ?? []) as MatchRecord[]
    const mergedMatches = [...existingMatches]
    sampleMatches.forEach(match => {
      if (!mergedMatches.find(m => m.id === match.id)) {
        mergedMatches.push(match)
      }
    })
    await redis.set(MATCHES_KEY, mergedMatches)

    const existingReviews = ((await redis.get<ReviewRecord[]>(REVIEWS_KEY)) ?? []) as ReviewRecord[]
    const mergedReviews = [...existingReviews]
    sampleReviews.forEach(review => {
      if (!mergedReviews.find(r => r.id === review.id)) {
        mergedReviews.push(review)
      }
    })
    await redis.set(REVIEWS_KEY, mergedReviews)

    return NextResponse.json({
      ok: true,
      usersAdded: mergedUsers.length - existingUsers.length,
      jobsAdded: mergedJobs.length - existingJobs.length,
      matchesAdded: mergedMatches.length - existingMatches.length,
      reviewsAdded: mergedReviews.length - existingReviews.length,
    })
  } catch (error) {
    console.error('Seed failed', error)
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 })
  }
}
