import { BrowserRouter, Routes, Route, useRoutes } from 'react-router-dom';
import { MyRouteObject, routes } from '@/router/index';
import { RouteObject } from 'react-router-dom';
import useRouteGuard from '@/hooks/useRouteGuard/index';
import KeepAlive from 'react-activation';
import ProtectedRoute from '@/router/ProtectRoute';
import './App.css'

function App() {
  // 全局路由守卫
  useRouteGuard();

  // 递归处理路由，添加包装
  const processRoutes = (routes: MyRouteObject[]): MyRouteObject[] => {
    return routes.map(route => {
      let element = route.element;
      
      // 先处理鉴权
      if (route.meta?.auth && element) {
        element = (
          <ProtectedRoute>{element}</ProtectedRoute>
        );
      }
      
      // 再处理缓存
      if (route.meta?.keepAlive && element) {
        element = (
          <KeepAlive 
            id={route.path || 'default'} 
            saveScrollPosition="screen"
            name={route.path}
          >
            {element}
          </KeepAlive>
        );
      }
      
      // 递归处理子路由
      if (route.children && route.children.length > 0) {
        return {
          ...route,
          element,
          children: processRoutes(route.children)
        };
      }
      
      return {
        ...route,
        element
      };
    });
  };

  // 路由组件
  const AppRoutes = () => {
    const processedRoutes = processRoutes(routes);
    const element = useRoutes(processedRoutes as RouteObject[]);
    return element;
  };

  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
}

export default App;