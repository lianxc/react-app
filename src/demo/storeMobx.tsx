import React from 'react';
import { observer } from 'mobx-react-lite';
import mobxStore from '@/store/mobx';

// 用 observer 包裹组件，让它响应状态变化
const StoreMobx: React.FC = observer(() => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>{mobxStore.name}</h2>
      <p>当前值: {mobxStore.count}</p>
      <p>双倍值: {mobxStore.doubleCount}</p>
      <p>状态: {mobxStore.status}</p>
      
      <button onClick={() => mobxStore.increment()}>+1</button>
      <button onClick={() => mobxStore.decrement()}>-1</button>
      <button onClick={() => mobxStore.reset()}>重置</button>
    </div>
  );
});

export default StoreMobx;