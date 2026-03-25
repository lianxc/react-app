import React, { useState } from 'react';
import BaseButton from 'COMPONENTS/baseButton';
import BaseImg from 'COMPONENTS/BaseImg';
import BaseForm from 'COMPONENTS/BaseForm';
import BaseModal from 'COMPONENTS/BaseModal';
import BaseTabs from 'COMPONENTS/BaseTabs';
import banner from '@assets/img/anchor/banner.png'
import './CommonComponent.css'

const ValidationFormPage: React.FC = function () {
  const handleSubmit = (values: Record<string, any>) => {
    console.log('表单提交:', values)
  }

  const handleValuesChange = (values: Record<string, any>) => {
    console.log('值变化:', values)
  }

  // 自定义验证器
  const validatePhone = (value: string) => {
    if (!value) return true
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(value)) {
      return '请输入有效的手机号'
    }
    return true
  }

  const validateEmail = (value: string) => {
    if (!value) return true
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return '请输入有效的邮箱地址'
    }
    return true
  }

  const validatePasswordMatch = (confirmPwd: string) => {
    // 注意：这里需要访问表单的其他值，需要额外处理
    // 这里简化处理
    if (confirmPwd && confirmPwd.length < 6) {
      return '密码长度至少6位'
    }
    return true
  }

  return (
    <div className="p-8">
      <BaseForm
        initialValues={{
          phone: '',
          email: '',
          password: '',
          confirmPassword: ''
        }}
        onSubmit={handleSubmit}
        onValuesChange={handleValuesChange}
        className="max-w-md"
      >
        <BaseForm.Item
          label="手机号"
          name="phone"
          rules={[
            { required: true, message: '请输入手机号' },
            { validator: validatePhone }
          ]}
        >
          <input type="tel" className="form-input" placeholder="请输入手机号" />
        </BaseForm.Item>

        <BaseForm.Item
          label="邮箱"
          name="email"
          rules={[
            { required: true, message: '请输入邮箱' },
            { validator: validateEmail }
          ]}
        >
          <input type="email" className="form-input" placeholder="请输入邮箱" />
        </BaseForm.Item>

        <BaseForm.Item
          label="密码"
          name="password"
          rules={[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码至少6位' },
            { 
              pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
              message: '密码必须包含字母和数字' 
            }
          ]}
        >
          <input type="password" className="form-input" placeholder="请输入密码" />
        </BaseForm.Item>

        <BaseForm.Item
          label="确认密码"
          name="confirmPassword"
          rules={[
            { required: true, message: '请再次输入密码' },
            { validator: validatePasswordMatch }
          ]}
        >
          <input type="password" className="form-input" placeholder="请再次输入密码" />
        </BaseForm.Item>

        <button type="submit" className="submit-btn">
          注册
        </button>
      </BaseForm>
    </div>
  )
}

const CommonComponent: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('1');
  const tabs = [{ key: '1', label: 'Tab 1', children: <div>Tab 1</div> }, { key: '2', label: 'Tab 2', children: <div>Tab 2</div> }]

  return (
    <div>
      <BaseButton onClick={() => setVisible(true)}>Click</BaseButton>
      <BaseImg className="banner" src={banner}></BaseImg>
      <ValidationFormPage></ValidationFormPage>
      <BaseModal className="base-modal-test" visible={visible} onClose={() => setVisible(false)}>
        弹窗内容
      </BaseModal>
      <BaseTabs items={tabs}></BaseTabs>
    </div>
  );
};

export default CommonComponent;