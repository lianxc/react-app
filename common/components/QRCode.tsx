import React, { useEffect, useRef } from 'react';
import './QRCode.css';

// 注意：这个组件需要安装 qrcode: npm install qrcode
// 由于是类型定义，我们使用动态导入

export interface QRCodeProps {
  text: string;
  size?: number;
  colorDark?: string;
  colorLight?: string;
  correctLevel?: 'L' | 'M' | 'Q' | 'H';
  onGenerated?: (dataUrl: string) => void;
  onError?: (error: Error) => void;
  className?: string;
  style?: React.CSSProperties;
}

const QRCode: React.FC<QRCodeProps> = ({
  text,
  size = 200,
  colorDark = '#000000',
  colorLight = '#ffffff',
  correctLevel = 'M',
  onGenerated,
  onError,
  className = '',
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const generateQRCode = async () => {
      if (!canvasRef.current || !text) return;

      try {
        // 动态导入 qrcode
        const QRCodeLib = await import('qrcode');

        await QRCodeLib.toCanvas(canvasRef.current, text, {
          width: size,
          color: {
            dark: colorDark,
            light: colorLight,
          },
          errorCorrectionLevel: correctLevel,
        });

        // 转换为 data URL
        const dataUrl = canvasRef.current.toDataURL('image/png');
        onGenerated?.(dataUrl);

        // 如果使用 img 标签显示
        if (imgRef.current) {
          imgRef.current.src = dataUrl;
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error('生成二维码失败');
        onError?.(err);
      }
    };

    generateQRCode();
  }, [text, size, colorDark, colorLight, correctLevel, onGenerated, onError]);

  return (
    <div className={`qrcode-container ${className}`} style={style}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{ display: 'none' }}
      />
      <img
        ref={imgRef}
        alt="QR Code"
        className="qrcode-image"
        style={{ width: size, height: size }}
      />
    </div>
  );
};

// 静态方法：直接生成二维码
export const generateQRCode = async (
  text: string,
  options?: {
    size?: number;
    colorDark?: string;
    colorLight?: string;
    correctLevel?: 'L' | 'M' | 'Q' | 'H';
  }
): Promise<string> => {
  try {
    const QRCode = await import('qrcode');
    const canvas = document.createElement('canvas');
    const size = options?.size || 200;

    await QRCode.toCanvas(canvas, text, {
      width: size,
      color: {
        dark: options?.colorDark || '#000000',
        light: options?.colorLight || '#ffffff',
      },
      errorCorrectionLevel: options?.correctLevel || 'M',
    });

    return canvas.toDataURL('image/png');
  } catch (error) {
    throw error instanceof Error ? error : new Error('生成二维码失败');
  }
};

export default QRCode;

