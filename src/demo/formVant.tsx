import * as React from "react";
import { Form, Input, Button } from "react-vant";

/**
 * 登录表单（react-vant 样式）
 * 邮箱必填，密码至少 6 位，提交时在控制台输出表单数据
 */
function LoginForm() {
  const onSubmit = (data: { email: string; password: string }) => {
    console.log(data);
  };

  return (
    <Form
      onFinish={onSubmit}
      footer={
        <Button block type="primary" nativeType="submit">
          登录
        </Button>
      }
    >
      <Form.Item
        name="email"
        label="邮箱"
        rules={[{ required: true, message: "邮箱必填" }]}
      >
        {/* value/onChange 由 Form.Item 注入 */}
        <Input placeholder="请输入邮箱" {...({} as React.ComponentProps<typeof Input>)} />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[{ required: true, message: "请输入密码" }, { min: 6, message: "密码至少6位" }]}
      >
        <Input type="password" placeholder="请输入密码" {...({} as React.ComponentProps<typeof Input>)} />
      </Form.Item>
    </Form>
  );
}

export default LoginForm;
