/*
 * @Description: axios plugin
 * @Author: qiuling(qiuling@bigo.sg)
 * @Date: 2019-08-27 12:02:46
 * @LastEditTime: 2021-07-09 10:29:50
 */
import axiosc from 'axios';
import { Toast } from 'COMPONENTS/Toast';
// import * as SentryWrapper from '@bigo/sentry-wrapper';
import { createError, isNeedReport } from './utils';
import { errorNamesEnum } from './constant';

// 需要禁止biz-success插件，否则response-handler无法正常使用
axiosc.defaults.disablePlugins = ['biz-success'];

// sentry上报接口错误
axiosc.interceptors.response.use((response) => {
  const {
    config: { requestConfig },
    data
  } = response;

  // 未配置requestConfig说明非我们业务定义的请求，非我们定义的请求不处理
  if (!requestConfig) {
    return response;
  }

  const dataError = createError('unexpect error', errorNamesEnum.UNEXPECT_ERROR, data);
  // 上报sentry，只上报[5000,6000]区段的错误码
  if (!requestConfig.disableSentry && isNeedReport(+data.code, requestConfig.reportErrCode)) {
    // SentryWrapper.captureException({ category: SentryWrapper.categoryMap.request, error: dataError });
    console.error(dataError);
  }
  return response;
}, (error: Error): Promise<Error> => Promise.reject(error), 'report-response-msg');

// 刷新token
axiosc.interceptors.response.use((response) => {
  const {
    config: { requestConfig },
    data
  } = response;
  // 未配置requestConfig说明非我们业务定义的请求，非我们定义的请求不处理
  if (!requestConfig) {
    return response;
  }
  // 接口token过期
  if (+data.code === requestConfig.codeMap.tokenExpired) {
    Toast(requestConfig.tipsMap.tokenExpired);
    const dataCodeError = createError('unexpect data code', errorNamesEnum.UNEXPECT_DATA_CODE, data);
    return Promise.reject(dataCodeError);
  }
  return response;
}, (error: Error): Promise<Error> => Promise.reject(error), 'refresh-token');

// 接口数据返回格式校验
axiosc.interceptors.response.use((response) => {
  const {
    config: { requestConfig },
    data
  } = response;
  // 未配置requestConfig说明非我们业务定义的请求，非我们定义的请求不处理
  if (!requestConfig) {
    return response;
  }
  // 返回数据不符合规范
  if (typeof data !== 'object' || !data.data || (+data.code === requestConfig.codeMap.ok && Object.prototype.toString.call(data.data) === '[object Array]')) {
    Toast(requestConfig.tipsMap.dataException);
    const dataTypeError = createError('unexpect data type, please provide Object', errorNamesEnum.UNEXPECT_DATA_TYPE, data);
    if (!requestConfig.disableSentry) {
      // SentryWrapper.captureException({ category: SentryWrapper.categoryMap.request, error: dataTypeError });
      console.error(dataTypeError);
    }
    return Promise.reject(dataTypeError);
  }
  return response;
}, (error: Error): Promise<Error> => Promise.reject(error), 'check-data-type');

// 响应处理
axiosc.interceptors.response.use((response) => {
  const {
    config: { requestConfig, isHandleMsgBySelf },
    data
  } = response;

  // 未配置requestConfig说明非我们业务定义的请求，非我们定义的请求不处理
  if (!requestConfig) {
    return response;
  }

  // 接口请求成功(兼容番薯后台接口)
  if (data.code === requestConfig.codeMap.ok || data.error === requestConfig.codeMap.ok) {
    return data.data || {};
  }
  const msg = data.msg || data.message;
  if (!isHandleMsgBySelf && msg) { // 非自己处理错误的接口
    Toast(msg.replace(/\[.*?\]/g, '')); // data.message java接口返回的是message 而且是公共的配置
  }

  const dataCodeError = createError('unexpect data code', errorNamesEnum.UNEXPECT_DATA_CODE, data);
  return Promise.reject(dataCodeError);
}, (error: any = {}) => {
  // SentryWrapper.captureException({ category: SentryWrapper.categoryMap.request, error });
  if (error.data) {
    return Promise.reject(error);
  }
  const config = error.config && error.config.requestConfig;
  const isHandleMsgBySelf = error?.config?.isHandleMsgBySelf;

  if (config && config.tipsMap && config.tipsMap.error && !isHandleMsgBySelf) {
    Toast(config.tipsMap.error);
  }
  const requestError = createError('request error', errorNamesEnum.REQUEST_ERROR, error);
  return Promise.reject(requestError);
}, (error: Error): Promise<Error> => Promise.reject(error), 'response-handle');
