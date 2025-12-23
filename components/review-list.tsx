"use client"

import React, { useState } from 'react'
import { ReviewRecord, UserRecord, updateReview, deleteReview } from '@/lib/users'

export default function ReviewList({ reviews, users, currentUser }: { reviews: ReviewRecord[]; users: UserRecord[]; currentUser?: UserRecord | null }) {
  if (!reviews || reviews.length === 0) {
    return <p className="text-sm text-muted-foreground">レビューはまだありません。</p>
  }
  const [editingId, setEditingId] = useState<number | null>(null)
  const [localRating, setLocalRating] = useState(5)
  const [localComment, setLocalComment] = useState('')

  const startEdit = (r: ReviewRecord) => {
    setEditingId(r.id)
    setLocalRating(r.rating)
    setLocalComment(r.comment ?? '')
  }

  return (
    <div className="space-y-3">
      {reviews.map(r => {
        const author = users.find(u => u.id === r.author_user_id)
        const authorName = author?.model_profile?.model_display_name || author?.client_profile?.client_display_name || author?.name || `ユーザー#${r.author_user_id}`
        const isAuthor = currentUser && currentUser.id === r.author_user_id
        return (
          <div key={r.id} className="p-3 rounded-lg border border-border bg-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-medium">{authorName}</div>
                <div className="mt-2 text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-yellow-400 text-xl">{'★'.repeat(Math.max(0, Math.min(5, Math.floor(r.rating))))}</div>
            </div>
            {editingId === r.id ? (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  {[1,2,3,4,5].map(i => (
                    <button key={i} type="button" onClick={() => setLocalRating(i)} className={`${i <= localRating ? 'text-yellow-400' : 'text-muted-foreground'} text-2xl`}>★</button>
                  ))}
                </div>
                <textarea className="w-full p-2 rounded-md border border-border" rows={3} value={localComment} onChange={e => setLocalComment(e.target.value)} />
                <div className="flex gap-2 justify-end">
                  <button className="px-3 py-1 rounded bg-border text-sm" onClick={() => setEditingId(null)}>キャンセル</button>
                  <button className="px-3 py-1 rounded bg-primary text-sm text-primary-foreground" onClick={async () => {
                    try {
                      await updateReview(r.id, { rating: localRating, comment: localComment })
                      setEditingId(null)
                      window.location.reload()
                    } catch (e) {
                      console.error('Failed to update review', e)
                      alert('更新に失敗しました')
                    }
                  }}>保存</button>
                </div>
              </div>
            ) : (
              <>
                {r.comment && <p className="mt-2 text-sm text-foreground">{r.comment}</p>}
                <div className="mt-3 flex gap-2 justify-end">
                  {isAuthor && (
                    <>
                      <button className="text-sm text-muted-foreground" onClick={() => startEdit(r)}>編集</button>
                      <button className="text-sm text-destructive" onClick={async () => {
                        if (!confirm('このレビューを削除しますか？')) return
                        try {
                          await deleteReview(r.id)
                          window.location.reload()
                        } catch (e) {
                          console.error('Failed to delete review', e)
                          alert('削除に失敗しました')
                        }
                      }}>削除</button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
