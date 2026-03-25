/**
 * 命名空间配置
 */
const COMPONENT_PREFIX = 'comp';  // 组件前缀

/**
 * 生成组件命名空间
 * @param componentName 组件名称
 * @returns 命名空间字符串
 */
export const createNamespace = (componentName: string) => {
  return `${COMPONENT_PREFIX}-${componentName}`;
};

/**
 * BEM 类名生成器
 * @param namespace 命名空间
 * @param element 元素名
 * @param modifier 修饰符
 * @returns BEM 类名
 */
export const bem = (
  namespace: string,
  element?: string,
  modifier?: string | string[]
): string => {
  let baseClass = namespace;
  
  // 处理元素
  if (element) {
    baseClass = `${namespace}__${element}`;
  }
  
  // 处理修饰符
  if (!modifier) {
    return baseClass;
  }
  
  if (Array.isArray(modifier)) {
    return modifier
      .filter(m => m)
      .map(m => `${baseClass}--${m}`)
      .join(' ');
  }
  
  return `${baseClass}--${modifier}`;
};

/**
 * 生成完整的 BEM 类名（组件封装版本）
 * @param componentName 组件名称
 * @returns 类名生成函数
 */
export const createBEM = (componentName: string) => {
  const namespace = createNamespace(componentName);
  
  return {
    // 生成块级类名
    b: () => namespace,
    
    // 生成元素类名
    e: (element: string) => `${namespace}__${element}`,
    
    // 生成修饰符类名
    m: (modifier: string | string[]) => {
      if (Array.isArray(modifier)) {
        return modifier.map(m => `${namespace}--${m}`).join(' ');
      }
      return `${namespace}--${modifier}`;
    },
    
    // 生成元素+修饰符
    em: (element: string, modifier: string | string[]) => {
      const elementClass = `${namespace}__${element}`;
      if (Array.isArray(modifier)) {
        return modifier.map(m => `${elementClass}--${m}`).join(' ');
      }
      return `${elementClass}--${modifier}`;
    },
    
    // 条件类名生成
    is: (name: string, condition: boolean) => {
      return condition ? `${namespace}--is-${name}` : '';
    }
  };
};