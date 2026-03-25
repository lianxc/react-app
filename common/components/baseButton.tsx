import React, { ReactNode } from 'react';
import './baseButton.css';

export interface BaseButtonProps {
  children: ReactNode;
  type?: 'primary' | 'default' | 'danger' | 'warning' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  style?: React.CSSProperties;
  htmlType?: 'button' | 'submit' | 'reset';
}

export interface BaseButtonGroupProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const BaseButton: React.FC<BaseButtonProps> = ({
  children,
  type = 'default',
  size = 'medium',
  disabled = false,
  loading = false,
  block = false,
  onClick,
  className = '',
  style,
  htmlType = 'button',
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    onClick?.(e);
  };

  return (
    <button
      type={htmlType}
      className={`base-button base-button-${type} base-button-${size} ${
        block ? 'base-button-block' : ''
      } ${disabled ? 'base-button-disabled' : ''} ${loading ? 'base-button-loading' : ''} ${className}`}
      style={style}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {loading && <span className="base-button-loading-icon">⏳</span>}
      {children}
    </button>
  );
};

export const BaseButtonGroup: React.FC<BaseButtonGroupProps> = ({
  children,
  className = '',
  style,
}) => {
  return (
    <div className={`base-button-group ${className}`} style={style}>
      {children}
    </div>
  );
};

export default BaseButton;

