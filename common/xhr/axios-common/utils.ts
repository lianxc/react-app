import { getUrlParameter } from 'UTILS';
import { DebugInfo } from './types/type';

/**
 * @description: 获取链接上的debug信息
 * @return: {object} {debugUid, token}
 */
function getDebugInfoFromUrl(): DebugInfo {
  const debugInfo: DebugInfo = { debug_uid: '', token: '' };
  const token = getUrlParameter('token');
  const debugUid = getUrlParameter('debug_uid');
  if (token) {
    debugInfo.token = token;
  }
  if (debugUid) {
    debugInfo.debug_uid = debugUid;
  }
  return debugInfo;
}

/**
 * @description: 参数处理
 * @param {object} params 接口传入参数
 * @param {object} mountParams 挂载参数，如：token
 * @return: {object}
 */
function mixParams(params: Record<string, any>, mountParams: Record<string, any>) {
  // 判断参数类型是否是FormData，如果是则将挂载参数添加到参数中
  if (params instanceof FormData) {
    Object.keys(mountParams).forEach((key: string) => {
      params.append(key, mountParams[key]);
    });
  } else {
    params = { ...mountParams, ...params };
  }
  return params;
}

/*
 * @Description: 请求的自定义错误
 * @Author: haven(luohanwen@bigo.sg)
 * @Date: 2019-03-28 22:39:12
 * @LastEditTime: 2019-12-02 15:24:13
 * @param
 * message  错误信息描述
 * name 错误名称 'UnexpectDataType','UnexpectDataCode','RequestError','PendingError'
 * data 额外的数据  UnexpectDataType/UnexpectDataCode data为接口返回的数据   RequestError data为error
 * bigoCustomize 表示自定义的的错误对象 用于区分是否是原生的错误对象
 */
function createError(message: string, name: string, data?: any) {
  class DefinedError extends Error {
    constructor(msg: string) {
      super();
      this.message = msg;
      this.name = name;
      this.bigoCustomize = true;
    }
    data: any;
    bigoCustomize: boolean;
  }
  const definedError = new DefinedError(message);
  if (data) {
    definedError.data = data;
  }
  return definedError;
}

/**
 * @description: 判断是否需要上报sentry
 * @param {number} code code码
 * @param {array} scope sentry上报code码区段
 * @return: {boolean}
 */
function isNeedReport(code: number, scope: number[]) {
  return +code >= scope[0] && +code < scope[1];
}

export { getDebugInfoFromUrl, mixParams, createError, isNeedReport };