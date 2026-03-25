import React, { useState, useEffect, useRef, useCallback } from 'react';

// 虚拟滚动列表组件
const VirtualList = ({ 
  items = [],           // 所有列表数据
  itemHeight = 50,      // 每个项目固定高度
  containerHeight = 400, // 容器高度
  renderItem,           // 渲染每一项的函数
  bufferSize = 5        // 缓冲区大小（上下各预渲染多少项）
}) => {
  const [visibleData, setVisibleData] = useState([]);
  const [offsetY, setOffsetY] = useState(0);
  const containerRef = useRef(null);

  // 计算可视区域应该显示的项
  const calculateVisibleItems = useCallback((scrollTop) => {
    // 计算起始索引
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferSize);
    
    // 计算结束索引（可视区域能显示的数量 + 缓冲区）
    const visibleCount = Math.ceil(containerHeight / itemHeight) + bufferSize * 2;
    const endIndex = Math.min(items.length, startIndex + visibleCount);

    // 计算偏移量，用于定位
    const offsetY = startIndex * itemHeight;

    // 获取当前应该显示的数据
    const visibleItems = items.slice(startIndex, endIndex).map((item, index) => ({
      data: item,
      index: startIndex + index,
    }));

    return { visibleItems, offsetY };
  }, [items, itemHeight, containerHeight, bufferSize]);

  // 处理滚动事件
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    
    const { scrollTop } = containerRef.current;
    const { visibleItems, offsetY } = calculateVisibleItems(scrollTop);
    
    setVisibleData(visibleItems);
    setOffsetY(offsetY);
  }, [calculateVisibleItems]);

  // 初始化或数据变化时计算
  useEffect(() => {
    handleScroll();
  }, [items, handleScroll]);

  // 监听滚动
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // 总高度（用于撑开滚动条）
  const totalHeight = items.length * itemHeight;

  return (
    <div
      ref={containerRef}
      style={{
        height: containerHeight,
        overflowY: 'auto',
        border: '1px solid #ccc',
        position: 'relative',
      }}
    >
      {/* 这个div用于撑开滚动条 */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* 可视区域的列表 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            transform: `translateY(${offsetY}px)`,
          }}
        >
          {visibleData.map(({ data, index }) => (
            <div
              key={index}
              style={{
                height: itemHeight,
                borderBottom: '1px solid #eee',
                display: 'flex',
                alignItems: 'center',
                padding: '0 10px',
              }}
            >
              {renderItem ? renderItem(data, index) : (
                <span>第 {index + 1} 项: {String(data)}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 使用示例
const App = () => {
  // 生成大量测试数据
  const generateItems = (count) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `用户 ${i + 1}`,
      age: Math.floor(Math.random() * 50) + 18,
      city: ['北京', '上海', '广州', '深圳'][Math.floor(Math.random() * 4)],
    }));
  };

  const [items] = useState(() => generateItems(10000));

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
      <h2>虚拟滚动列表示例</h2>
      <p>总数据量: {items.length} 条</p>
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

export { VirtualList };
export default App;