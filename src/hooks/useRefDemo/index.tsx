import { useState, useEffect, useRef, useLayoutEffect } from "react";

interface UseEffectDemoProps {
  demoName: string;
}

const UseEffectDemo: React.FC<UseEffectDemoProps> = ({ demoName }) => {
  const [count, setCount] = useState<number>(0);
  const countRef = useRef<HTMLParagraphElement>(null);
  const timeout = useRef<number | null>(null);

  useEffect(() => {
    console.log('模拟mounted操作');
  }, []);

  useEffect(() => {
    timeout.current = setTimeout(() => {
      setCount(count => count + 1);
    }, 1000);

    return () => {
      console.log('模拟unmounted操作');
      clearInterval(timeout.current as number);
      timeout.current = null;
    };
  }, []);

  useEffect(() => {
    console.log('模拟updated操作');
  });

  useEffect(() => {
    console.log('检测count变化', count);
  }, [count]);

  useLayoutEffect(() => {
    console.log('模拟layout操作');
    countRef.current!.style.color = 'red';
  }, [count]);

  return (
    <div>
      <h3>{demoName}</h3>
      <p><span ref={countRef}>Count</span>: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

export default UseEffectDemo;