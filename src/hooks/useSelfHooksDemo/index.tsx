import useCount from "./hooks";

interface UseSelfHooksDemoProps {
  demoName: string;
}

const UseSelfHooksDemo: React.FC<UseSelfHooksDemoProps> = ({ demoName }) => {
  const { count, increment, decrement, reset } = useCount();

  return (
    <div>
      <h3>{demoName}</h3>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

export default UseSelfHooksDemo;