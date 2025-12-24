"use client"

import React, { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

type SelectOption = { value: string; label: string }

type SelectInputProps = {
  label: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  placeholder?: string
  helperText?: string
  helper?: string
  required?: boolean
  description?: string
  className?: string
  selectClassName?: string
} & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange">

export function SelectInput({
  label,
  value,
  options,
  onChange,
  placeholder,
  helperText,
  helper,
  required,
  description,
  className,
  selectClassName,
  ...rest
}: SelectInputProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({})
  const selected = options.find(option => option.value === value)
  const disabled = rest.disabled

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node
      if (containerRef.current && containerRef.current.contains(target)) return
      if (menuRef.current && menuRef.current.contains(target)) return
      setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const updatePosition = () => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      setMenuStyle({
        position: "fixed",
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      })
    }
    updatePosition()
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition, true)
    return () => {
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition, true)
    }
  }, [open])

  const handleSelect = (next: string) => {
    onChange(next)
    setOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      setOpen(prev => !prev)
    }
    if (e.key === "Escape") setOpen(false)
  }

  return (
    <label className={cn("space-y-1 text-sm w-full", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-foreground">
          {label}
          {required && <span className="ml-1 text-secondary">*</span>}
        </span>
        {description && <span className="text-[11px] text-muted-foreground">{description}</span>}
      </div>

      <div ref={containerRef} className="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => !disabled && setOpen(prev => !prev)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={cn(
            "flex w-full items-center justify-between rounded-xl border border-border bg-white px-3 py-2 text-sm text-foreground shadow-sm transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:opacity-60",
            selectClassName,
          )}
        >
          <span className={cn("flex-1 text-left", !selected?.label && "text-muted-foreground")}>
            {selected?.label || placeholder || "選択してください"}
          </span>
          <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
        </button>

        {open &&
          createPortal(
            <div
              ref={menuRef}
              style={menuStyle}
              className="overflow-hidden rounded-xl border border-border bg-white shadow-xl shadow-primary/15"
            >
              <ul role="listbox" className="max-h-64 overflow-auto py-1">
                {options.map(option => (
                  <li key={`${option.value}-${option.label}`}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={option.value === value}
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors text-left",
                        option.value === value
                          ? "bg-primary/10 text-primary font-semibold"
                          : "hover:bg-primary/5 text-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "size-2.5 rounded-full border border-primary/40",
                          option.value === value ? "bg-primary" : "bg-white",
                        )}
                      />
                      <span>{option.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>,
            document.body,
          )}

        <select
          {...rest}
          value={value}
          onChange={e => onChange(e.target.value)}
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
        >
          {options.map(option => (
            <option key={`${option.value}-${option.label}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {(helperText ?? helper) && <p className="text-xs text-muted-foreground">{helperText ?? helper}</p>}
    </label>
  )
}
