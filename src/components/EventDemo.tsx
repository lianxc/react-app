import { useState } from 'react';

interface EventDemoProps {
  demoName: string;
}

const EventDemo: React.FC<EventDemoProps> = ({ demoName }) => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  };
  const handleClick1 = (num: number) => {
    setCount(count + num);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, num: number) => {
    setCount(parseInt(e.target.value) + num);
  };
  return (
    <div>
      <h3>{demoName}</h3>
      <p>Count: {count}</p>
      {/* 调用方式一：直接传函数引用 */}
      {/* 点击时，React 帮你调用：handleClick(event)，简洁、性能最好但不能额外传自定义参数（只能拿 event） */}
      <button onClick={handleClick}>Click</button>

      {/* 调用方式二：传箭头函数包装，可以自由传参 */}
      {/* 点击时，React 调用外层箭头函数，箭头函数内部调用 handleClick1(2) */}
      <button onClick={() => handleClick1(2)}>Click1</button>

      {/* 调用方式三：事件对象 + 自定义参数（组合型） */}
      {/* 既能拿 event，又能传自定义参数 */}
      <input type="text" value={count} onChange={(e) => handleChange(e, 5)} />
    </div>
  )
};

export default EventDemo;

// React 常见事件 & 调用签名对照表
// | 事件名       | 事件类型          | 回调签名                                      |
// | --------- | ------------- | ----------------------------------------- |
// | onClick   | MouseEvent    | `(e: MouseEvent) => void`                 |
// | onChange  | ChangeEvent   | `(e: ChangeEvent<T>) => void`             |
// | onInput   | FormEvent     | `(e: FormEvent<T>) => void`               |
// | onSubmit  | FormEvent     | `(e: FormEvent<HTMLFormElement>) => void` |
// | onKeyDown | KeyboardEvent | `(e: KeyboardEvent) => void`              |
// | onKeyUp   | KeyboardEvent | `(e: KeyboardEvent) => void`              |
// | onFocus   | FocusEvent    | `(e: FocusEvent) => void`                 |
// | onBlur    | FocusEvent    | `(e: FocusEvent) => void`                 |
