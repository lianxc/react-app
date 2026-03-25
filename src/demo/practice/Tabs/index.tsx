import React, { useState, useRef, useMemo } from 'react'
import clsx from 'clsx'
import './index.module.scss'

interface TabItem {
  title: string
  content: React.ReactNode
}
interface TabsProps {
  tabs: TabItem[]
  defaultActiveIndex?: number,
  onChange?: (index: number, tab: TabItem) => void
}
const Tabs = ({ tabs, defaultActiveIndex = 0, onChange }: TabsProps) => {
  const [currentIndex, setCurrentIndex] = useState(defaultActiveIndex)
  const activeTab = tabs[currentIndex]

  // tab 切换
  const handleTabClick = (index: number, tab: TabItem) => {
    if (currentIndex === index) return
    setCurrentIndex(index)
    onChange?.(index, tab)
  }

  // 下划线样式
  const underlineStyle = useMemo(() => {
    return {
      width: `${100 / tabs.length}%`,
      left: `${currentIndex * (100 / tabs.length)}%`
    }
  }, [tabs.length, currentIndex])

  if (tabs.length === 0) return null

  return (
    <div styleName="tabs-wrapper">
      <div styleName="tabs-header">
        <ul styleName="tabs-title">
          {tabs.map((tab, index) => (
            <li styleName={clsx('tabs-title-item', { 'active': currentIndex === index })} key={index} onClick={() => handleTabClick(index, tab)}>
              {tab.title}
            </li>
          ))}
          <div styleName="tabs-underline" style={underlineStyle}></div>
        </ul>
      </div>
      <div styleName="tabs-content">
        {activeTab.content}
      </div>
    </div>
  )
}

export default Tabs;