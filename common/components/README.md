# React 移动端组件库

这是一个基于 React 的移动端组件库，包含基础组件和业务组件。

## 安装依赖

部分组件需要额外的依赖：

```bash
# 页面截图组件需要
npm install html2canvas

# 生成二维码组件需要
npm install qrcode
npm install @types/qrcode --save-dev
```

## 基础组件

### BaseInput

输入框组件，支持校验、最大最小值约束等功能。

```tsx
import { BaseInput } from './components';

<BaseInput
  value={value}
  placeholder="请输入"
  type="number"
  min={0}
  max={100}
  required
  validator={(val) => val.length > 5 || '长度必须大于5'}
  onChange={(val, isValid, error) => {
    console.log(val, isValid, error);
  }}
/>
```

### BaseScroll

滚动组件，支持滚动加载、上拉加载、下拉刷新等功能。

```tsx
import { BaseScroll } from './components';

<BaseScroll
  onLoadMore={async () => {
    // 加载更多数据
  }}
  onRefresh={async () => {
    // 刷新数据
  }}
  hasMore={true}
  loading={false}
>
  {/* 内容 */}
</BaseScroll>
```

### BaseModal

弹窗组件，支持模态框功能。

```tsx
import { BaseModal } from './components';

<BaseModal
  visible={visible}
  onClose={() => setVisible(false)}
  title="标题"
  maskClosable={true}
>
  {/* 内容 */}
</BaseModal>
```

### BaseImg

图片组件，支持指定尺寸、链接自动转 https 等功能。

```tsx
import { BaseImg } from './components';

<BaseImg
  src="http://example.com/image.jpg"
  width={200}
  height={200}
  fit="cover"
  lazy={true}
/>
```

### BaseButton

按钮组件，支持按钮组功能。

```tsx
import { BaseButton, BaseButtonGroup } from './components';

<BaseButton type="primary" size="large" onClick={handleClick}>
  按钮
</BaseButton>

<BaseButtonGroup>
  <BaseButton>按钮1</BaseButton>
  <BaseButton>按钮2</BaseButton>
</BaseButtonGroup>
```

### BaseForm

表单组件，支持表单验证功能。

```tsx
import { BaseForm } from './components';

<BaseForm
  onSubmit={(values) => {
    console.log(values);
  }}
  initialValues={{ name: '', age: '' }}
>
  <BaseForm.Item
    name="name"
    label="姓名"
    rules={[{ required: true, message: '请输入姓名' }]}
  >
    <BaseInput />
  </BaseForm.Item>
</BaseForm>
```

### BaseTabs

标签页组件，支持标签页切换功能。

```tsx
import { BaseTabs } from './components';

<BaseTabs
  items={[
    { key: '1', label: '标签1', children: <div>内容1</div> },
    { key: '2', label: '标签2', children: <div>内容2</div> },
  ]}
  defaultActiveKey="1"
  onChange={(key) => console.log(key)}
/>
```

## 业务组件

### Toast

提示组件，支持传入文本、弹出时长、回调函数等功能。

```tsx
import { toast } from './components';

// 使用静态方法
toast.success('成功提示');
toast.error('错误提示');
toast.warning('警告提示');
toast.info('信息提示');

// 自定义
toast.show({
  text: '自定义提示',
  duration: 3000,
  type: 'success',
  onClose: () => console.log('关闭了'),
});
```

### LotteryWheel

抽奖转盘组件，使用 requestAnimationFrame 实现动画效果。

```tsx
import { LotteryWheel } from './components';

<LotteryWheel
  prizes={[
    { id: 1, name: '奖品1', bgColor: '#ff6b6b' },
    { id: 2, name: '奖品2', bgColor: '#4ecdc4' },
  ]}
  onResult={(prize) => {
    console.log('中奖:', prize);
  }}
  duration={3000}
/>
```

### LotteryGrid

九宫格抽奖组件，使用定时器和 requestAnimationFrame 实现。

```tsx
import { LotteryGrid } from './components';

<LotteryGrid
  prizes={[
    { id: 1, name: '奖品1', icon: '/icon1.png' },
    { id: 2, name: '奖品2', icon: '/icon2.png' },
    // ... 至少8个奖品
  ]}
  onResult={(prize) => {
    console.log('中奖:', prize);
  }}
  duration={3000}
/>
```

### Marquee

跑马灯组件，支持传入文本、文本颜色、文本大小、文本行数等功能。

```tsx
import { Marquee } from './components';

<Marquee
  text="这是一段跑马灯文字"
  color="#333"
  fontSize={16}
  lineCount={2}
  speed={50}
  direction="left"
/>
```

### Screenshot

页面截图组件，使用 html2canvas 实现。

```tsx
import { Screenshot, captureScreenshot } from './components';

// 组件方式
<Screenshot
  selector="#target-element"
  width={800}
  height={600}
  onCapture={(dataUrl) => {
    console.log('截图完成:', dataUrl);
  }}
>
  <div>要截图的内容</div>
</Screenshot>

// 静态方法
const dataUrl = await captureScreenshot('#target-element', {
  width: 800,
  height: 600,
  quality: 1,
  format: 'png',
});
```

### QRCode

生成二维码组件，使用 qrcode.js 实现。

```tsx
import { QRCode, generateQRCode } from './components';

// 组件方式
<QRCode
  text="https://example.com"
  size={200}
  colorDark="#000000"
  colorLight="#ffffff"
  correctLevel="M"
  onGenerated={(dataUrl) => {
    console.log('二维码生成完成:', dataUrl);
  }}
/>

// 静态方法
const dataUrl = await generateQRCode('https://example.com', {
  size: 200,
  colorDark: '#000000',
  colorLight: '#ffffff',
  correctLevel: 'M',
});
```

## 注意事项

1. **Screenshot** 和 **QRCode** 组件使用了动态导入，需要确保已安装对应依赖
2. 所有组件都支持 TypeScript
3. 组件样式使用 CSS 文件，可以根据需要自定义
4. 移动端组件已考虑触摸事件和响应式设计

