import { createContext, useContext, useReducer } from 'react';

// 全局状态
const initialState = {
  count: 0,
};

// reducer模块
const reducer = (state: typeof initialState, action: any) => {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + (action.payload || 1) };
    case 'decrement':
      return { ...state, count: state.count - (action.payload || 1) };
    case 'reset':
      return { ...state, count: 0 };
    default:
      break
  }
  return state;
};

// 创建全局状态上下文
const StoreContext = createContext(initialState);

// 提供者组件
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    // 将state和dispatch作为value传递给子组件
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
}

// 使用者hook
export function useStore() {
  const context = useContext(StoreContext);

  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}