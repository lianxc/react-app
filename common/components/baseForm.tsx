import React, { useState, useCallback, ReactNode, FormEvent } from 'react';
import './baseForm.css';

export interface FormRule {
  required?: boolean;
  message?: string;
  pattern?: RegExp;
  validator?: (value: any) => boolean | string;
  min?: number;
  max?: number;
}

export interface FormItemProps {
  label?: string;
  name: string;
  rules?: FormRule[];
  children: ReactNode;
  className?: string;
}

export interface BaseFormProps {
  children: ReactNode;
  onSubmit?: (values: Record<string, any>) => void;
  onValuesChange?: (values: Record<string, any>) => void;
  initialValues?: Record<string, any>;
  className?: string;
  style?: React.CSSProperties;
}

interface FormErrors {
  [key: string]: string;
}

const BaseFormItem: React.FC<FormItemProps> = ({
  label,
  name,
  error,
  rules = [],
  children,
  className = '',
}) => {
  return (
    <div className={`base-form-item ${className}`}>
      {label && <label className="base-form-label">{label}</label>}
      <div className="base-form-control">
        {React.cloneElement(children as React.ReactElement, { name, error })}
      </div>
    </div>
  );
};

const BaseForm: React.FC<BaseFormProps> = ({
  children,
  onSubmit,
  onValuesChange,
  initialValues = {},
  className = '',
  style,
}) => {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = useCallback((name: string, value: any, rules: FormRule[] = []): string => {
    for (const rule of rules) {
      console.log(rule, value)
      if (rule.required && (value === undefined || value === null || value === '')) {
        return rule.message || `${name} 是必填项`;
      }

      if (rule.pattern && !rule.pattern.test(String(value))) {
        return rule.message || `${name} 格式不正确`;
      }

      if (rule.validator) {
        const result = rule.validator(value);
        if (typeof result === 'string') {
          return result;
        }
        if (result === false) {
          return rule.message || `${name} 验证失败`;
        }
      }

      if (typeof value === 'number') {
        if (rule.min !== undefined && value < rule.min) {
          return rule.message || `${name} 不能小于 ${rule.min}`;
        }
        if (rule.max !== undefined && value > rule.max) {
          return rule.message || `${name} 不能大于 ${rule.max}`;
        }
      }
    }
    return '';
  }, []);

  const validateAll = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === BaseFormItem) {
        const { name, rules = [] } = child.props;
        console.log(values[name] === '');
        const value = values[name];
        const error = validateField(name, value, rules);
        console.log(error);
        if (error) {
          newErrors[name] = error;
          isValid = false;
        }
      }
    });
    console.log(isValid);

    setErrors(newErrors);
    return isValid;
  }, [children, values, validateField]);

  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    console.log('submit', values);
    e.preventDefault();
    if (validateAll()) {
      onSubmit?.(values);
    }
  }, [values, validateAll, onSubmit]);

  const handleChange = useCallback((name: string, event: any) => {
    // console.log('handleChange', name, value.target.value);
    const value = event.target.value;
    const newValues = { ...values, [name]: value };
    setValues(newValues);
    onValuesChange?.(newValues);

    // 清除该字段的错误
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  }, [values, errors, onValuesChange]);

  // 为子组件注入 onChange 和 value
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === BaseFormItem) {
        const { name, rules = [] } = child.props;
        return React.cloneElement(child, {
          children: React.cloneElement(
            child.props.children as React.ReactElement,
            {
              value: values[name],
              onChange: (val: any) => handleChange(name, val),
              error: errors[name],
            }
          ),
        });
      }
    }
    return child;
  });

  return (
    <form
      className={`base-form ${className}`}
      style={style}
      onSubmit={handleSubmit}
    >
      {childrenWithProps}
    </form>
  );
};

BaseForm.Item = BaseFormItem;

export default BaseForm;

