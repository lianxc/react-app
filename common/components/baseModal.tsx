import React, { useEffect, useRef, ReactNode } from 'react';
import './baseModal.css';

export interface BaseModalProps {
  visible: boolean;
  onClose?: () => void;
  title?: string;
  children: ReactNode;
  maskClosable?: boolean;
  closable?: boolean;
  footer?: ReactNode;
  width?: string | number;
  className?: string;
  maskClassName?: string;
  zIndex?: number;
  destroyOnClose?: boolean;
}

let count = 0; // 打开的弹窗数量

const BaseModal: React.FC<BaseModalProps> = ({
  visible,
  onClose,
  title,
  children,
  maskClosable = true,
  closable = true,
  footer,
  width = '80%',
  className = '',
  maskClassName = '',
  zIndex = 1000,
  destroyOnClose = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLBodyElement | null>(null);

  useEffect(() => {
    bodyRef.current = document.body;
    const originalOverflow = bodyRef.current.style.overflow;
    if (visible) {
      count++;
      // 第一个弹窗打开时，锁定body的滚动
      if (count === 1) {
        bodyRef.current.style.overflow = 'hidden';
      }
    }
    return () => {
      if (!visible) count--;
      // 最后一个弹窗关闭时，解锁body的滚动
      if (count === 0) {
        bodyRef.current.style.overflow = originalOverflow;
      }
    };
  }, [visible]);

  const handleMaskClick = (e: React.MouseEvent) => {
    if (maskClosable && e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  if (!visible && destroyOnClose) {
    return null;
  }

  return (
    <>
      {visible && (
        <div
          className={`base-modal-mask ${maskClassName}`}
          style={{ zIndex }}
          onClick={handleMaskClick}
        >
          <div
            ref={modalRef}
            className={`base-modal ${className}`}
            style={{ width, zIndex: zIndex + 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 头部 */}
            {(title || closable) && (
              <div className="base-modal-header">
                {title && <div className="base-modal-title">{title}</div>}
                {closable && (
                  <button
                    className="base-modal-close"
                    onClick={handleClose}
                    aria-label="关闭"
                  >
                    ×
                  </button>
                )}
              </div>
            )}

            {/* 内容 */}
            <div className="base-modal-body">{children}</div>

            {/* 底部 */}
            {footer && <div className="base-modal-footer">{footer}</div>}
          </div>
        </div>
      )}
    </>
  );
};

export default BaseModal;

