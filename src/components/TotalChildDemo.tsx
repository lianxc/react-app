import { useState, useEffect, useMemo, useCallback, useRef, memo, Fragment, lazy } from 'react';

interface CommunicationChildProps {
  count: number;
  handleSetCount: (count: number) => void;
}

// 延迟加载子组件
const LazyChild: React.FC = () => {
  return (
    <>
      <h3>LazyChild</h3>
    </>
  );
}

// memoized子组件，只有props变化时才重新渲染
const MemoizedChild: React.FC = memo(() => {
  return (
    <>
      <h3>MemoizedChild</h3>
    </>
  );
});

// 通信子组件，与父组件通过各种方式通信
const CommunicationChild: React.FC<CommunicationChildProps> = memo(({ count, handleSetCount }) => {
  const [childCount, setChildCount] = useState(0);

  return (
    <>
      <h3>CommunicationChild</h3>
      {/* 父组件向子组件通信，通过传递props实现 */}
      <p>parent count: {count}</p>
      {/* 子组件向父组件通信，通过调用父组件传递的函数实现 */}
      <button onClick={() => handleSetCount(count + 1)}>Increment parent count</button>
      <p>child count: {childCount}</p>
      <button onClick={() => setChildCount(childCount + 1)}>Increment child count</button>
    </>
  );
});

export {
  LazyChild,
  MemoizedChild,
  CommunicationChild
};