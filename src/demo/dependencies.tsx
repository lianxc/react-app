import React, { useEffect, useState, useContext, useMemo, useCallback, useRef } from 'react';

interface ThemeContextType {
  theme: string;
}

const ThemeContext = React.createContext<ThemeContextType>({
  theme: 'light',
});

interface EffectDemoProps {
  message: string;
  obj: {
    gender: string;
    age: number;
  };
  callback: () => void;
}

// 自定义hook
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const handler = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  
  return size;
}

const EffectDemo: React.FC = ({ message, obj, callback }: EffectDemoProps) => {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState({ name: 'John' });
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useContext<ThemeContextType>(ThemeContext);
  const timer = useRef<number |null>(null);
  const timerCount = useRef(0);
  const windowSize = useWindowSize();

  const baseUrl = 'https://api.example.com'; // 常量
  // useMemo的使用场景是:
  // 1. 作为 props 传递给子组件，避免子组件不必要的渲染
  // 2. 作为其他 hooks 的依赖项，避免其他hooks不必要的重复执行
  // 3. 计算存在较大开销，避免每次渲染都重新计算，可以进行缓存
  // useMemo的依赖项执行规则是：
  // 1. 指定了依赖，会进行浅比较判断依赖是否变化，如果变化，则重新计算值返回，并重新缓存
  // 2. 空依赖，则永远稳定，不会再次计算值
  // 3. 没指定依赖，相当于没用，每次都会计算且引用变化
  const baseObj = useMemo(() => ({ gender: 'male', age: 20 }), []);

  // useCallback的使用场景是:
  // 1. 作为 props 传递给子组件，避免子组件不必要的渲染
  // 2. 作为其他 hooks 的依赖项，避免其他hooks不必要的重复执行
  // 3. 函数内部依赖了可能变化的变量
  // useCallback的依赖项执行规则是：
  // 1. 指定了依赖，会进行浅比较判断依赖是否变化，如果变化，则函数重新创建，并重新缓存
  // 2. 空依赖，则永远稳定，函数不会重新创建
  // 3. 没指定依赖，相当于没用，每次都会创建，并且捕获的永远是旧闭包
  const handleClick = useCallback(() => {
    console.log('点击', count);
  }, [count]);

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // 派生值
  const doubledCount = count * 2;
  // 派生函数
  const doubledCountFn = useCallback(() => {
    return count * 2;
  }, []);

  // 指定依赖的作用是，明确当哪些依赖改变时，就会重新执行effect函数
  // 依赖变化的检测规则是：
  // 1. 基本类型：通过比较值是否变化判断是否需要重新执行
  // 2. 引用类型：通过浅比较判断引用是否变化，来确定是否需要重新执行
  // 依赖指定的原则是：
  // 1. 只对当前effect内使用到的，且可能会变化的依赖进行指定
  // 2. effect内使用到的可能会变的，必须添加依赖，否则会导致effect内对应的逻辑没更新
  // 3. effect内没用到的不要指定，否则依赖指定多了，会导致effect不必要的重复执行
  // 4. 检查依赖的项本身是否正确，例如本身内容不会变，但是由于渲染快照导致引用变化的原因，会导致effect不必要的重复执行
  // effect执行多了或者少的会导致：
  // 1. 执行多了，例如可能导致effect内接口多次不必要发起
  // 2. 执行少了，例如可能导致effect内逻辑没更新，例如更改了接口参数，但没重新请求
  // effect执行的规则是：
  // 1. 首次都会执行一次
  // 2. 再次执行，会先执行上一次return的清理函数（如果有），然后再执行effect函数
  // effect不同依赖指定的执行区别是：
  // 1. 指定了依赖，首次会执行一次，之后会根据指定的其中任一依赖是否变化，来决定是否需要执行
  // 2. 没指定依赖，首次会执行一次，之后每次渲染都会执行
  // 3. 空依赖，则首次执行一次，之后不会再执行
  useEffect(() => {
    console.log('count changed', count);
    console.log('user changed', user);
    console.log('message changed', message);
    console.log('obj changed', obj);
    console.log('callback changed', callback);
    console.log('windowSize changed', windowSize);
    console.log('baseUrl changed', baseUrl); // 常量，值不会改变，不需要依赖
    console.log('baseObj changed', baseObj);
    console.log('doubledCount changed', doubledCount);
    console.log('doubledCountFn changed', doubledCountFn());
    console.log('handleClick changed', handleClick());
  }, [
    count, // 依赖内部基础类型state，通过比较值是否变化判断是否需要重新执行
    user, // 依赖内部引用类型state，通过比较引用是否变化判断是否需要重新执行
    message, // 依赖外部基础类型props，通过比较值是否变化判断是否需要重新执行
    obj, // 依赖外部引用类型props，通过比较引用是否变化判断是否需要重新执行
    callback, // 依赖外部函数类型props，通过比较引用是否变化判断是否需要重新执行
    theme, // 依赖外部context，通过比较值是否变化判断是否需要重新执行
    windowSize, // 依赖自定义hook，通过比较值是否变化判断是否需要重新执行
    doubledCount, // 依赖派生值，通过比较值是否变化判断是否需要重新执行
    doubledCountFn, // 依赖派生函数，通过比较引用是否变化判断是否需要重新执行
  ]);

  // useEffect作用域规则是：
  // 0. 作用域是单独的新创建的函数作用域，与外部隔离
  // 1. 无闭包，无清理函数，则执行完作用域立即销毁
  // 2. 有闭包，无清理函数，则执行完作用域保留，直到闭包不再被引用时
  // 3. 无闭包，有清理函数，则执行完作用域保留，直到清理函数执行后
  // 4. 有闭包，有清理函数，则执行完作用域保留，直到闭包不再被引用时，直到清理函数执行后
  useEffect(() => {
    const x = 1; // 内部变量
    const y = {a: 1}; // 内部对象
    const z = () => { // 内部函数
      return x + y.a;
    };
    console.log('z', z());

     // 引用了外部变量，形成闭包
    console.log('count', count);

    // 对象外部变量进行赋值，形成闭包
    timer.current = setInterval(() => {
      timerCount.current = timerCount.current + 1;
    }, 1000);

    // 内部事件监听器
    const listener = () => {
      console.log(document.body.clientWidth);
    };
    window.addEventListener('resize', listener);

    // 清理函数, 使用了内部变量，形成内部闭包
    return () => {
      if(timer.current) {
        clearInterval(timer.current);
      }
      window.removeEventListener('resize', listener);
    };
  }, [isLoading]);

  return (
    <div>
      <h1>Effect Demo</h1>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default EffectDemo;