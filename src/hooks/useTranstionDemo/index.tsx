import { useState, useTransition } from "react";

interface UseTransitionDemoProps {
  demoName: string;
}

const UseTransitionDemo: React.FC<UseTransitionDemoProps> = ({ demoName }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<[string, string][]>([]);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const fetchResults = async (query: string) => {
    // 模拟网络延迟，让你能看到加载状态
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await fetch(`https://static-web.helloyo.sg/as/common-static/pear/prod/10000001883.json?q=${query}`);
    const data = await response.json();
    return data;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // 高优先级任务：立即更新输入框
    setQuery(value);
    
    // 如果查询为空，清空结果
    if (!value.trim()) {
      setResults([]);
      return;
    }
    
    // 设置加载状态
    setIsLoading(true);
    
    // 使用 startTransition 处理低优先级更新
    startTransition(() => {
      fetchResults(value).then((data) => {
        const searchData = Object.entries(data?.cn || {}).filter(([key]) => {
          return key.toLowerCase().includes(value.toLowerCase());
        });
        setResults(searchData as [string, string][]);
      }).finally(() => {
        // 请求完成后清除加载状态
        setIsLoading(false);
      });
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h3>{demoName}</h3>
      
      {/* 搜索输入框 */}
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          value={query} 
          onChange={handleChange}
          placeholder="输入搜索关键词..."
          style={{
            padding: '10px',
            fontSize: '16px',
            width: '300px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
      </div>
      
      {/* 加载状态显示区域 */}
      <div style={{ marginBottom: '20px', minHeight: '30px' }}>
        {isPending && (
          <div style={{
            padding: '10px',
            background: '#e3f2fd',
            borderRadius: '4px',
            color: '#1976d2'
          }}>
            ⚡ React 过渡更新中 (isPending = true)...
          </div>
        )}
        
        {isLoading && (
          <div style={{
            padding: '10px',
            background: '#fff3e0',
            borderRadius: '4px',
            color: '#f57c00',
            marginTop: isPending ? '10px' : '0'
          }}>
            🔄 正在搜索数据 (isLoading = true)...
          </div>
        )}
        
        {!isPending && !isLoading && results.length === 0 && query && (
          <div style={{
            padding: '10px',
            background: '#ffebee',
            borderRadius: '4px',
            color: '#d32f2f'
          }}>
            ❌ 未找到相关结果
          </div>
        )}
      </div>
      
      {/* 结果列表 */}
      <div>
        {results.length > 0 && (
          <div>
            <h4>搜索结果 ({results.length} 条):</h4>
            <div style={{
              opacity: isPending ? 0.6 : 1,
              transition: 'opacity 0.3s ease'
            }}>
              {results.slice(0, 10).map((result) => (
                <div 
                  key={result[0]}
                  style={{
                    padding: '10px',
                    margin: '5px 0',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    background: '#fafafa'
                  }}
                >
                  <div style={{ fontWeight: 'bold', color: '#333' }}>
                    {result[0]}
                  </div>
                  <div style={{ color: '#666', marginTop: '5px' }}>
                    {result[1]}
                  </div>
                </div>
              ))}
            </div>
            
            {results.length > 10 && (
              <div style={{ marginTop: '10px', color: '#666' }}>
                还有 {results.length - 10} 条结果未显示...
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* 调试信息 */}
      <div style={{
        marginTop: '30px',
        padding: '15px',
        background: '#f5f5f5',
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <h5>调试信息:</h5>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>🔍 搜索词: "{query}"</li>
          <li>⚡ isPending: {isPending.toString()}</li>
          <li>🔄 isLoading: {isLoading.toString()}</li>
          <li>📊 结果数量: {results.length}</li>
        </ul>
      </div>
    </div>
  );
}

export default UseTransitionDemo;