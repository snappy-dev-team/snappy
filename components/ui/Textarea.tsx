'use client'

import React from 'react'
import { cn } from '@/lib/utils'

type TextareaProps = {
  label: string
  value: string
  onChange: (value: string) => void
  rows?: number
  helperText?: string
  required?: boolean
  description?: string
  className?: string
  textareaClassName?: string
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange'>

export function Textarea({
  label,
  value,
  onChange,
  rows = 3,
  helperText,
  required,
  description,
  className,
  textareaClassName,
  ...rest
}: TextareaProps) {
  return (
    <label className={cn('space-y-1 text-sm w-full', className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-foreground">
          {label}
          {required && <span className="ml-1 text-secondary">*</span>}
        </span>
        {description && <span className="text-[11px] text-muted-foreground">{description}</span>}
      </div>
      <textarea
        {...rest}
        rows={rows}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={cn(
          'w-full rounded-xl border border-border bg-white px-3 py-2 shadow-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none',
          textareaClassName,
        )}
      />
      {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
    </label>
  )
}
