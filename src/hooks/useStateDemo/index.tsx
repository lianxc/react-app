import { useState } from "react";

interface UseStateDemoProps {
  demoName: string;
}

const UseStateDemo: React.FC<UseStateDemoProps> = ({ demoName }) => {
  const [count, setCount] = useState<number>(0);

  return (
    <div>
      <h3>{demoName}</h3>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

export default UseStateDemo;