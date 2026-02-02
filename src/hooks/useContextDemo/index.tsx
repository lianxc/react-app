import { useState, useContext, createContext, useMemo } from "react";

// 1. 创建全局上下文，不能在组件内创建，只能在外部创建，否则每次渲染都会重新创建
const GlobalContext = createContext(null);

// 2. 创建全局上下文提供者，抽象出状态管理，使用组件进行管理
function GlobalContextProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);
  const [max, setMax] = useState(100);
  const [roomId, setRoomId] = useState('123');
  
  const value = useMemo(() => ({
    count,
    max,
    roomId,
    setCount,
    setMax,
    setRoomId
  }), [count, max, roomId]);
  
  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
}

// 孙子组件，读取context状态
const Son: React.FC = (() => {
  console.log('Child2 rendered');
  const { count, max, roomId, setCount, setMax, setRoomId } = useContext(GlobalContext);
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment Max</button>
      <p>Son max: {max}</p>
    </div>
  );
});

// 儿子组件，读取context状态
const Child: React.FC = (() => {
  const { count, max, roomId, setCount, setMax, setRoomId } = useContext(GlobalContext);
  console.log('Child1 rendered');
  return (
    <div>
      <p>Child Count: {count}</p>
      <button onClick={() => setMax(max + 1)}>Increment Max</button>
      <Son />
    </div>
  );
});

// 父组件
const UseContextDemo: React.FC<UseContextDemoProps> = ({ demoName }) => {
  const { count, max, roomId, setCount, setMax, setRoomId } = useContext(GlobalContext);

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
      <Child />
    </div>
  );
}

// 包裹组件，提供全局上下文提供者
const UseContextDemoWrapper: React.FC<{ demoName: string; }> = ({ demoName }) => {
  return (
    <GlobalContextProvider>
      <UseContextDemo demoName={demoName} />
    </GlobalContextProvider>
  );
}

export default UseContextDemoWrapper;