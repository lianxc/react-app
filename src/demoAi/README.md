# 个税证明组件

这是一个基于图片生成的React组件，用于展示个人所得税纳税证明。

## 组件说明

该组件模拟了一个标准的个人所得税纳税证明，包含以下内容：

- 纳税人基本信息（姓名、身份证号、纳税年度）
- 纳税明细表格
- 应纳税所得额和应纳税额汇总
- 税务机关监制信息

## 使用方法

### 基本用法

```tsx
import TaxProofComponent from './TaxProofComponent';

<TaxProofComponent
  employeeName="张三"
  idNumber="110101199001011234"
  taxYear="2023"
  totalIncome={120000}
  totalTax={14400}
  taxRate={12}
/>
```

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| employeeName | string | '张三' | 纳税人姓名 |
| idNumber | string | '110101199001011234' | 身份证号 |
| taxYear | string | '2023' | 纳税年度 |
| totalIncome | number | 120000 | 应纳税所得额 |
| totalTax | number | 14400 | 应纳税额 |
| taxRate | number | 12 | 税率(%) |

## 样式

组件使用Tailwind CSS进行样式设计，包含以下样式类：

- `.tax-proof-container`: 主容器
- `.header`: 标题区域
- `.info-section`: 信息区域
- `.table-section`: 表格区域
- `.summary-section`: 汇总区域
- `.footer`: 底部信息

## 依赖

- React 18+
- TypeScript
- Tailwind CSS

## 注意事项

1. 该组件为模拟示例，实际使用时需要根据真实税务证明格式调整
2. 数据应从后端API获取，示例中使用了默认值
3. 样式可以根据项目需求进行自定义调整

## 示例

查看 `TaxProofDemo.tsx` 文件了解完整的使用示例。