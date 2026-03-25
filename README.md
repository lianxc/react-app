# React最佳实践

0.react19+vite+pnpm+ts+eslint
1. 接入react complier，自动useMemo，自动useCallback，减少手动的困扰
2.用 eslint-plugin-react-hooks 自动补全依赖，减少自己判断的心智
3.mobx自动依赖，减少手动setstate的麻烦，react-router，react-query做 api状态管理
4.样式接入css module，使用scss。使用postcss的前后处理，并使用babel-plugin-react-css-modules，使用styleName，并使用clsx库做类名的逻辑判断
5.接入immer直接支持数据的直接修改，减少返回新数据的负担
6.表单使用react-hook-form，移动端组件使用react-vant，PC端使用ant-design
7.react-activation做keep-alive
8.react-transition-group做过渡动画
9.类型安全：Zod 打通前后端
10.性能监控：Why Did You Render
11.unplugin-auto-import实现自动import依赖


