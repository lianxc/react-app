import UseStateDemo from './hooks/useStateDemo'
import UseEffectDemo from './hooks/useEffectDemo'
import UseCallbackDemo from './hooks/useCallbackDemo'
import UseMemoDemo from './hooks/useMemoDemo'
import UseContextDemo from './hooks/useContextDemo'
import UseImperativeHandleDemo from './hooks/useImperativeHandleDemo'
import UseTranstionDemo from './hooks/useTranstionDemo'
import UseReducerDemo from './hooks/useReducerDemo'
import UseSelfHooksDemo from './hooks/useSelfHooksDemo'
import SuspenseDemo from './components/SuspenseDemo'
import PortalDemo from './components/PortalDemo'
import UseDeferredValueDemo from './hooks/useDeferredValueDemo'
import './App.css'

function App() {
  return (
    <>
      {/* <UseStateDemo demoName="UseStateDemo" /> */}
      {/* <UseEffectDemo demoName="UseEffectDemo" /> */}
      {/* <UseMemoDemo demoName="UseMemoDemo" /> */}
      {/* <UseCallbackDemo demoName="UseCallbackDemo" /> */}
      {/* <UseContextDemo demoName="UseContextDemo" /> */}
      {/* <UseImperativeHandleDemo demoName="UseImperativeHandleDemo" /> */}
      {/* <UseTranstionDemo demoName="UseTranstionDemo" /> */}
      {/* <UseReducerDemo demoName="UseReducerDemo" /> */}
      {/* <UseSelfHooksDemo demoName="UseSelfHooksDemo" /> */}
      {/* <SuspenseDemo demoName="SuspenseDemo" /> */}
      {/* <PortalDemo demoName="PortalDemo" /> */}
      <UseDeferredValueDemo demoName="UseDeferredValueDemo" />
    </>
  )
}

export default App