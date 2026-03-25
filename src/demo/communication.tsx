// 父->子通信方案
// - 父组件通过props向子组件传递数据
// - 父组件调用子组件的回调函数
// - 子组件暴露方法给父组件

// 子->父通信方案：
// - 子组件通过父组件的回调函数调用父组件

// 兄弟组件、跨组件通信方案
// - 状态提升：手动提升、useContext、useReducer、Redux、Zustand
// - 事件通信：自定义事件、发布订阅、EventEmitter、mitt
import React, { useMemo, useState, forwardRef, useImperativeHandle, useRef, createContext, useContext } from 'react';
import './communication.module.scss';

// 创建全局上下文组件
interface GlobalContextType {
  globalMessage: string;
  setGlobalMessage: (message: string) => void;
}
const GlobalContext = createContext<GlobalContextType>({
  globalMessage: '',
  setGlobalMessage: () => {}
});

interface ChildProps {
  message: string;
  setMessage: (message: string) => void;
  handleMessageChange: (message: string, callback?: (message: string) => void) => void;
}
const Child = forwardRef(({ message, setMessage, handleMessageChange }: ChildProps, ref) => {
  const { globalMessage, setGlobalMessage } = useContext(GlobalContext);
  const [childMessage, setChildMessage] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  // 子组件通过父组件传递的回调函数改变父组件的message
  // 同时传递回调函数给父组件，父组件可以调用回调函数改变子组件的message
  const handleMessageChangeWithCallback = (message: string) => {
    handleMessageChange(message, (childMessage) => {
      setChildMessage(childMessage);
    });
  };

  // 子组件通过全局上下文改变全局状态
  const handleGlobalMessageChange = (message: string) => {
    setGlobalMessage(message);
  };

  // 子组件暴露方法给父组件
  useImperativeHandle(ref, () => ({
    handleMessageByExpose: (message: string) => {
      setChildMessage(message);
    },
    getChildMessageByExpose: () => {
      return childMessage;
    },
    handleFocusInputByExpose: () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }), [childMessage]);

  // if (childMessage === 'child hello') {
  //   throw new Error('test error boundary');
  // }

  return (
    <div>
      <h1>Child</h1>
      <p styleName="childMessage">{childMessage}</p>
      <input ref={inputRef} type="text" value={childMessage} onChange={(e) => setChildMessage(e.target.value)} />
      {/* 子组件通过父组件传递的setState函数改变父组件的message */}
      <button onClick={() => setMessage('father hello')}>Change Father Message</button>
      {/* 子组件通过父组件传递的回调函数改变父组件的message */}
      <button onClick={() => handleMessageChange('father hello by callback')}>Change Father Message By Callback</button>
      {/* 子组件通过父组件传递的回调函数，同时又提供回调函数可以给父组件改变子组件的message */}
      <button onClick={() => handleMessageChangeWithCallback('father hello by callback')}>Change Child Message</button>
      {/* 子组件通过全局上下文改变全局状态 */}
      <button onClick={() => handleGlobalMessageChange('grandfather hello')}>Change Global Message</button>
    </div>
  );
});

const Father: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const childRef = useRef(null);

  // 传递回调函数给子组件，让子组件可以像父组件通信
  const handleMessageChangeByFather = (message: string, callback?: (message: string) => void) => {
    setMessage(message);
    console.log(message);
    // 这里可以继续回调子组件的方法，像子组件通信
    if (callback) {
      callback('child hello');
    }
  };

  // 父组件执行子组件暴露的方法
  const excuteChildMethodByFather = () => {
    if (childRef.current) {
      childRef.current?.handleMessageByExpose('child hello');
      // 此处无法获取到最新值，因为setState是异步的
      console.log(childRef.current?.getChildMessageByExpose());
      childRef.current?.handleFocusInputByExpose();
    }
  };

  return (
    <div>
      <h1>Father</h1>
      <p styleName="fatherMessage">{message}</p>
      <button onClick={excuteChildMethodByFather}>Excute Child Method</button>
      <Child ref={childRef} message={message} setMessage={setMessage} handleMessageChange={handleMessageChangeByFather}/>
    </div>
  );
};

const GrandFather: React.FC = () => {
  const [globalMessage, setGlobalMessage] = useState<string>('');
  const globalValue = useMemo(() => ({
    globalMessage,
    setGlobalMessage
  }), [globalMessage]);

  return (
    <GlobalContext.Provider value={globalValue}>
      <p styleName="globalMessage">{globalMessage}</p>
      <Father />
    </GlobalContext.Provider>
  );
};

export default GrandFather;