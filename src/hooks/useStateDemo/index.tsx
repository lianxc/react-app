import { useState } from "react";

interface UseStateDemoProps {
  demoName: string;
}

const UseStateDemo: React.FC<UseStateDemoProps> = ({ demoName }) => {
  const [count, setCount] = useState<number>(1);
  // define 注入的常量需直接使用全局变量；只有 VITE_ 开头的才在 import.meta.env 上
  console.log(__DEVELOPER__)
  console.log(__ACT_NAME__)
  console.log(__UI_BASELINE_VAL__)
  console.log(__STATIC_PREFIX__)
  console.log(process.env)
  console.log(import.meta.env.MODE)
  console.log(import.meta.env.VITE_STATIC_PREFIX)

  return (
    <div>
      <h3>{demoName}</h3>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
      <button onClick={() => {
        setCount(count * 2);
        setCount(count * 3);
      }}>*2</button>
    </div>
  );
}

export default UseStateDemo;