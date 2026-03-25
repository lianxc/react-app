import react from '@vitejs/plugin-react';
import eslintPlugin from 'vite-plugin-eslint';
import legacy from '@vitejs/plugin-legacy';
import { Plugin as importToCDN } from 'vite-plugin-cdn-import';
import { createHtmlPlugin } from 'vite-plugin-html';
import { visualizer } from 'rollup-plugin-visualizer';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import viteCompression from 'vite-plugin-compression';
import addDebugPlugin from './add-debug';
import addProxyNativePlugin from './add-proxy-native';

function initPlugins(env = {} as ImportMetaEnv, mode: string) {
  const currentMode = (env.VITE_APP_CURRENTMODE || mode);
  const isBuild = process.env.NODE_ENV === 'production';
  const isTestAndGray = ['test', 'gray'].includes(currentMode);

  // 初始化插件
  const plugins = [
    react({
      jsxRuntime: 'automatic',
    }),

    // 添加ESLint插件
    eslintPlugin({
      // 配置选项
      cache: false,
      include: ['src/**/*.{ts,tsx,js,jsx}'],
      exclude: ['node_modules/**'],
      // failOnError: false, // 开发环境下不阻止构建
      emitWarning: true,
      emitError: true,
    }),

    legacy({
      targets: ['defaults', 'not IE 11', 'chrome >= 49', 'ios >= 13'],
    }),

    createHtmlPlugin({
      inject: {
        data: {
          VITE_APP_CURRENTMODE: env.VITE_APP_CURRENTMODE
        }
      },
      minify: isBuild // 生产环境压缩HTML
    }),

    importToCDN({
      // 打包时忽略的文件
      prodUrl: `${env.VITE_STATIC_PREFIX}{path}`,
      modules: [
        {
          name: 'react',
          path: 'live/helloyo/app-common/react/19.1.1/react.production.min.js',
          var: 'React',
        },
        {
          name: 'react-dom',
          alias: ['react-dom/client'],
          path: 'live/helloyo/app-common/react/19.1.1/react-dom.production.min.js',
          var: 'ReactDOM',
        },
        {
          name: '@bigo/sentry-wrapper',
          path: 'live/helloyo/app-common/react/sentry-wrapper.umd.min.js',
          var: 'sentryWrapper',
        },
        {
          name: '@bigo/nativeapi-helloyo',
          path: 'live/helloyo/app-common/nativeapi/2.1.12/nativeApi.helloyo.min.js',
          var: 'nativeApi',
        },
      ],
      generateScriptTag(name, scriptUrl) {
        return {
          attrs: { src: scriptUrl }
        };
      }
    }),

    ViteImageOptimizer({
      /* pass your config */
    })
  ];

  if (isBuild) {
    // 生产环境启用压缩
    plugins.push(viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240, // 文件大于10kb才压缩
    }));
  } else {
    // 开发环境
    // 添加代理Native插件
    plugins.push(addProxyNativePlugin());
    // 构建分析工具
    plugins.push(visualizer({
      filename: './dist/stats.html',
      open: ['analyzer', 'dev'].includes(currentMode)
    }));
  }
  // 测试和灰度环境添加调试插件
  if (isTestAndGray) {
    plugins.push(addDebugPlugin());
  }

  return plugins;
}

export default initPlugins;