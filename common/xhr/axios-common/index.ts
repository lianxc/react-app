/*
 * @Description: 封装一层axios，实现功能如下
   1.参数统一增加token（可配置）
   2.token过期统一提示，并刷新token
   3.活动过期统一处理
   4.处理接口成功返回数据，直接将code为成功码的data返回
   5.接口返回数据时，如果code为异常码，统一toast提示（可配置），并reject数据
   6.接口请求异常统一toast提示
   reject数据格式说明 一个自定义的Error对象，除了通用的name(具体定义查看constant.js errorNamesEnum),message,附加的数据绑定到data属性里
 * @Author: haven(luohanwen@bigo.sg)
 * @Date: 2019-03-19 12:03:25
 * @LastEditTime: 2023-03-31 11:59:40
 */
import { errorNamesEnum, tipsMap, codeMap, REPORT_ERR_CODE, getTokenMethodMap } from './constant';
import { getDebugInfoFromUrl, mixParams, createError } from './utils';
import { DebugInfo, DefaultConfig, DefaultOptions } from './types/type';
import axiosc from '@bigo/axios-common';
import Loading from 'COMPONENTS/base/loading';
import HomeLoading from 'COMPONENTS/helloyo/HomeLoading';
import * as TokenUtil from 'TOKEN';
import 'axios';
import './plugin';

// 是否开发环境
const IS_DEV = process.env.NODE_ENV === 'development'; // development、production
// 是否开发+提测环境
const IS_DEV_TEST = process.env.BUILD_ENV === 'dev' || process.env.BUILD_ENV === 'test'; // dev test prod

// 默认接口域名
let apiDomain: string;
if (typeof __GLOBAL_API_DOMAIN__ === 'undefined') {
  apiDomain = 'https://act.ppx520.com';
} else {
  apiDomain = __GLOBAL_API_DOMAIN__;
}

/*
* 兼容axiosc不支持json问题
* 需要在设置里把useJson字段设置为true
*/
function polyfillJsonType() {
  const axioscTransformRequest = axiosc.defaults.transformRequest[0];
  axiosc.defaults.transformRequest[0] = (data, headers) => {
    // eslint-disable-next-line no-underscore-dangle
    if (typeof data === 'object' && data.__useJson) { // 判断content-type 是否是json类型
      headers['Content-Type'] = 'application/json;charset=utf-8';
      // eslint-disable-next-line no-underscore-dangle
      delete data.__useJson;
      return JSON.stringify(data);
    }
    return axioscTransformRequest(data);
  };
}

// axiosc请求的promise状态map
const REQUEST_PROMISE_STATUS_MAP: Record<string, any> = {};
/* ------------- 配置项 over ------------- */

polyfillJsonType();

/**
 * @description: ajaxConstructor
 * @param {Partial<DefaultConfig>} initConfig 用户配置项，可覆盖默认配置
 * @return {function} api统一入口：请求参数统一增加token
 */
export default function ajaxConstructor(initConfig: Partial<DefaultConfig> = {}) {
  // 默认全局配置参数
  const DEFAULT_CONFIG: DefaultConfig = {
    app: 'hello', // hello、helloyo、yuanyuan、xiaoerwo
    domain: apiDomain, // 接口域名
    isNeedToken: true,
    tipsMap,
    codeMap,
    getTokenMethodMap,
    debugInfo: { debug_uid: '3217416026', token: '' } as DebugInfo, // 调试信息
    formatTpl: undefined, // yapi校验数据
    reportErrCode: REPORT_ERR_CODE, //  sentry上报code码区段
    disablePlugins: [], // 禁止插件
    disableFormat: false, // 是否全局关闭yapi接口校验
    disableSentry: false, // 是否关闭sentry上报，不建议关闭
    disableHandleReject: false, // 是否关闭自动处理rejection情况
  };
  // 开发环境和测试环境中允许用户在链接中配置debug信息
  if (IS_DEV_TEST) {
    initConfig.debugInfo = {
      ...DEFAULT_CONFIG.debugInfo,
      ...initConfig.debugInfo,
      ...getDebugInfoFromUrl()
    };
  }
  // 合并用户配置项和默认配置项
  const globalConfig: DefaultConfig = { ...DEFAULT_CONFIG, ...initConfig };
  const getTokenMethod = globalConfig.getTokenMethodMap[globalConfig.app] || globalConfig.getTokenMethodMap.HELLO;

  /**
   * @description: api统一入口：请求参数统一增加token
   * @param {string} url 接口链接
   * @param {object} params 参数
   * @param {object} options 配置
   */
  function api(url: string, params: Record<string, any> = {}, options: Partial<DefaultOptions> = {}) {
    // 默认请求参数
    const defaultOptions: DefaultOptions = {
      type: 'post', // 请求方式
      showLoading: false, // 展示loading
      hyHomeLoading: false, // helloyo主页loading
      isHandleMsgBySelf: false, // 是否自己处理错误
      proxy: undefined, // 为了实现不同api代理到不同的环境
      timeout: 15000, // checklist 应对5%左右的接口超时失败（ios、电信） 暂时修改默认超时未15s
      headers: {}, // 请求头
      useJSON: false, // 是否使用json类型传递数据
      useHeaderToken: false, // 是否在header中带上token
      isNeedToken: true, // 如果活动不需要token，请设置为false
      format: true, // 是否开启数据校验
      disablePlugins: [], // 禁止插件，权重高于全局参数
      withCredentials: false, // 接口是否携带cookie
      isNeedMixParamsWithToken: true // 是否需要在body带上token
    };

    const {
      type,
      isHandleMsgBySelf,
      isNeedToken,
      showLoading,
      hyHomeLoading,
      proxy,
      timeout,
      format,
      disablePlugins = [],
      withCredentials,
      useJSON,
      headers = {},
      useHeaderToken,
      isNeedMixParamsWithToken
    } = { ...defaultOptions, ...options };

    // __useJson 私有属性 标识使用json类型传递数据 会在polyfillJsonType方法里删除
    if (useJSON && typeof params === 'object') {
      // eslint-disable-next-line no-underscore-dangle
      params.__useJson = true;
    } else if (typeof params === 'object') {
      // eslint-disable-next-line no-underscore-dangle
      params.__useJson = undefined;
    }

    const axiosRequest = function axiosRequest() {
      // 增加去掉重复请求逻辑（相同接口，相同参数的请求只有在一条请求完成后才能继续请求）
      const promiseKey = `${url}${params ? JSON.stringify(params) : ''}`;
      REQUEST_PROMISE_STATUS_MAP[promiseKey] = REQUEST_PROMISE_STATUS_MAP[promiseKey] || {};
      const promiseStatus = REQUEST_PROMISE_STATUS_MAP[promiseKey];

      // 为了实现不同api代理到不同的环境
      const baseURL = proxy && IS_DEV ? proxy : globalConfig.domain;

      // 接口请求中
      if (!promiseStatus.isPending) {
        promiseStatus.isPending = true;
        return axiosc({
          url,
          method: type,
          data: params,
          timeout,
          baseURL,
          headers,
          requestConfig: globalConfig, // 请求配置信息
          format,
          withCredentials,
          isHandleMsgBySelf, // 是否自己处理错误
          disablePlugins: disablePlugins.length ? disablePlugins : globalConfig.disablePlugins, // 若接口请求配置了禁止的插件则按照接口配置来，若未设置则按照全局来
          onPendingChange(bool: boolean) {
            if (showLoading) {
              if (bool) {
                Loading(true);
              } else {
                Loading(false);
              }
            }
            if (hyHomeLoading) {
              if (bool) {
                HomeLoading(true);
              } else {
                HomeLoading(false);
              }
            }
            if (!bool) {
              promiseStatus.isPending = false;
            }
          }
        });
      }
      return Promise.reject(createError(`${url} request is pending`, errorNamesEnum.PENDING_ERROR));
    };

    // 本地开发环境传递debug_uid方便调试，以全局设置为准
    // 测试环境，如果链接有拼接debug_uid，则使用模拟的debug_uid
    const IS_TEST_MOCK = IS_DEV_TEST && getDebugInfoFromUrl().debug_uid;
    if (globalConfig.isNeedToken && isNeedToken && (IS_DEV || IS_TEST_MOCK)) {
      if (isNeedMixParamsWithToken) {
        params = mixParams(params, globalConfig.debugInfo);
      }
    } else if (globalConfig.isNeedToken && isNeedToken && TokenUtil[getTokenMethod]) {
      return TokenUtil[getTokenMethod]().then((token: string) => {
        if (isNeedMixParamsWithToken) {
          params = mixParams(params, { token });
        }
        if (useHeaderToken) {
          headers['X-Auth-Token'] = token || '';
        }
        return axiosRequest();
      }, (error: Error) => {
        const wrapError = createError('client api error', errorNamesEnum.CLIENT_API_ERROR, error);
        return Promise.reject(wrapError);
      });
    }

    return axiosRequest();
  }

  return (url: string, ...otherParams: any[]): Promise<any> => {
    const p = api(url, ...otherParams);
    const { then } = p;

    // 允许关闭自动处理rejection情况
    if (!globalConfig.disableHandleReject && then && typeof then === 'function') {
      // 若接口调用时没有处理rejection情况，自动加入rejected function
      p.then = (fulfilled: Function, rejected: Function) => {
        const defaultRected = (err: Error) => {
          console.log(err);
        };
        return then.call(p, fulfilled, rejected || defaultRected);
      };
    }
    return p;
  };
}
