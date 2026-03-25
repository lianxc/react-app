import { useStore, StoreProvider } from './store';
import useZustandStore from '../store';

interface StoreComponentProps {
  demoName: string;
}
const StoreComponent: React.FC<StoreComponentProps> = ({ demoName }) => {
  const { state, dispatch } = useStore();

  return (
    <div>
      <h1>{demoName}</h1>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment', payload: 2 })}>Increment</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>Decrement</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  )
}

const StoreComponentWithContext = ({ demoName }: StoreComponentProps) => {
  return (
    <StoreProvider>
      <StoreComponent demoName={demoName} />
    </StoreProvider>
  )
}

const StoreComponentWithZustand = ({ demoName }: StoreComponentProps) => {
  const { count, increment, decrement, reset, updateTheme } = useZustandStore();
  const { theme } = useZustandStore((state) => state.admin.profile.settings);

  return (
    <div>
      <h1>{demoName}</h1>
      <p>Count: {count}</p>
      <p>Theme: {theme}</p>
      <button onClick={() => updateTheme('light')}>Update Theme</button>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}

export {StoreComponentWithContext, StoreComponentWithZustand};