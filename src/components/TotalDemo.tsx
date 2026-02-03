import { useState, useEffect, useMemo, useCallback, useRef, memo, Fragment, lazy, Suspense, Children, cloneElement, isValidElement, ReactElement } from 'react';
import { LazyChild as LazyChildComponent, MemoizedChild, CommunicationChild } from './TotalChildDemo';

// 懒加载useContextDemo组件
const LazyChild = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(LazyChildComponent);
    }, 5000);
  });
});

const isString = (child: any): child is string => typeof child === 'string';
const isNumber = (child: any): child is number => typeof child === 'number';
const isFunction = (child: any): child is Function => typeof child === 'function';
const isArray = (child: any): child is any[] => Array.isArray(child);
const isReactElement = (child: any): child is ReactElement => isValidElement(child);

interface TotalDemoProps {
  numberKey: number;
  booleanKey: boolean;
  arrayKey: number[];
  objectKey: {
    name: string;
    age: number;
  };
  functionKey: () => void;
  dateKey: Date;
  children: any;
}

// 函数组件每执行一次就是一次render渲染过程，父组件渲染时，子组件默认也会渲染
const TotalDemo: React.FC<TotalDemoProps> = memo((props) => {
  // props是一个JS对象，memo会将当前props与旧props进行浅比较，如果比较结果为true，则不重新渲染组件
  // 浅比较规则是，如果对象的属性值是基本类型，则直接比较值，如果对象的属性值是引用类型，则比较引用地址
  const {
    // 外部传入的属性
    numberKey,
    booleanKey,
    arrayKey,
    objectKey,
    functionKey,
    dateKey,
    // 内置属性
    children,
  } = props;

  // 定义组件内部状态变量
  const [count, setCount] = useState(0);
  const [list, setList] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLast, setIsLast] = useState(false);
  // 定义组件内部稳定的变量，每次渲染后都还是原来那个地址
  const intervalRef = useRef(0);
  const domRef = useRef<HTMLDivElement>(null);

  // 缓存计算结果，只有count变化时才重新计算，否则返回原来的缓存结果
  // 原来的结果如果不管是基本类型还是引用类型，都还是原来那个地址，起到稳定引用的作用
  // 依赖的比较规则与props相同，使用浅比较
  const memoizedValue = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < count; i++) {
      sum += i;
    }
    return sum;
  }, [count]);

  // 缓存函数，只有count变化时才重新创建，否则返回原来的函数
  // 原来的缓存函数还是原来那个地址，起到稳定函数的作用
  // 依赖的比较规则与props相同，使用浅比较
  const memoizedFunction = useCallback(() => {
    console.log(memoizedValue);
  }, [memoizedValue]);
  const memoizedSetCountFunction = useCallback(() => {
    setCount(count => count + 1);
  }, []); // 空依赖，那么函数引用用于不变

  // 副作用函数，组件渲染后按顺序依次执行
  useEffect(() => {
    console.log('TotalDemo first render');

    intervalRef.current = setInterval(() => {
      setCount(count + 1); // 这里是闭包陷阱，setInterval获取到的count都是初始化的值，因为后续渲染，count已经被重新创建了
      setCount(count + 1); // 这里不会增加两次，而是被react合并了，只执行一次
      setCount((count) => count + 1); // 回调更新是正确的方式，因为回调函数的参数count，永远是上一次渲染后count的值
    }, 10000);

    return () => {
      clearInterval(intervalRef.current); // 组件卸载时清除定时器
    };
  }, []); // 空依赖，组件首次渲染后只执行一次，之后不再执行

  useEffect(() => {
    const style = window.getComputedStyle(domRef.current as Element);
    console.log('TotalDemo always render');
    console.log(style);
  }); // 未指定依赖，每次渲染都执行

  // 依赖numberKey，组件首次渲染后执行一次，之后numberKey变化时再执行
  // 依赖的比较规则与props相同，使用浅比较，如果对象的属性值是基本类型，则直接比较值，如果对象的属性值是引用类型，则比较引用地址
  useEffect(() => {
    console.log('props change TotalDemo render');
  }, [numberKey, booleanKey, arrayKey, objectKey, functionKey, dateKey]);


  // 1. 基础处理：直接渲染（适用于字符串、数字、单个元素）
  const renderBasicChildren = () => {
    if (children == null) {
      return null;
    }
    // 如果是字符串或数字，直接显示
    if (isString(children) || isNumber(children)) {
      return children;
    }
    
    return children;
  };
  // 2. 处理函数类型的 children
  const renderFunctionChildren = () => {
    if (!isFunction(children)) return null;

    return children(['item1', 'item2', 'item3']);
  };
  // 3. 处理数组类型的 children
  const renderArrayChildren = () => {
    if (!isArray(children)) return null;
    
    return (
      <Fragment>
        {Children.map(children, (child) => {
          return isReactElement(child) ? cloneElement(child, { ...child.props, }) : child;
        })}
      </Fragment>
    );
  };
  // 4. 处理 React 元素和片段
  const renderElementChildren = () => {
    if (!isReactElement(children)) return null;
    
    // 检查是否是 Suspense
    if (children.type === Suspense) {
      return children;
    }
    
    return null;
  };
  // 5. 通用渲染逻辑
  const renderContent = () => {
    // 优先处理函数类型
    if (isFunction(children)) {
      return renderFunctionChildren();
    }
    // 处理数组类型
    if (isArray(children)) {
      return renderArrayChildren();
    }
    // 处理 React 元素
    if (isReactElement(children)) {
      const elementRender = renderElementChildren();
      if (elementRender) return elementRender;
    }
    // 默认处理
    return renderBasicChildren();
  };

  return (
    <Fragment>
      {/* 内部输出dom */}
      <div ref={domRef}>
        <p>count: {count}</p>
        <p>memoizedValue: {memoizedValue}</p>
        <p>intervalRef: {intervalRef.current}</p>
        <ul>
          <li>list:</li>
          {
            list.map((item, index) => {
              return <li key={index}>{item}</li>;
            })
          }
        </ul>
        { isLoading && <p>isLoading: {isLoading}</p> }
        { isError && <p>isError: {isError}</p> }
      </div>

      {/* 子组件 */}
      <Suspense fallback={<div>Loading...</div>}>
        <LazyChild />
      </Suspense>
      <MemoizedChild />
      <CommunicationChild count={count} handleSetCount={memoizedSetCountFunction} />
      
      {/* children的内容 */}
      {renderContent()}
    </Fragment>
  );
});

export default TotalDemo;