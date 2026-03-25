# Vite TinyPNG Plugin 使用说明
用于在开发模式下自动压缩PNG和JPEG图片。

## 主要功能

- 🖼️ 自动检测并压缩PNG/JPEG图片
- 🔥 支持Vite HMR（热模块替换）
- 📁 可配置要监听的图片目录
- 🚫 支持排除特定图片
- 📏 支持最小文件大小限制
- 💾 避免重复压缩已处理的图片

## 安装

确保项目中已安装`tinify`依赖：

```bash
npm install tinify
```

## 配置

在`vite.config.ts`中使用插件：

```typescript
import { defineConfig } from 'vite';
import tinyPngPlugin from './plugins/tinypng/index.js';

export default defineConfig({
  plugins: [
    // 其他插件...
    tinyPngPlugin({
      includeImageSrcDirs: ['assets'], // 指定要压缩的图片目录
      excludeImages: [], // 排除的图片列表
      limitSize: 50 * 1024 // 最小压缩体积(字节)，小于此值的图片不会被压缩
    })
  ]
});
```

## 配置选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `includeImageSrcDirs` | `string[]` | `['assets']` | 指定src下要压缩的图片资源目录 |
| `excludeImages` | `string[]` | `[]` | 排除不想被压缩的图片名称列表 |
| `limitSize` | `number` | `51200` (50KB) | 限制最小压缩体积，小于等于该值的图片不被压缩 |

## 工作原理

1. **开发模式检测**: 插件只在开发模式(`vite serve`)下工作
2. **文件监听**: 通过`handleHotUpdate`钩子监听图片文件变化
3. **智能压缩**: 检查图片是否已压缩、是否符合大小要求等
4. **避免重复**: 使用Set记录已处理文件，避免重复压缩
5. **异步处理**: 压缩过程不阻塞HMR更新

## 从webpack插件的变化

1. **插件架构**: 从webpack的类结构改为vite的函数式插件
2. **钩子函数**: 
   - `webpack.hooks.watchRun` → `vite.buildStart`
   - `webpack.hooks.buildModule` → `vite.handleHotUpdate`
3. **文件监听**: 使用vite的HMR机制替代webpack的编译钩子
4. **配置方式**: 从webpack的`new TinyPng(options)`改为`tinyPngPlugin(options)`

## 注意事项

- 该插件仅在开发模式下工作，生产构建不会触发压缩
- 压缩是异步进行的，不会阻塞开发服务器的HMR
- 压缩结果会保存在`.devp/image`目录下，按开发者区分避免冲突
- 需要有效的TinyPNG API密钥才能正常工作

## 文件结构

```
plugins/tinypng/
├── index.js          # 主插件文件
├── utils/
│   └── image.js      # 图片处理工具函数
└── readme.md         # 本说明文档
```