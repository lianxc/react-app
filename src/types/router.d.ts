import { RouteObject } from 'react-router-dom';

// 扩展 meta 类型
export interface CustomRouteMeta {
  auth?: boolean;     // 是否需要登录验证
  title?: string;     // 页面标题
  keepAlive?: boolean; // 是否需要缓存
  roles?: string[];   // 允许访问的角色列表
}

// 扩展 react-router-dom 的路由类型
declare module 'react-router-dom' {
  interface IndexRouteObject {
    meta?: CustomRouteMeta;
  }
  interface NonIndexRouteObject {
    meta?: CustomRouteMeta;
  }
}