import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './Toast.css';

export interface ToastProps {
  text: string;
  duration?: number;
  onClose?: () => void;
  type?: 'success' | 'error' | 'warning' | 'info';
  position?: 'top' | 'center' | 'bottom';
}

const Toast: React.FC<ToastProps> = ({
  text,
  duration = 2000,
  onClose,
  type = 'info',
  position = 'center',
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          onClose?.();
        }, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className={`toast toast-${position} toast-${type}`}>
      <div className="toast-content">{text}</div>
    </div>
  );
};

// Toast 静态方法
export interface ToastOptions {
  text: string;
  duration?: number;
  onClose?: () => void;
  type?: 'success' | 'error' | 'warning' | 'info';
  position?: 'top' | 'center' | 'bottom';
}

let toastContainer: HTMLDivElement | null = null;

const createToast = (options: ToastOptions) => {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toastElement = document.createElement('div');
  toastContainer.appendChild(toastElement);

  const close = () => {
    ReactDOM.unmountComponentAtNode(toastElement);
    toastElement.remove();
    options.onClose?.();
  };

  ReactDOM.render(
    <Toast {...options} onClose={close} />,
    toastElement
  );
};

export const toast = {
  success: (text: string, options?: Omit<ToastOptions, 'text' | 'type'>) => {
    createToast({ text, type: 'success', ...options });
  },
  error: (text: string, options?: Omit<ToastOptions, 'text' | 'type'>) => {
    createToast({ text, type: 'error', ...options });
  },
  warning: (text: string, options?: Omit<ToastOptions, 'text' | 'type'>) => {
    createToast({ text, type: 'warning', ...options });
  },
  info: (text: string, options?: Omit<ToastOptions, 'text' | 'type'>) => {
    createToast({ text, type: 'info', ...options });
  },
  show: (options: ToastOptions) => {
    createToast(options);
  },
};

export default Toast;

