import { useState, useImperativeHandle, useRef, forwardRef } from "react";

interface UseImperativeHandleDemoProps {
  demoName: string;
}

interface ChildHandle {
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

// 1. 使用forwardRef来创建子组件
const Child = forwardRef<ChildHandle, UseImperativeHandleDemoProps>((props, ref) => {
  const [count, setCount] = useState<number>(0);

  // 2. 使用useImperativeHandle来暴露组件内部的状态和方法给父组件
  useImperativeHandle(ref, () => ({
    increment: () => setCount(count + 1),
    decrement: () => setCount(count - 1),
    reset: () => setCount(0)
  }));

  return (
    <div>
      <p>Child Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
});

const UseImperativeHandleDemo: React.FC<UseImperativeHandleDemoProps> = ({ demoName }) => {
  // 3. 使用useRef来创建子组件的引用
  const childRef = useRef<ChildHandle>(null);

  return (
    <>
      <h3>{demoName}</h3>
      <button onClick={() => childRef.current?.increment()}>Parent Increment</button>
      <button onClick={() => childRef.current?.decrement()}>Parent Decrement</button>
      <button onClick={() => childRef.current?.reset()}>Parent Reset</button>
      {/* 4. 把子组件的引用传递给子组件，子组件在这个引用上暴露方法 */}
      <Child ref={childRef} />
    </>
  );
}

export default UseImperativeHandleDemo;