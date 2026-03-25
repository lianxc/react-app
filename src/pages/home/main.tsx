import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AliveScope } from 'react-activation';
import App from './App'
import './index.scss'

// 创建 QueryClient 实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // 5分钟内数据被认为是新鲜的，不会重新请求
      gcTime: 0,    // 10分钟内缓存有效（v5 版本用 gcTime 替代 cacheTime）
      retry: 3,                  // 失败重试1次
      retryDelay: 1000,          // 失败重试延迟1秒
      refetchOnWindowFocus: false, // 窗口重新聚焦时重新获取
    },
  },
});

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <AliveScope>
          <App />
        </AliveScope>
      </HashRouter>
      {/* 添加开发工具（生产环境会自动移除） */}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  // </StrictMode>,
)