import React, { useMemo } from 'react'
import clsx from 'clsx'
import styles from './index.module.scss'

interface ImageProps {
  className?: string
  src: string
  alt: string
  width?: number
  height?: number
}
const Image = ({ className, src, alt, width, height }: ImageProps) => {

  const formatSrc = useMemo(() => {
    return src.replace(/^https?:\/\//, '')
  }, [src])

  return (
    <img
      className={clsx(styles.image, className)}
      src={formatSrc}
      alt={alt}
      width={width}
      height={height}
    />
  )
}

export default Image