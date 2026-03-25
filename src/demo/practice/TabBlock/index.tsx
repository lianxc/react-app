import React from 'react'
import clsx from 'clsx'
import Image from '../Image'
import styles from './index.module.scss'

console.log(styles)

interface TabBlockProps {
  className?: string
  title?: string
  type?: string
  source?: string
  topImg?: string
  centerImg?: string
  endImg?: string
  renderTitle?: React.ReactNode
  children?: React.ReactNode
}

const TabBlock = ({
  className,
  title = '',
  type = 'block',
  topImg = '',
  centerImg = '',
  endImg = '',
  renderTitle = null,
  children 
}: TabBlockProps) => {

  const centerStyle = {
    backgroundImage: `url(${centerImg})`,
    backgroundSize: '100%',
    backgroundRepeat: 'repeat-y',
  }

  const showTitle = renderTitle || title;

  return (
    <div styleName={clsx("module")} className={className}>
      {/* 头部 */}
      {showTitle && (
        <div styleName="module-header">
          {renderTitle && renderTitle}
          {!renderTitle && title && <div styleName="module-header-title">{title}</div>}
        </div>
      )}

      {/* 顶部 */}
      <div styleName="module-top">
        <Image className="module-top-img" src={topImg} alt={title} />
      </div>

      {/* 中间 */}
      <div styleName="module-center" style={centerStyle}>
        {children}
      </div>

      {/* 底部 */}
      <div styleName="module-bottom">
        <Image className="module-bottom-img" src={endImg} alt={title} />
      </div>
    </div>
  )
}

export default TabBlock