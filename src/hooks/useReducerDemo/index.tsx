import { useReducer } from "react";

type ActionType = 'ADD_COUNT' | 'SUB_COUNT' | 'RESET_COUNT';

interface StateType {
  count: number;
}

// 1. 定义状态类型和初始状态
const initialState: StateType = {
  count: 0
};

// 2.定义action类型
const ACTIONS = {
  ADD_COUNT: 'ADD_COUNT',
  SUB_COUNT: 'SUB_COUNT',
  RESET_COUNT: 'RESET_COUNT'
};

// 3.定义reducer函数
const reducer = (state: StateType, action: { type: ActionType }) => {
  switch (action.type) {
    case ACTIONS.ADD_COUNT:
      return { ...state, count: state.count + 1 };
    case ACTIONS.SUB_COUNT:
      return { ...state, count: state.count - 1 };
    case ACTIONS.RESET_COUNT:
      return { ...state, count: 0 };
  }
};

interface UseReducerDemoProps {
  demoName: string;
}

const UseReducerDemo: React.FC<UseReducerDemoProps> = ({ demoName }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <h3>{demoName}</h3>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: ACTIONS.ADD_COUNT })}>Increment</button>
      <button onClick={() => dispatch({ type: ACTIONS.SUB_COUNT })}>Decrement</button>
      <button onClick={() => dispatch({ type: ACTIONS.RESET_COUNT })}>Reset</button>
    </div>
  );
}

export default UseReducerDemo;