import React from 'react'
import clsx from 'clsx'
import styles from './index.module.scss'

interface ButtonProps {
  className?: string
  children: React.ReactNode
  onClick: () => void
}
const Button = ({ className, children, onClick }: ButtonProps) => {
  return (
    <button className={clsx(styles.button, className)} onClick={onClick}>
      {children}
    </button>
  )
}

export default Button