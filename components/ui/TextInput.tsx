'use client'

import React from 'react'
import { cn } from '@/lib/utils'

type TextInputProps = {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  helperText?: string
  required?: boolean
  description?: string
  leading?: React.ReactNode
  trailing?: React.ReactNode
  className?: string
  inputClassName?: string
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type' | 'placeholder'>

export function TextInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  helperText,
  required,
  description,
  leading,
  trailing,
  className,
  inputClassName,
  ...rest
}: TextInputProps) {
  return (
    <label className={cn('space-y-1 text-sm w-full', className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-foreground">
          {label}
          {required && <span className="ml-1 text-secondary">*</span>}
        </span>
        {description && <span className="text-[11px] text-muted-foreground">{description}</span>}
      </div>
      <div
        className={cn(
          'group flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 shadow-sm transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
          inputClassName,
        )}
      >
        {leading && <div className="text-muted-foreground">{leading}</div>}
        <input
          {...rest}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        {trailing && <div className="text-muted-foreground">{trailing}</div>}
      </div>
      {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
    </label>
  )
}
