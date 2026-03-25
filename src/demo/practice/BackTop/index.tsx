import React, { useRef, useEffect, useState } from 'react'
import { pxToRem } from 'COMMON/utils'
import defaultImg from './img/btn-top.png'
import styles from './backtop.module.scss'

const requestAnimationFrame = window.requestAnimationFrame || ((callback: () => void) => setTimeout(callback, 16))
const cancelAnimationFrame = window.cancelAnimationFrame || ((id: number) => clearTimeout(id))

interface BackTopProps {
  width?: number | string;
  height?: number | string;
  posRight?: number | string;
  posBottom?: number | string;
  img?: string;
}
const BackTop: React.FC<BackTopProps> = ({
  width = 79,
  height = 82,
  posRight = 20,
  posBottom = 20,
  img = defaultImg
}) => {
  const [isShow, setIsShow] = useState(false)
  const scrollId = useRef<number>(0)

  const handleClick = () => {
    // 当前距离顶部的滚动高度
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    // 每次滚动的距离
    let perScrollHeight = Math.ceil(scrollTop / 10);

    const toTop = () => {
      // 如果滚动高度大于0，则继续滚动
      if (scrollTop > 0) {
        // 计算最新滚动高度
        scrollTop = Math.max(0, scrollTop - perScrollHeight);
        scrollId.current = requestAnimationFrame(toTop);
        document.body.scrollTop = scrollTop;
        document.documentElement.scrollTop = scrollTop;
      } else {
        cancelAnimationFrame(scrollId.current);
      }
    }
    // 开始滚动
    toTop()
  }

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop > 100) {
      setIsShow(true);
    } else {
      setIsShow(false);
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const customStyles: React.CSSProperties = {
    display: isShow ? 'block' : 'none',
    width: typeof width === 'number' ? pxToRem(width) : width,
    height: typeof height === 'number' ? pxToRem(height) : height,
    backgroundImage: `url(${img})`,
    right: typeof posRight === 'number' ? pxToRem(posRight) : posRight,
    bottom: typeof posBottom === 'number' ? pxToRem(posBottom) : posBottom
  }

  return (
    <div className={styles['btn-top']} onClick={handleClick} style={customStyles}></div>
  )
}

export default BackTop