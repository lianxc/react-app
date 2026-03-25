import { ErrorNamesEnum, CodeEnum, TipsEnum, GetTokenMethodEnum } from './types/type';

// 异常的错误名称汇总
const errorNamesEnum = ErrorNamesEnum;

// 错误情况对应的提示语，请自行配置
const tipsMap = TipsEnum;

// 响应码对应的情况，请自行配置
const codeMap = CodeEnum;

// sentry上报code码区段5000-5999
const REPORT_ERR_CODE: number[] = [5000, 6000];

// 各APP获取token方法
const getTokenMethodMap = GetTokenMethodEnum;

// eslint-disable-next-line import/prefer-default-export
export {
  errorNamesEnum,
  tipsMap,
  codeMap,
  REPORT_ERR_CODE,
  getTokenMethodMap
};
