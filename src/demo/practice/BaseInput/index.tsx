import React, { useState} from 'react'
import styles from './index.module.scss'
import clsx from 'clsx'

interface BaseInputProps {
  className?: string
  value?: string | number
  onChange?: (value: string) => void
  placeholder?: string
  type?: 'text' | 'password' | 'number' | 'email' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'month' | 'week'
  disabled?: boolean
  readOnly?: boolean
  maxLength?: number
  minLength?: number
  pattern?: string
  required?: boolean,
  rules?: {
    type?: 'string' | 'number' | 'email' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'month' | 'week'
    regex?: RegExp
    min?: string
    max?: string
    required?: boolean
    message?: string
  }
}
const BaseInput: React.FC<BaseInputProps> = ({
  className = '',
  value = '',
  onChange = (value: string | number) => {},
  placeholder = '',
  type = 'text',
  disabled = false,
  readOnly = false,
  maxLength = 10000,
  minLength = 0,
  pattern = '',
  required = false,
  onCompositionStart = () => {},
  onCompositionEnd = () => {},
}) => {
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value
  //   if (rules.type === 'string') {
  //     if (rules.regex) {
  //       if (!rules.regex.test(value)) {
  //         return
  //       }
  //     }
  //   }
  // }
  return (
    <input
      className={clsx(styles.input, className)} 
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      type={type}
      disabled={disabled}
      readOnly={readOnly}
      maxLength={maxLength}
      minLength={minLength}
      pattern={pattern}
      required={required}
      onCompositionStart={onCompositionStart}
      onCompositionEnd={() => {console.log(2);onCompositionEnd}}
    />
  )
}

export default BaseInput;