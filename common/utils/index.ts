/**
 * @description: px转成rem单位
 * @param {number} 像素值
 * @return: string 转成rem的值带rem单位
 */
export const pxToRem = (px: number) => `${px / 75}rem`;

export const getUrlParameter = (name: string) => {
  const url = window.location.search;
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  const r = url.substr(1).match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return null;
};