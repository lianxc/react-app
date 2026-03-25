import { Link } from 'react-router-dom'
import clsx from 'clsx';
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
import CommonComponent from '@/components/CommonComponent'
import AntdComponent from '@/components/AntdComponent'
import { ErrorBoundaryComponent } from '@/components/ErrorBoundary'
import { StoreComponentWithContext, StoreComponentWithZustand } from '@/demo/storeComponent'
import Request from '@/demo/request'
import RequestRQ from '@/demo/requestRQ'
import Form from '@/demo/form'
import FormVant from '@/demo/formVant'
import Fade from '@/demo/animation/fade'
import TodoList from '@/demo/animation/group'
import Animation from '@/demo/animation'
import StoreMobx from '@/demo/storeMobx'
import TaxProofDemo from '@/demoAi/TaxProofDemo'
import ScrollDemo, { ScrollLeft } from '@/demo/practice/Scroll'
// import Annual from '@/demo/practice/Annual'
import Antd from '@/demo/antd'
import CssIndex from '@/demo/css/Index'
import Base from '@/demo/practice/Base'
import './Home.module.scss'

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
      {/* <StoreMobx demoName="StoreMobx" /> */}
      {/* <CommonComponent></CommonComponent> */}
      {/* <AntdComponent></AntdComponent> */}
      {/* <TaxProofDemo demoName="TaxProofDemo" /> */}
      {/* <ScrollLeft demoName="ScrollLeft" /> */}
      {/* <Annual demoName="Annual" /> */}
      {/* <Antd></Antd> */}
      {/* <CssIndex></CssIndex> */}
      {/* <Animation></Animation> */}
      {/* <ScrollDemo demoName="ScrollDemo" /> */}
      <Base demoName="Base" />
      {/* <ScrollDemo demoName="ScrollDemo" /> */}
      

      {/* <div styleName={clsx('nav')}>
        <Link to="/login">User</Link>
        <Link to="/settings">Settings</Link>
      </div> */}
    </ErrorBoundaryComponent>
  )
}

export default App