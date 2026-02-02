import { useState, useCallback, memo, useMemo, useEffect } from "react";

interface UseCallbackDemoProps {
  demoName: string;
}

interface ChildProps {
  handleIncrementSum: () => void;
  handleClick: () => void;
}

// 应该使用 useCallback 的场景：
// 1. 函数作为 props 传递给 memo 化的子组件 ✅
// 2. 函数作为其他 Hook 的依赖项 ✅
// 3. 函数在 useEffect 中被调用 ✅
// 4. 函数包含昂贵的计算或副作用 ✅

// 不应该使用 useCallback 的场景：
// 1. 简单的内联事件处理器 ❌
// 2. 函数不会在多次渲染间共享 ❌
// 3. 组件的渲染开销很小 ❌

// 使用memo后，会对props进行浅比较，使用Object.is比较，只对对象第一层比较
// 第一层key是基本类型，则比较值是否相等
// 第一层key是函数，则比较函数的地址，此处的handleIncrementSum是useCallback缓存的，所以每次渲染都是同一个引用
const Child1: React.FC<ChildProps> = memo(({ handleIncrementSum, handleClick }) => {
  console.log('Child1 rendered');
  return (
    <div>
      <button onClick={() => handleIncrementSum()}>Increment Max</button>
      <button onClick={() => handleClick()}>Click</button>
    </div>
  );
});

// 此处即使使用了memo，但由于每次handleIncrementSum都是新的引用，所以还是会重新渲染
const Child2: React.FC<Omit<ChildProps, 'max'>> = memo(({ handleIncrementSum, handleClick }) => {
  console.log('Child2 rendered');
  return (
    <div>
      <button onClick={() => handleIncrementSum()}>Increment Max</button>
      <button onClick={() => handleClick()}>Click</button>
    </div>
  );
});

const UseCallbackDemo: React.FC<UseCallbackDemoProps> = ({ demoName }) => {
  const [count, setCount] = useState<number>(0);
  const [max, setMax] = useState<number>(100);
  const [roomId, setRoomId] = useState<string>('123');

  // 1. 空依赖，useCallback来稳定引用，避免每次渲染都创新创建函数对象
  const handleIncrementSum = useCallback(() => {
    setMax(max => max + 1);
    setRoomId(roomId => roomId + '1');
  }, []);

  // 2. 使用普通函数来计算，当count等无关变量发生变化时导致渲染时，也会重新创建函数对象
  const handleIncrementSum2 = () => {
    setMax(max => max + 1);
  };

  // 3. 依赖max变量，当max发生变化时，才会重新创建函数对象，否则函数捕获的还是旧的max值
  const handleClick = useCallback(() => {
    console.log('max', max);
  }, [max]);

  // 4. 普通函数，每次渲染都会重新创建函数对象
  const handleClick2 = () => {
    console.log('max', max);
  };

  // 5. 与useEffect配合使用，当roomId发生变化时，函数对象会重新创建，引用改变导致effect重新执行，重新连接到新房间
  const createConnection = useCallback(() => {
    return {
      connect() {
        console.log('连接到房间' + roomId);
      },
      disconnect() {
        console.log('断开连接到房间' + roomId);
      }
    };
  }, [roomId]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [createConnection]);

  // 3. 使用useMemo来缓存计算结果，避免每次渲染都重新计算
  const sumValue = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < max; i++) {
      sum += i;
    }
    return sum;
  }, [max]);

  return (
    <div>
      <h3>{demoName}</h3>
      <p>Max: {max}</p>
      <p>current sum: {sumValue}</p>
      <button onClick={() => setMax(max + 1)}>Increment Max</button>
      <button onClick={() => setMax(max - 1)}>Decrement Max</button>
      <button onClick={() => setMax(100)}>Reset Max</button>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
      <Child1 handleIncrementSum={handleIncrementSum} handleClick={handleClick}/>
      <Child2 handleIncrementSum={handleIncrementSum2} handleClick={handleClick2}/>
    </div>
  );
}

export default UseCallbackDemo;