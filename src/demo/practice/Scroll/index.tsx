import React, { useState, useEffect, useRef, useCallback } from 'react'
import { throttle } from '@/utils'
import './index.module.scss'

const delay = () => Math.random() * 1000;

const generateList = async (lastIndex: number) => {
  await new Promise(resolve => setTimeout(resolve, delay()))
  console.log('generateList', delay);
  return Array.from({ length: 10 }, (_, index) => index + lastIndex)
}
const Scroll = ({ demoName }: { demoName: string }) => {
  const [list, setList] = useState<number[]>([])
  const [lastIndex, setLastIndex] = useState(0);
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    if (loading) return;
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setLoading(true)
        setLastIndex((prevLastIndex) => prevLastIndex + 10);
        console.log('load more')
      }
    }
  }, [loading])

  useEffect(() => {
    const loadMore = async () => {
      const newList = await generateList(lastIndex)
      setList(prevList => [...prevList, ...newList])
      setLoading(false)
    }
    loadMore()
  }, [lastIndex])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.addEventListener('scroll', handleScroll)
    }
    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll])

  return (
    <div styleName="scroll-wrapper">
      <h1>{demoName}</h1>
      <div styleName="scroll-container" ref={scrollRef}>
        <div styleName="scroll-content">
          {list.map((item) => (
            <div key={item} styleName="scroll-item">{item}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const ScrollLeft = ({ demoName }: { demoName: string }) => {
  const [list, setList] = useState<number[]>([])
  const [lastIndex, setLastIndex] = useState(0);
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    if (loading) return;
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 50) {
        setLoading(true)
        setLastIndex((prevLastIndex) => prevLastIndex + 10);
        console.log('load more')
      }
    }
  }, [loading])

  useEffect(() => {
    const loadMore = async () => {
      const newList = await generateList(lastIndex)
      setList(prevList => [...prevList, ...newList])
      setLoading(false)
    }
    loadMore()
  }, [lastIndex])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.addEventListener('scroll', handleScroll)
    }
    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll])

  return (
    <div styleName="scroll-left-wrapper">
      <h1>{demoName}</h1>
      <div styleName="scroll-container" ref={scrollRef}>
        <div styleName="scroll-content">
          {list.map((item) => (
            <div key={item} styleName="scroll-item">{item}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Scroll;