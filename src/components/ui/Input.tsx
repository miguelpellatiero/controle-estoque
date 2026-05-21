import type { ChangeEvent } from 'react'

interface InputProps {
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  className?: string
}

export function Input({ type = 'text', placeholder, value, onChange, className }: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
    />
  )
}
