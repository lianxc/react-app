// src/types/custom.d.ts
import 'react';

declare module 'react' {
  interface HTMLAttributes<T> {
    /**
     * 支持 CSS Modules 的 styleName 属性
     */
    styleName?: string;
  }
}