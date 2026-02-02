import { Suspense, lazy, Fragment, memo } from 'react';

interface SuspenseDemoProps {
  demoName: string;
}

// 加载中组件
const LoadingComponent = () => {
  return <div>Loading...</div>;
};

// 懒加载useContextDemo组件
const LazyUseContextDemo = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(import('../hooks/useContextDemo/index.tsx'));
    }, 5000);
  });
});

// 主组件
const SuspenseDemo: React.FC<SuspenseDemoProps> = memo(({ demoName }) => {
  return (
    <Fragment>
      <h3>{demoName}</h3>

      {/* 子组件完成加载前展示LoadingComponent组件 */}
      <Suspense fallback={<LoadingComponent />}>
        <LazyUseContextDemo demoName="UseContextDemo"></LazyUseContextDemo>
      </Suspense>
    </Fragment>
  );
});

export default SuspenseDemo;