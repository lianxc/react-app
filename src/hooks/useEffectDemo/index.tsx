import { useState, useEffect, useRef } from "react";

interface UseEffectDemoProps {
  demoName: string;
}

const UseEffectDemo: React.FC<UseEffectDemoProps> = ({ demoName }) => {
  const [count, setCount] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const countRef = useRef<number>(0);
  const timeout = useRef<number | null>(null);
  const lastCountRef = useRef<number>(0);
  const lastCount = lastCountRef.current;

  // 1. 使用ref来存储值，更改不会触发组件重新渲染
  const handleClick = () => {
    countRef.current++;
    console.log('countRef', countRef.current);
  };

   // 2. 直接操作DOM
  const focusInput = () => {
    inputRef.current?.focus();
  };

  // 3. 存储上一次的值，持久化数据，不会随着组件重新渲染而丢失
  useEffect(() => {
    lastCountRef.current = count;
  }, [count]);

  // 4. 存储定时器引用等
  useEffect(() => {
    timeout.current = setTimeout(() => {
      setCount(count => count + 1);
    }, 1000);

    return () => {
      clearTimeout(timeout.current as number);
      timeout.current = null;
    };
  }, []);

  return (
    <div>
      <h3>{demoName}</h3>
      <input ref={inputRef} type="text" />
      <p>当前Count值: {count}，上一次的Count值: {lastCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={handleClick}>IncrementRef</button>
      <button onClick={focusInput}>FocusInput</button>
    </div>
  );
}

export default UseEffectDemo;