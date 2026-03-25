import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Popup } from 'react-vant';
import styles from './index.module.scss';

export interface ConfirmProps {
  show?: boolean;
  title?: string;
  message?: string;
  img?: string;
  type?: string;
  showCloseBtn?: boolean;
  closeBtnText?: string;
  confirmBtnText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

const ConfirmDialog: React.FC<ConfirmProps> = ({
  show = false,
  title,
  message,
  img,
  type,
  showCloseBtn = true,
  closeBtnText = 'cancel',
  confirmBtnText = 'ok',
  onConfirm,
  onCancel,
  onClose
}) => {
  const [showModal, setShowModal] = useState(show);

  useEffect(() => {
    setShowModal(show);
  }, [show]);

  const handleConfirm = useCallback(() => {
    setShowModal(false);
    onConfirm?.();
  }, [onConfirm]);

  const handleCancel = useCallback(() => {
    setShowModal(false);
    onCancel?.();
  }, [onCancel]);

  const handleClose = useCallback(() => {
    setShowModal(false);
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    const handleHashChange = () => {
      if (showModal) {
        handleClose();
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [showModal, handleClose]);

  return (
    <>
      {showModal && createPortal(
        <Popup
          visible={showModal}
          position="bottom"
          round
          style={{ backgroundColor: 'transparent' }}
        >
          <div className={styles.popModal}>
            {title && <h4 className={styles.confirmTitle}>{title}</h4>}
            {message && <p>{message}</p>}
            <div className={styles.btnWrap}>
              {showCloseBtn && (
                <button
                  className={styles.btnCancel}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancel();
                  }}
                >
                  {closeBtnText}
                </button>
              )}
              <button
                className={styles.btnConfirm}
                onClick={(e) => {
                  e.stopPropagation();
                  handleConfirm();
                }}
              >
                {confirmBtnText}
              </button>
            </div>
          </div>
        </Popup>,
        document.body
      )}
    </>
  );
};

export default ConfirmDialog;