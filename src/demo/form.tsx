import { useForm } from "react-hook-form";

// 原生表单组件
function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email", { required: "邮箱必填" })} />
      {errors.email && <p>{errors.email.message}</p>}
      
      <input type="password" {...register("password", { minLength: 6 })} />
      {errors.password && <p>密码至少6位</p>}
      
      <button type="submit">登录</button>
    </form>
  );
}

export default LoginForm;