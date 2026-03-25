import React, { useEffect, useRef, useState, useCallback } from 'react'
import useToggle from '@/hooks/useToggle'
import clsx from 'clsx';
import './index.module.scss'

const delay = () => Math.random() * 1000;
const generateList = async (lastIndex: number) => {
  await new Promise(resolve => setTimeout(resolve, delay()))
  console.log('generateList', delay);
  return Array.from({ length: 50 }, (_, index) => index + lastIndex)
}

const List = () => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [isPullingDown, setIsPullingDown] = useState(false)
  const [pullDistance, setPullDistance] = useState(0); // 改为 pullDistance 更清晰
  const startYRef = useRef(0);
  const loadingRef = useRef(null)
  const listContentRef = useRef(null) // 添加 ref 用于控制列表偏移
  const isPullingRef = useRef(false); // 用 ref 避免频繁状态更新

  const loadMore = async () => {
    setLoading(true)
    const newList = await generateList(list.length)
    console.log('newList', newList)
    setList(prevList => [...prevList, ...newList])
    setLoading(false)
  }

  // 下拉刷新逻辑
  const handleRefresh = useCallback(async () => {
    setLoading(true);
    // 生成新的数据（重置列表）
    const newList = await generateList(0);
    setList(newList);
    setLoading(false);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          console.log('loadMore')
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (loadingRef.current) {
      observer.observe(loadingRef.current)
    }
    return () => observer.disconnect()
  }, [loadMore, loading]) // 添加 loading 依赖

  const handleTouchStart = (e) => {
    // 只有在列表顶部且没有加载中时才允许下拉
    if (listContentRef.current?.scrollTop === 0 && !loading) {
      startYRef.current = e.touches[0].clientY;
      isPullingRef.current = true;
    }
  }

  const handleTouchMove = (e) => {
    if (!isPullingRef.current || loading) return;
    
    const currentY = e.touches[0].clientY;
    let deltaY = currentY - startYRef.current;
    
    // 限制最大下拉距离（80px）
    deltaY = Math.min(80, Math.max(0, deltaY));
    
    // 只有距离大于 0 才阻止默认行为
    if (deltaY > 0) {
      e.preventDefault();
    }
    
    setPullDistance(deltaY);
    
    // 当拉动距离超过 50px 时，触发下拉刷新状态
    if (deltaY >= 50 && !isPullingDown) {
      setIsPullingDown(true);
    } else if (deltaY < 50 && isPullingDown) {
      setIsPullingDown(false);
    }
  }

  const handleTouchEnd = async () => {
    if (!isPullingRef.current || loading) {
      isPullingRef.current = false;
      setPullDistance(0);
      setIsPullingDown(false);
      return;
    }
    
    // 如果下拉距离超过 50px，触发刷新
    if (pullDistance >= 50 && !loading) {
      await handleRefresh();
      // 刷新完成后，等待动画结束再重置
      setTimeout(() => {
        setPullDistance(0);
        setIsPullingDown(false);
      }, 300);
    } else {
      // 未达到刷新条件，直接弹回
      setPullDistance(0);
      setIsPullingDown(false);
    }
    
    isPullingRef.current = false;
  };

  // 计算顶部区域的偏移量（用于视觉反馈）
  const pullAreaStyle = {
    transform: `translateY(${Math.min(pullDistance, 80)}px)`,
    transition: pullDistance === 0 ? 'transform 0.3s ease-out' : 'none',
    opacity: Math.min(pullDistance / 80, 1)
  };

  // 计算列表内容的偏移量
  const listContentStyle = {
    transform: `translateY(${pullDistance}px)`,
    transition: pullDistance === 0 ? 'transform 0.3s ease-out' : 'none',
  };
  
  return (
    <div styleName="list-wrapper">
      {/* 下拉刷新提示区域 - 固定在顶部 */}
      <div styleName="pull-down-area" style={pullAreaStyle}>
        <div styleName="pull-down-area-content">
          <div styleName="pull-down-area-content-text">
            {loading ? '刷新中...' : (isPullingDown ? '释放刷新' : '下拉刷新')}
          </div>
          <div styleName="pull-down-area-content-icon">
            {loading ? '⟳' : (isPullingDown ? '↑' : '↓')}
          </div>
        </div>
      </div>
      
      {/* 列表内容区域 - 跟随手指移动 */}
      <div 
        ref={listContentRef}
        styleName="list-content" 
        style={listContentStyle}
        onTouchStart={handleTouchStart} 
        onTouchMove={handleTouchMove} 
        onTouchEnd={handleTouchEnd}
      >
        <h1>List</h1>
        {list.map((item) => (
          <div key={item} styleName="scroll-item">{item}</div>
        ))}
        <p ref={loadingRef}>{loading ? '加载中...' : '加载完成'}</p>
      </div>
    </div>
  )
}

export default List;