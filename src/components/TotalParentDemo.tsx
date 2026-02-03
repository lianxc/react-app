import { useState, useEffect, useMemo, useCallback, useRef, memo, Fragment, lazy, Suspense } from 'react';
import TotalDemo from './TotalDemo';
import { LazyChild as LazyChildComponent, MemoizedChild } from './TotalChildDemo';

interface TotalParentDemoProps {
  demoName: string;
}

// 特性	        外部变量	        useRef	        组件内变量
// 初始化时机	  模块加载时	       组件挂载时	      每次渲染
// 生命周期	    永久存在	         组件生命周期	    单次渲染
// 共享性	      所有组件实例共享	 组件实例私有	     单次渲染有效
// 引用稳定性	  ✅ 稳定	         ✅ 稳定	        ❌ 不稳定
// 可测试性	    ❌ 差	           ✅ 好	          ✅ 好
// SSR兼容	    ⚠️ 需注意	        ✅ 好	         ✅ 好
// 推荐程度	    谨慎使用	         ✅ 推荐使用	     默认使用
const [numberKey, booleanKey] = [0, true];
const [arrayKey, objectKey] = [[1, 2, 3], { name: 'John', age: 20 }];
const [functionKey, dateKey] = [() => { console.log('functionKey'); }, new Date()];

// 延迟加载子组件
const LazyChild = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(LazyChildComponent);
    }, 5000);
  });
});

const TotalParentDemo: React.FC<TotalParentDemoProps> = ({ demoName }) => {
  const demoProps = { numberKey, booleanKey, arrayKey, objectKey, functionKey, dateKey };

  return (
    <Fragment>
      <h3>{demoName}</h3>
      {/* 给子组件提供React元素 */}
      <TotalDemo {...demoProps}>
        <div>child</div>
        <MemoizedChild />
      </TotalDemo>

      {/* 给子组件提供字符串/数字 */}
      <TotalDemo {...demoProps}>
        child content
      </TotalDemo>

      {/* 给子组件提供数组 */}
      <TotalDemo {...demoProps}>
        [<div>child1</div>, <div>child2</div>]
      </TotalDemo>

      {/* 给子组件提供函数 */}
      <TotalDemo {...demoProps}>
        {
          (list: string[]) => {
            list.map((item, index) => {
              return <div key={index}>{item}</div>;
            })
          }
        }
      </TotalDemo>

      {/* 给子组件提供Suspense组件 */}
      <TotalDemo {...demoProps}>
        <Suspense fallback={<div>Loading...</div>}>
          <LazyChild />
        </Suspense>
      </TotalDemo>
    </Fragment>
  );
};

export default TotalParentDemo;