import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import type { CustomRouteMeta } from '@/types/router';

// 扩展meta属性
export interface MyRouteObject extends Omit<RouteObject, 'children'> {
  meta?: CustomRouteMeta;
  children?: MyRouteObject[];
}

const Home = lazy(() => import('@/views/home/Home'));
const Login = lazy(() => import('@/views/home/Login'));
const Settings = lazy(() => import('@/views/home/Settings'));
const NotFound = lazy(() => import('@/views/home/NotFound'));

// 配置路由列表，给需要守卫的路由添加 meta 属性
export const routes: MyRouteObject[] = [
  {
    path: "/",
    element: <Home />,
    meta: { keepAlive: true, title: "首页" }
  },
  {
    path: "/setting",
    element: <Settings />,
    meta: { auth: true, title: "设置" } // 设置页需要鉴权
  },
  {
    path: "/login",
    element: <Login />,
    meta: { auth: false, title: "登录" } // 登录页不需要鉴权
  },
  {
    path: "*",
    element: <NotFound />,
    meta: { keepAlive: false, title: "404" }
  }
];