import React, { useState, useCallback, useEffect } from 'react';
import './baseImg.css';

export interface BaseImgProps {
  src: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
  lazy?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: string;
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

const BaseImg: React.FC<BaseImgProps> = ({
  src,
  alt = '',
  width,
  height,
  className = '',
  style,
  lazy = false,
  onLoad,
  onError,
  placeholder,
  fit = 'cover',
}) => {
  // 将 http 转换为 https
  const convertToHttps = useCallback((url: string): string => {
    if (!url) return '';
    if (url.startsWith('http://')) {
      return url.replace('http://', 'https://');
    }
    return url;
  }, []);

  const [imgSrc, setImgSrc] = useState<string>(() => {
    if (!src) return placeholder || '';
    return convertToHttps(src);
  });
  const [loading, setLoading] = useState<boolean>(!placeholder);
  const [error, setError] = useState<boolean>(false);

  const handleLoad = useCallback(() => {
    setLoading(false);
    setError(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setLoading(false);
    setError(true);
    if (placeholder) {
      setImgSrc(placeholder);
    }
    onError?.();
  }, [placeholder, onError]);

  // 当 src 变化时更新
  useEffect(() => {
    if (src) {
      const httpsSrc = convertToHttps(src);
      setImgSrc(httpsSrc);
      setLoading(true);
      setError(false);
    } else if (placeholder) {
      setImgSrc(placeholder);
    }
  }, [src, placeholder, convertToHttps]);

  const imgStyle: React.CSSProperties = {
    width: width || '100%',
    height: height || 'auto',
    objectFit: fit,
    ...style,
  };

  return (
    <div
      className={`base-img-wrapper ${className}`}
      style={{ width, height }}
    >
      {loading && !error && (
        <div className="base-img-loading">加载中...</div>
      )}
      {error && !imgSrc && (
        <div className="base-img-error">加载失败</div>
      )}
      {imgSrc && (
        <img
          src={imgSrc}
          alt={alt}
          className={`base-img ${loading ? 'base-img-loading-state' : ''}`}
          style={imgStyle}
          loading={lazy ? 'lazy' : 'eager'}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
};

export default BaseImg;

