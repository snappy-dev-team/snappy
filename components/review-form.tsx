"use client"

import React, { useState } from 'react'
import { Button } from './ui/button'
import { createReview } from '@/lib/users'
import { UserRecord } from '@/lib/users'

export default function ReviewForm({
  targetUserId,
  currentUser,
  onSuccess,
}: {
  targetUserId: number
  currentUser: UserRecord | null
  onSuccess?: () => void
}) {
  const [rating, setRating] = useState<number>(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const disabled = !currentUser || currentUser.id === undefined

  const submit = async () => {
    if (disabled) return
    setLoading(true)
    try {
      await createReview({
        target_user_id: targetUserId,
        // author_user_id is set server-side based on session token; do not send client-provided author
        // author_user_id: currentUser!.id,
        rating,
        comment,
      })
      setComment('')
      setRating(5)
      onSuccess?.()
    } catch (error) {
      console.error('Failed to post review', error)
      const message = error instanceof Error ? error.message : String(error)
      if (message === 'duplicate_review') {
        alert('既にこのユーザーに対して評価済みです')
      } else if (message === 'role_mismatch') {
        alert('同じ区分への評価はできません')
      } else if (message === 'unauthorized') {
        alert('ログインしてください')
      } else {
        alert('レビューの投稿に失敗しました')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-neutral-soft p-4">
      <p className="text-sm text-muted-foreground">評価する</p>
      <div className="mt-2 flex items-center gap-2">
        {[1, 2, 3, 4, 5].map(i => (
          <button
            key={i}
            type="button"
            onClick={() => setRating(i)}
            className={`text-2xl ${i <= rating ? 'text-yellow-400' : 'text-muted-foreground'}`}
            aria-label={`${i} stars`}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        className="mt-3 w-full p-2 rounded-md border border-border"
        rows={4}
        placeholder="コメント（任意）"
      />
      <div className="flex justify-end mt-3">
        <Button onClick={submit} disabled={disabled || loading}>
          投稿する
        </Button>
      </div>
    </div>
  )
}
