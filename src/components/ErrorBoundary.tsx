import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

// 函数式组件实现错误边界
export function ErrorBoundaryComponent({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => console.log(error, info)}
    >
      { children }
    </ErrorBoundary>
  );
}

// 类组件方式实现错误边界
export class ErrorBoundaryClass extends React.Component<any, { hasError: boolean }> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    // 更新 state，下次渲染将显示降级 UI
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // 你可以在这里将错误信息上报给 Sentry 或其他服务！
    console.error('Error caught by boundary:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      // 自定义降级 UI
      return <h2>页面部分内容出错了，请稍后重试。</h2>;
    }

    return this.props.children;
  }
}

// 错误类型	是否被 ErrorBoundary 捕获	处理方案
// 渲染错误	✅	ErrorBoundary
// 生命周期错误	✅	ErrorBoundary
// 构造函数错误	✅	ErrorBoundary
// 事件处理错误	❌	try-catch
// 异步错误	❌	catch + 转换
// setTimeout/setInterval	❌	try-catch
// Promise 错误	❌	catch + 转换
// 错误边界自身错误	❌	嵌套 ErrorBoundary
// SSR 错误	❌	服务端错误处理