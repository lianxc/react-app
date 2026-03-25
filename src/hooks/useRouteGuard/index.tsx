import { useEffect } from "react";
import { matchRoutes, useLocation, useNavigate } from "react-router-dom";
import { routes } from "@/router/index";

const useRouteGuard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. 获取当前路径匹配到的所有路由
    const matches = matchRoutes(routes, location);
    if (!matches) return;
    console.log(matches);

    for (const match of matches) {
      const routeMeta = match.route.meta;
      
      // 动态修改页面标题
      if (routeMeta?.title) {
        document.title = routeMeta.title;
      }
    }
  }, [location, navigate]); // 监听 location 变化
};

export default useRouteGuard;