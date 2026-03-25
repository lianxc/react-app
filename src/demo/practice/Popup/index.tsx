import React, { useState, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import clsx from 'clsx';
import styles from './index.module.scss';

interface PopupProps {
  className?: string
  visible: boolean
  children: React.ReactNode
  closeOnMaskClick?: boolean
  showCloseButton?: boolean
  position?: 'center' | 'bottom'
  destroyOnClose?: boolean
  onClose?: () => void
}
const Popup = ({
  className,
  visible,
  children,
  position = 'center',
  closeOnMaskClick = true,
  showCloseButton = true,
  destroyOnClose = true,
  onClose = () => {}
}: PopupProps) => {
  const [shouldRender, setShouldRender] = useState(false);
  const nodeRef = useRef(null);

  // 点击遮罩层关闭
  const handleMaskClick = () => {
    if (closeOnMaskClick) {
      onClose()
    }
  }

  // 控制渲染时机
  useEffect(() => {
    if (visible) {
      setShouldRender(true);
    } else if (destroyOnClose) {
      // 延迟销毁，等待动画结束
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 1300); // 假设动画时长 300ms
      return () => clearTimeout(timer);
    }
  }, [visible, destroyOnClose]);

  // 动画类名
  const classNames = useMemo(() => {
    const animateName = position === 'center' ? 'Fade' : 'Slide';
    return {
      enter: styles[`popup${animateName}Enter`],
      enterActive: styles[`popup${animateName}EnterActive`],
      exit: styles[`popup${animateName}Exit`],
      exitActive: styles[`popup${animateName}ExitActive`],
      appear: styles[`popup${animateName}Appear`],
      appearActive: styles[`popup${animateName}AppearActive`]
    }
  }, [position]);

  if (!shouldRender) return null;

  return (
    <>
      {createPortal(
        <div styleName={clsx('popup-wrapper', { 'hidden': !visible })} className={className}>
          <div styleName="popup-mask" onClick={handleMaskClick}></div>
          <CSSTransition
            nodeRef={nodeRef}
            in={visible}
            timeout={300}
            classNames={classNames}
            appear={true} // 首次渲染也有动画
            onEnter={() => console.log('开始进入')}
            onEntering={() => console.log('进入中')}
            onEntered={() => console.log('进入完成')}
            onExit={() => console.log('开始退出')}
            onExiting={() => console.log('退出中')}
            onExited={() => console.log('退出完成')}
            onEnded={() => console.log('动画结束')}
          >
            <div styleName={clsx('popup-content', position)} ref={nodeRef}>
              {children}
              { showCloseButton && <button styleName="popup-close-button" onClick={onClose}>X</button>} 
            </div>
          </CSSTransition>
        </div>,
        document.body)}
    </>
  )
}

export default Popup