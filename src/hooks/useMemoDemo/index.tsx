import { useState, useMemo, memo } from "react";

interface UseMemoDemoProps {
  demoName: string;
}

interface ChildProps {
  max: number;
  expensiveCalculation?: number;
  expensiveCalculationObj?: { sum: number };
}

// 使用memo后，会对props进行浅比较，使用Object.is比较，只对对象第一层比较
// 第一层key是基本类型，则比较值是否相等
// 第一层key是对象，则比较对象的地址，不关心对象的内部值
const Child1: React.FC<ChildProps> = memo(({ max, expensiveCalculation }) => {
  console.log('Child1 rendered');
  return (
    <div>
      <p>Child1 Max: {max}</p>
      <p>Child1 Expensive Calculation: {expensiveCalculation}</p>
    </div>
  );
});

// 使用memo后，会对props进行浅比较，使用Object.is比较，只对对象第一层比较
// 第一层key是基本类型，则比较值是否相等
// 第一层key是对象，则比较对象的地址，不关心对象的内部值，这里useMemo返回的是新对象，所以max变了还是会重新渲染
const Child2: React.FC<ChildProps> = memo(({ max, expensiveCalculationObj }) => {
  console.log('Child2 rendered');
  return (
    <div>
      <p>Child2 Max: {max}</p>
      <p>Child2 Expensive Calculation: {expensiveCalculationObj?.sum}</p>
    </div>
  );
});

// 未使用memo，即使expensiveCalculation在父组件是缓存的，组件也会重新渲染
// 因为useMemo只负责缓存计算结果，不会干涉子组件渲染，只有使用useMemo才会对props进行比较
const Child3: React.FC<Omit<ChildProps, 'max'>> = ({ expensiveCalculation }) => {
  console.log('Child3 rendered');
  return (
    <div>
      <p>Child3 Expensive Calculation: {expensiveCalculation}</p>
    </div>
  );
};

const UseMemoDemo: React.FC<UseMemoDemoProps> = ({ demoName }) => {
  const [count, setCount] = useState<number>(0);
  const [max, setMax] = useState<number>(100);

  // 1. 使用useMemo来缓存计算结果，避免重复计算，当max发生变化时，才会重新计算
  const expensiveCalculation = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < max; i++) {
      sum += i;
    }
    console.log('expensiveCalculation', sum);
    return sum;
  }, [max]);

  // 2. 使用useMemo来缓存计算结果，避免重复计算，当max发生变化时，才会重新计算
  const expensiveCalculation2 = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < max; i++) {
      sum += i;
    }
    console.log('expensiveCalculation2', sum);
    return {
      sum
    };
  }, [max]);

  // 这里直接修改expensiveCalculation2.sum，是无效的，子组件不会重新渲染
  const setExpensiveCalculation2 = () => {
    expensiveCalculation2.sum = 200;
  };

  // 3. 使用普通函数来计算，当count等无关变量发生变化时导致渲染时，也会重新计算
  const expensiveCalculation3 = () => {
    let sum = 0;
    for (let i = 0; i < max; i++) {
      sum += i;
    }
    console.log('expensiveCalculation3', sum);
    return sum;
  };
  const expensiveCalculation3Value = expensiveCalculation3();

  return (
    <div>
      <h3>{demoName}</h3>
      <p>Max: {max}</p>
      <p>Expensive Calculation: {expensiveCalculation}</p>
      <p>Expensive Calculation2: {expensiveCalculation2.sum}</p>
      <p>Expensive Calculation3: {expensiveCalculation3Value}</p>
      <Child1 max={max} expensiveCalculation={expensiveCalculation} />
      <Child2 max={max} expensiveCalculationObj={expensiveCalculation2} />
      <Child3 expensiveCalculation={expensiveCalculation} />
      <button onClick={() => setMax(max + 1)}>Increment Max</button>
      <button onClick={() => setMax(max - 1)}>Decrement Max</button>
      <button onClick={() => setMax(100)}>Reset Max</button>
      <button onClick={setExpensiveCalculation2}>setExpensiveCalculation2</button>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

export default UseMemoDemo;