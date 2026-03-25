import { defineConfig, loadEnv } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import react from '@vitejs/plugin-react'
import path from 'path'
import config from './config'
import initData from './config/init';
import alias from './config/alias'
import generateScopedName from './scripts/generateScopedName'
import postcssImport from 'postcss-import'
import postcssUrl from 'postcss-url'
import autoprefixer from 'autoprefixer'
import postcssPxtorem from 'postcss-pxtorem'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const currentMode = (env.VITE_BUILD_ENV || mode) as keyof typeof config.assetsPath;
  const isProd = mode === 'production';
  const isBuild = process.env.NODE_ENV === 'production';
  const publicPath = `${config.assetsPath[currentMode ] || ''}/${config.projectName}`;

  return {
    // 基础配置
    // base: currentMode === 'dev' ? '/' : publicPath,
    // root: './src', // 根目录
    plugins: [
      react({
        babel: {
          plugins: [
            ['babel-plugin-react-compiler'],
            ["react-activation/babel"],
            ["@dr.pogodin/babel-plugin-react-css-modules", {
              "generateScopedName": generateScopedName,
              "handleMissingStyleName": "warn",
              "filetypes": {
                ".scss": {
                  "syntax": "postcss-scss"
                }
              },
              // 添加以下配置来移除调试属性
              "removeImport": false,
              "attributeNames": {
                "styleName": "className"
              },
              // 关键：禁用自动添加 data 属性
              "autoResolveMultipleImports": false,
            }]
          ]
        },
      }),
      // 多入口时需用 vite-plugin-html 处理 HTML 中的 EJS（如 __STATIC_PREFIX__），否则浏览器会请求未替换的占位符路径导致 404
      createHtmlPlugin({
        pages: [
          {
            template: 'src/pages/home/index.html',
            filename: 'home',
            injectOptions: {
              data: {
                mode,
                __STATIC_PREFIX__: env.VITE_STATIC_PREFIX ?? '',
                process: { env: { NODE_ENV: process.env.NODE_ENV } }
              }
            }
          },
          {
            template: 'src/pages/user/index.html',
            filename: 'user',
            injectOptions: {
              data: {
                mode,
                __STATIC_PREFIX__: env.VITE_STATIC_PREFIX ?? '',
                process: { env: { NODE_ENV: process.env.NODE_ENV } }
              }
            }
          }
        ]
      })
    ],
    // 开发服务器
    server: {
      host: '127.0.0.1',
      port: 2026,
      open: true,
      cors: true,
      proxy:  {},
      // 增加文件监听上限
      watch: {
        ignored: ['node_modules/**'],
        usePolling: true
      }
    },
    build: {
      rollupOptions: {
        input: {
          home: path.resolve(__dirname, 'src/pages/home/index.html'),
          user: path.resolve(__dirname, 'src/pages/user/index.html'),
        },
        output: {
          manualChunks(id: string) {
            // ✅ 使用 'react' 而不是 'react/'，这样能匹配到 react-dom、react-is 等
            if (id.includes('node_modules/react')) {
              return 'react-vendor';
            }
            
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
          // 输出文件名包含hash以支持长期缓存
          entryFileNames: 'js/[name].[hash:8].js',
          chunkFileNames: 'js/[name].[hash:8].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.type === 'asset' && /\.(jpe?g|png|gif|svg|webp)$/i.test(assetInfo.name || '')) {
              return 'img/[name].[hash].[ext]';
            } if (assetInfo.type === 'asset' && /\.(ttf|woff|woff2|eot)$/i.test(assetInfo.name || '')) {
              return 'fonts/[name].[hash].[ext]';
            }
            return '[ext]/[name].[hash:8].[ext]';
          },
          sourcemapBaseUrl: isProd ? config.sourceMapPublicPath : '',
          sourcemapFileNames: isProd ? 'sourcemaps/[name].[hash:8].js.map' : ''
        },
      },
    },
    css: {
      // 提取CSS到单独文件
      extract: isBuild,
      // 生产环境启用CSS压缩
      minify: isBuild,
      modules: {
        generateScopedName: generateScopedName,
        localsConvention: "camelCase"
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@use 'COMMON/scss/mixins.scss' as *;`,
        }
      },
      postcss: {
        plugins: [
          postcssImport(),
          postcssUrl(),
          autoprefixer({
            overrideBrowserslist: ['> 1%', 'last 2 versions']
          }),
          postcssPxtorem({
            rootValue({ file }: { file: string }) {
              // 根据文件路径判断 rootValue
              const rootValue = file.indexOf('vant') !== -1 ? 37.5 : 75
              return rootValue
            },
            propList: ['*'],
            minPixelValue: 1,
            unitPrecision: 5,
          })
        ]
      }
    },
    // 全局常量
    define: {
      __DEVELOPER__: `'${initData.__DEVELOPER__}'`,
      __ACT_NAME__: `'${initData.__ACT_NAME__}'`,
      __UI_BASELINE_VAL__: `'${initData.__UI_BASELINE_VAL__}'`,
      __STATIC_PREFIX__: `'${env.VITE_STATIC_PREFIX}'`,
      process: {
        env: {
          NODE_ENV: process.env.NODE_ENV,
          ...env
        }
      }
    },
    resolve: {
      alias,
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
      // 强制所有包共用同一个 React 实例
      dedupe: ['react', 'react-dom']
    }
  }
})