/**
 * @description: px转成rem单位
 * @param {number} 像素值
 * @return: string 转成rem的值带rem单位
 */
export const pxToRem = (px: number) => `${px / 75}rem`;