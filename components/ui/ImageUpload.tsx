'use client'

import React, { useId, useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const MAX_FILE_SIZE = 5 * 1024 * 1024

type BaseProps = {
  label: string
  helperText?: string
  className?: string
}

type ImageUploadProps = BaseProps & {
  value: string
  onChange: (value: string) => void
}

export function ImageUpload({ label, value, onChange, helperText, className }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
      alert('ファイルサイズは5MB以下にしてください')
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください')
      return
    }

    const reader = new FileReader()
    reader.onload = event => {
      const base64 = event.target?.result as string
      onChange(base64)
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    onChange('')
    if (inputRef.current) inputRef.current.value = ''
  }

  const isValidImage = value && (value.startsWith('data:image') || value.startsWith('http'))

  return (
    <div className={cn('space-y-2 text-sm', className)}>
      <span className="font-medium text-foreground">{label}</span>
      <div className="space-y-3">
        {isValidImage && (
          <div className="relative inline-block">
            <img src={value} alt="プレビュー" className="w-28 h-28 object-cover rounded-lg border border-border shadow-sm" />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 shadow hover:bg-destructive/90"
            >
              <X className="size-4" />
            </button>
          </div>
        )}
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={`image-upload-${inputId}`}
          />
          <label
            htmlFor={`image-upload-${inputId}`}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted cursor-pointer"
          >
            <Upload className="size-4" />
            画像を選択
          </label>
          {value && (
            <button type="button" onClick={handleRemove} className="text-xs text-muted-foreground hover:text-foreground">
              リセット
            </button>
          )}
        </div>
        {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
      </div>
    </div>
  )
}

type MultiImageUploadProps = BaseProps & {
  values: string[]
  onChange: (values: string[]) => void
}

export function MultiImageUpload({ label, values, onChange, helperText, className }: MultiImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()
  const normalizedValues = Array.isArray(values) ? values : []

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)

    for (const file of fileArray) {
      if (file.size > MAX_FILE_SIZE) {
        alert('ファイルサイズは5MB以下にしてください')
        return
      }
      if (!file.type.startsWith('image/')) {
        alert('画像ファイルを選択してください')
        return
      }
    }

    const promises = fileArray.map(file => {
      return new Promise<string>(resolve => {
        const reader = new FileReader()
        reader.onload = event => resolve(event.target?.result as string)
        reader.readAsDataURL(file)
      })
    })

    Promise.all(promises).then(newImages => onChange([...normalizedValues, ...newImages]))

    if (inputRef.current) inputRef.current.value = ''
  }

  const handleRemove = (index: number) => {
    const next = normalizedValues.filter((_, i) => i !== index)
    onChange(next)
  }

  return (
    <div className={cn('space-y-2 text-sm', className)}>
      <span className="font-medium text-foreground">{label}</span>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-3">
          {normalizedValues.map((value, index) => {
            const isValidImage = value && (value.startsWith('data:image') || value.startsWith('http'))
            if (!isValidImage) return null
            return (
              <div key={`${value}-${index}`} className="relative inline-block">
                <img src={value} alt={`サブ画像${index + 1}`} className="w-20 h-20 object-cover rounded-lg border border-border shadow-sm" />
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 shadow hover:bg-destructive/90"
                >
                  <X className="size-4" />
                </button>
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id={`multi-image-upload-${inputId}`}
          />
          <label
            htmlFor={`multi-image-upload-${inputId}`}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted cursor-pointer"
          >
            <Upload className="size-4" />
            画像を追加
          </label>
          {normalizedValues.length > 0 && (
            <span className="text-xs text-muted-foreground">{normalizedValues.length}枚を選択中</span>
          )}
        </div>
        {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
      </div>
    </div>
  )
}
