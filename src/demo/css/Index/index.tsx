import { useState, useMemo, useEffect } from 'react';
import ButtonGroup from '../ButtonGroup';
import styles from './index.module.scss';

export default function Index() {
  // 'use no memo';
  const [count, setCount] = useState(0);
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [otherName, setOtherName] = useState('otherName');

  // ======================useMemo场景=========================
  // 对象传递给子组件，complier会自动稳定引用，无需使用useMemo
  const objName = {
    firstName,
    lastName,
  };
  // 涉及计算方法调用，complier不会自动识别状态变量缓存，需要手动使用useMemo
  const fullName = (() => {
    console.log('getFullName');
    return `${firstName} ${lastName}`;
  })();
  // 初步测试，complier下，主动指定useMemo失效了，回调每次都会执行，但是缓存是稳定的
  const fullName2 = useMemo(() => {
    let result = 0;
    for (let i = 0; i < 100000; i++) {
      result += i;
    }
    console.log(result + firstName + lastName);
    return {
      result,
      fullName: `${firstName} ${lastName}`,
    };
  }, [firstName, lastName]);
  // 对象作为依赖项，complier会自动稳定引用，无需使用useMemo包裹objName，但还是需要指定依赖项
  useEffect(() => {
    console.log('useEffect objName', objName.firstName, objName.lastName);
  }, [objName]);

  // ======================useCallback场景=========================
  // 函数作为props传递给子组件，complier会自动稳定引用，无需使用useCallback
  // 且智能识别到函数内部依赖了状态变量，会自动缓存，变量变化时会重新创建函数
  const handleSetFirstName = () => {
    console.log('execute handleSetFirstName');
    setFirstName('Jane' + count);
  };
  // 普通函数直接定义，complier会自动稳定引用，无需使用useCallback
  const handleSetFirstName2 = () => {
    setFirstName('Jane');
  };
  // 函数作为依赖项，complier会自动稳定引用，无需使用useCallback包裹handleSetFirstName，但还是需要指定依赖项
  useEffect(() => {
    console.log('useEffect handleSetFirstName', handleSetFirstName);
  }, [handleSetFirstName]);
  useEffect(() => {
    console.log('useEffect handleSetFirstName2', handleSetFirstName2, fullName2);
  }, [handleSetFirstName2, fullName2]);

  return (
    <div styleName="index">
      <h1>Index</h1>
      <span>{otherName}</span>
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setOtherName('hehe')}>setOtherName</button>
      <ButtonGroup
        className={styles.myButtonGroup} 
        objName={objName} 
        fullName={fullName} 
        handleSetFirstName={handleSetFirstName}
      >
        Click me
      </ButtonGroup>
    </div>
  );
}