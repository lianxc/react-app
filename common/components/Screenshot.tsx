import React, { useRef, ReactNode } from 'react';
import './Screenshot.css';

// 注意：这个组件需要安装 html2canvas: npm install html2canvas
// 由于是类型定义，我们使用动态导入

export interface ScreenshotProps {
  children: ReactNode;
  selector?: string;
  width?: number;
  height?: number;
  onCapture?: (dataUrl: string) => void;
  onError?: (error: Error) => void;
  className?: string;
  style?: React.CSSProperties;
  quality?: number;
  format?: 'png' | 'jpeg';
}

const Screenshot: React.FC<ScreenshotProps> = ({
  children,
  selector,
  width,
  height,
  onCapture,
  onError,
  className = '',
  style,
  quality = 1,
  format = 'png',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const capture = async () => {
    try {
      // 动态导入 html2canvas
      const html2canvas = (await import('html2canvas')).default;

      const targetElement = selector
        ? document.querySelector(selector)
        : containerRef.current;

      if (!targetElement) {
        throw new Error('未找到目标元素');
      }

      const canvas = await html2canvas(targetElement as HTMLElement, {
        width: width,
        height: height,
        scale: quality,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#fff',
      });

      const dataUrl = canvas.toDataURL(`image/${format}`, quality);
      onCapture?.(dataUrl);
      return dataUrl;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('截图失败');
      onError?.(err);
      throw err;
    }
  };

  // 暴露 capture 方法
  React.useImperativeHandle(containerRef, () => ({
    capture,
  }));

  return (
    <div ref={containerRef} className={`screenshot-container ${className}`} style={style}>
      {children}
    </div>
  );
};

// 静态方法：直接截图指定元素
export const captureScreenshot = async (
  selector: string | HTMLElement,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'png' | 'jpeg';
  }
): Promise<string> => {
  try {
    const html2canvas = (await import('html2canvas')).default;

    const targetElement =
      typeof selector === 'string' ? document.querySelector(selector) : selector;

    if (!targetElement) {
      throw new Error('未找到目标元素');
    }

    const canvas = await html2canvas(targetElement as HTMLElement, {
      width: options?.width,
      height: options?.height,
      scale: options?.quality || 1,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#fff',
    });

    return canvas.toDataURL(`image/${options?.format || 'png'}`, options?.quality || 1);
  } catch (error) {
    throw error instanceof Error ? error : new Error('截图失败');
  }
};

export default Screenshot;

