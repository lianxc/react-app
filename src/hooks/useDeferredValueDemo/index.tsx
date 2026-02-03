import { useState, useDeferredValue, memo } from "react";

interface UseDeferredValueDemoProps {
  demoName: string;
}
interface TextComponentProps {
  count: number;
}
// 使用 memo 包裹组件
const TextComponent = memo(({ count }: TextComponentProps) => {
  const list = Array.from({ length: count }, (_, index) => {
    return <div className="text-item" key={index}>{index}</div>;
  });

  return <div className="text-list">{list.map(item => item)}</div>;
});

const UseDeferredValueDemo: React.FC<UseDeferredValueDemoProps> = ({ demoName }) => {
  const [count, setCount] = useState<number>(1);
  const deferredCount = useDeferredValue(count); // useDeferredValue是异步的，deferredCount可能不等于count
  const isStale = deferredCount !== count;

  return (
    <div>
      <h3>{demoName}</h3>
      {/* 快速连续点击测试 */}
      <div style={{ marginTop: '20px' }}>
        <h4>快速输入测试：</h4>
        <input 
          value={count} 
          onChange={e => setCount(+e.target.value)} 
          placeholder="快速输入文字..."
        />
      </div>
      {isStale && <p>列表更新中...</p>}
      {/* 渲染量大的组件，接收到的count是标记延迟的，那么react会降低渲染优先级 */}
      <TextComponent count={deferredCount} />
    </div>
  );
}

export default UseDeferredValueDemo;

// 假设快速输入：10 → 100 → 1000
// 时间轴：
//   │
//   ├─ t0: 输入"10"（高优先级）
//   │   - React 开始渲染
//   │   - deferredCount 还是 1（旧值）
//   │   - 渲染完成：显示 count=10, deferred=1
//   │
//   ├─ t1: React 安排 deferredCount=10 的更新（低优先级）
//   │   - 但用户立即输入了"100"（高优先级）
//   │   - React 中断 deferredCount=10 的更新
//   │   - 处理 count=100 的更新
//   │
//   ├─ t2: 渲染 count=100
//   │   - deferredCount 可能还是 1 或刚变成 10
//   │   - 显示 count=100, deferred=1（或10）
//   │
//   ├─ t3: 用户又输入了"1000"
//   │   - React 再次中断
//   │   - 优先处理用户输入
//   │
//   └─ t4: 浏览器空闲时
//       - React 处理积压的低优先级更新
//       - 可能直接设置 deferredCount=1000
//       - 跳过中间的 10 和 100