import React, { useRef, useEffect, useState, useCallback, ReactNode } from 'react';
import './baseScroll.css';

export interface BaseScrollProps {
  children: ReactNode;
  onLoadMore?: () => Promise<void> | void;
  onRefresh?: () => Promise<void> | void;
  hasMore?: boolean;
  loading?: boolean;
  threshold?: number;
  pullDownThreshold?: number;
  className?: string;
  style?: React.CSSProperties;
  scrollToTop?: boolean;
}

const BaseScroll: React.FC<BaseScrollProps> = ({
  children,
  onLoadMore,
  onRefresh,
  hasMore = true,
  loading = false,
  threshold = 50,
  pullDownThreshold = 80,
  className = '',
  style,
  scrollToTop = false,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [canPull, setCanPull] = useState(true);

  // 滚动到底部加载更多
  const handleScroll = useCallback(() => {
    if (!scrollRef.current || !onLoadMore || loading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const distance = scrollHeight - scrollTop - clientHeight;

    if (distance <= threshold) {
      onLoadMore();
    }
  }, [onLoadMore, loading, hasMore, threshold]);

  // 下拉刷新处理
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!scrollRef.current || !onRefresh) return;

    const { scrollTop } = scrollRef.current;
    if (scrollTop === 0) {
      setCanPull(true);
      setStartY(e.touches[0].clientY);
    } else {
      setCanPull(false);
    }
  }, [onRefresh]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!canPull || !onRefresh || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - startY;

    if (distance > 0 && scrollRef.current?.scrollTop === 0) {
      e.preventDefault();
      setIsPulling(true);
      const pullDist = Math.min(distance * 0.5, pullDownThreshold * 1.5);
      setPullDistance(pullDist);
    }
  }, [canPull, onRefresh, isRefreshing, startY, pullDownThreshold]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling || !onRefresh) return;

    if (pullDistance >= pullDownThreshold) {
      setIsRefreshing(true);
      setPullDistance(pullDownThreshold);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
        setIsPulling(false);
      }
    } else {
      setPullDistance(0);
      setIsPulling(false);
    }
  }, [isPulling, onRefresh, pullDistance, pullDownThreshold]);

  // 滚动到顶部
  useEffect(() => {
    if (scrollToTop && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [scrollToTop]);

  return (
    <div
      className={`base-scroll ${className}`}
      style={style}
      ref={scrollRef}
      onScroll={handleScroll}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 下拉刷新指示器 */}
      {onRefresh && (
        <div
          className="base-scroll-refresh"
          style={{
            height: pullDistance || (isRefreshing ? pullDownThreshold : 0),
            transition: isPulling ? 'none' : 'height 0.3s',
          }}
        >
          {isRefreshing ? (
            <div className="base-scroll-refresh-loading">刷新中...</div>
          ) : pullDistance >= pullDownThreshold ? (
            <div className="base-scroll-refresh-text">释放刷新</div>
          ) : pullDistance > 0 ? (
            <div className="base-scroll-refresh-text">下拉刷新</div>
          ) : null}
        </div>
      )}

      {/* 内容区域 */}
      <div ref={contentRef} className="base-scroll-content">
        {children}
      </div>

      {/* 加载更多指示器 */}
      {onLoadMore && hasMore && (
        <div className="base-scroll-loadmore">
          {loading ? '加载中...' : '上拉加载更多'}
        </div>
      )}

      {onLoadMore && !hasMore && (
        <div className="base-scroll-nomore">没有更多了</div>
      )}
    </div>
  );
};

export default BaseScroll;

