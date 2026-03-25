import React, { useState, useCallback } from 'react';
import ConfirmDialog, { ConfirmProps } from './Confirm/Confirm';

interface ConfirmOptions {
  title?: string;
  message?: string;
  img?: string;
  type?: string;
  showCloseBtn?: boolean;
  closeBtnText?: string;
  confirmBtnText?: string;
}

export const useConfirm = () => {
  const [showModal, setShowModal] = useState(false);
  const [config, setConfig] = useState<ConfirmOptions>({});
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);
  const [rejectPromise, setRejectPromise] = useState<(() => void) | null>(null);

  const confirm = useCallback((options: string | ConfirmOptions, message?: string): Promise<boolean> => {
    let config: ConfirmOptions;

    if (typeof options === 'object') {
      config = options;
      if (message) {
        config.message = message;
      }
    } else {
      config = {
        title: options,
        message: message || ''
      };
    }

    setConfig(config);
    setShowModal(true);

    return new Promise<boolean>((resolve, reject) => {
      setResolvePromise(() => resolve);
      setRejectPromise(() => reject);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setShowModal(false);
    resolvePromise?.(true);
  }, [resolvePromise]);

  const handleCancel = useCallback(() => {
    setShowModal(false);
    rejectPromise?.();
  }, [rejectPromise]);

  const ConfirmComponent: React.FC = () => (
    <ConfirmDialog
      show={showModal}
      title={config.title}
      message={config.message}
      img={config.img}
      type={config.type}
      showCloseBtn={config.showCloseBtn}
      closeBtnText={config.closeBtnText}
      confirmBtnText={config.confirmBtnText}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return { confirm, ConfirmComponent };
};

export default ConfirmDialog;