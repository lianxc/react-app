import React, { useState, useCallback, useRef, useEffect } from 'react';
import './baseInput.css';

export interface BaseInputProps {
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  type?: 'text' | 'number' | 'password' | 'email' | 'tel';
  min?: number;
  max?: number;
  maxLength?: number;
  disabled?: boolean;
  required?: boolean;
  pattern?: string;
  validator?: (value: string) => boolean | string;
  onChange?: (value: string, isValid: boolean, error?: string) => void;
  onBlur?: (value: string) => void;
  onFocus?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const BaseInput: React.FC<BaseInputProps> = ({
  value: controlledValue,
  defaultValue,
  placeholder = '',
  type = 'text',
  min,
  max,
  maxLength,
  disabled = false,
  required = false,
  pattern,
  validator,
  onChange,
  onBlur,
  onFocus,
  className = '',
  style,
}) => {
  const [value, setValue] = useState<string>(() => {
    if (controlledValue !== undefined) {
      return String(controlledValue);
    }
    return defaultValue !== undefined ? String(defaultValue) : '';
  });
  const [error, setError] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? String(controlledValue) : value;

  const validate = useCallback((val: string): { isValid: boolean; error?: string } => {
    // 必填验证
    if (required && !val.trim()) {
      return { isValid: false, error: '此字段为必填项' };
    }

    // 数字类型的最小最大值验证
    if (type === 'number' && val) {
      const numValue = Number(val);
      if (!isNaN(numValue)) {
        if (min !== undefined && numValue < min) {
          return { isValid: false, error: `数值不能小于 ${min}` };
        }
        if (max !== undefined && numValue > max) {
          return { isValid: false, error: `数值不能大于 ${max}` };
        }
      }
    }

    // 正则验证
    if (pattern && val && !new RegExp(pattern).test(val)) {
      return { isValid: false, error: '格式不正确' };
    }

    // 自定义验证器
    if (validator) {
      const result = validator(val);
      if (typeof result === 'string') {
        return { isValid: false, error: result };
      }
      if (result === false) {
        return { isValid: false, error: '验证失败' };
      }
    }

    return { isValid: true };
  }, [required, type, min, max, pattern, validator]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // 处理最大长度
    if (maxLength && newValue.length > maxLength) {
      newValue = newValue.slice(0, maxLength);
    }

    // 数字类型处理
    if (type === 'number' && newValue) {
      // 允许负号、小数点
      if (!/^-?\d*\.?\d*$/.test(newValue)) {
        return;
      }
    }

    if (!isControlled) {
      setValue(newValue);
    }

    const validation = validate(newValue);
    setIsValid(validation.isValid);
    setError(validation.error || '');

    onChange?.(newValue, validation.isValid, validation.error);
  }, [isControlled, maxLength, type, validate, onChange]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const validation = validate(val);
    setIsValid(validation.isValid);
    setError(validation.error || '');
    onBlur?.(val);
  }, [validate, onBlur]);

  const handleFocus = useCallback(() => {
    setError('');
    onFocus?.();
  }, [onFocus]);

  // 同步受控值
  useEffect(() => {
    if (isControlled && String(controlledValue) !== currentValue) {
      const validation = validate(String(controlledValue));
      setIsValid(validation.isValid);
      setError(validation.error || '');
    }
  }, [controlledValue, isControlled, currentValue, validate]);

  return (
    <div className={`base-input-wrapper ${className}`} style={style}>
      <input
        ref={inputRef}
        type={type}
        value={currentValue}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        min={min}
        max={max}
        pattern={pattern}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className={`base-input ${!isValid ? 'base-input-error' : ''}`}
      />
      {error && <div className="base-input-error-text">{error}</div>}
    </div>
  );
};

export default BaseInput;

