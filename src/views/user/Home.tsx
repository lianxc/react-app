import UseStateDemo from '@/hooks/useStateDemo'
import UseEffectDemo from '@/hooks/useEffectDemo'
import UseCallbackDemo from '@/hooks/useCallbackDemo'
import UseMemoDemo from '@/hooks/useMemoDemo'
import UseContextDemo from '@/hooks/useContextDemo'
import UseImperativeHandleDemo from '@/hooks/useImperativeHandleDemo'
import UseTranstionDemo from '@/hooks/useTranstionDemo'
import UseReducerDemo from '@/hooks/useReducerDemo'
import UseSelfHooksDemo from '@/hooks/useSelfHooksDemo'
import SuspenseDemo from '@/components/SuspenseDemo'
import PortalDemo from '@/components/PortalDemo'
import UseDeferredValueDemo from '@/hooks/useDeferredValueDemo'
import VirtualScrollingDemo from '@/demo/virtualScrolling'
import WebWorkerDemo from '@/demo/workerDemo'
import CommunicationDemo from '@/demo/communication'
import { ErrorBoundaryComponent } from '@/components/ErrorBoundary'
import { StoreComponentWithContext, StoreComponentWithZustand } from '@/demo/storeComponent'
import Request from '@/demo/request'
import RequestRQ from '@/demo/requestRQ'
import Form from '@/demo/form'
import FormVant from '@/demo/formVant'
import Fade from '@/demo/animation/fade'
import TodoList from '@/demo/animation/group'
import StoreMobx from '@/demo/storeMobx'

function App() {
  return (
    <ErrorBoundaryComponent>
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
      {/* <UseDeferredValueDemo demoName="UseDeferredValueDemo" /> */}
      {/* <VirtualScrollingDemo demoName="VirtualScrollingDemo" /> */}
      {/* <WebWorkerDemo demoName="WebWorkerDemo" /> */}
      {/* <CommunicationDemo demoName="CommunicationDemo" /> */}
      {/* <StoreComponentWithContext demoName="StoreComponentWithContext" /> */}
      {/* <StoreComponentWithZustand demoName="StoreComponentWithZustand" /> */}
      {/* <Request demoName="Request" /> */}
      {/* <RequestRQ demoName="RequestRQ" /> */}
      {/* <Form demoName="Form" /> */}
      {/* <FormVant demoName="FormVant" /> */}
      {/* <Fade demoName="Fade" /> */}
      {/* <TodoList demoName="TodoList" /> */}
      <StoreMobx demoName="StoreMobx" />
    </ErrorBoundaryComponent>
  )
}

export default App