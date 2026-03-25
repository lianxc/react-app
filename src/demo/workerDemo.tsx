import React, { useState } from 'react';
import { VirtualList } from './virtualScrolling'
import MyWorker from './worker.ts?worker' // ✅ Vite 专用语法

// 生成大量测试数据
const generateItems = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `用户 ${i + 1}`,
    age: Math.floor(Math.random() * 50) + 18,
    city: ['北京', '上海', '广州', '深圳'][Math.floor(Math.random() * 4)],
    first: `John ${i + 1}`,
    last: `Doe ${i + 1}`,
    score: Math.floor(Math.random() * 100) + 1,
    active: Math.random() > 0.5,
  }));
};

const WebWorkerDemo: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);

  // 创建worker
  const worker = new MyWorker();

  // 接收到worker处理后的数据
  worker.onmessage = (event) => {
    console.log('worker处理后的数据', event.data);
    setItems(event.data.processedData);
  };

  // 自定义渲染项
  const renderItem = (item, index) => (
    <div style={{ display: 'flex', gap: '20px' }}>
      <span style={{ width: 60 }}>ID: {item.id}</span>
      <span style={{ width: 100 }}>{item.name}</span>
      <span style={{ width: 60 }}>年龄: {item.age}</span>
      <span style={{ width: 80 }}>城市: {item.city}</span>
    </div>
  );

  return (
    <div style={{ padding: '20px' }}>
      <div>WebWorkerDemo</div>
      <p>总数据量: {items.length} 条</p>
      <button onClick={() => worker.postMessage(generateItems(200000))}>生成测试数据</button>
      <button onClick={() => worker.terminate()}>终止worker</button>
      <VirtualList
        items={items}
        itemHeight={60}
        containerHeight={500}
        renderItem={renderItem}
        bufferSize={5}
      />
    </div>
  );
};

export default WebWorkerDemo;