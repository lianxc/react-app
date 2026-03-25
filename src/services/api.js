import ajaxConstructor from 'COMMON/axios-common/index';
import { yoDomain } from 'ASSETS/helloyo/js/utils';

const { BUILD_ENV } = process.env;

const tipsMap = {
  error: 'network error',
  dataException: 'api data error',
  tokenExpired: 'api token error'
};

// java项目域名
const javaTestApiDomainMap = {
  // dev: 'https://gateway.helloyo.sg/ta_web_helloyo',
  dev: 'https://test-inner-web-gateway.bigo.sg/ta_web_helloyo_test',
  test: 'https://test-inner-web-gateway.bigo.sg/ta_web_helloyo_test',
  gray: 'https://gateway.helloyo.sg/ta_web_helloyo',
  prod: 'https://gateway.helloyo.sg/ta_web_helloyo'
};

// PHP项目域名
const BASE_URL = {
  dev: '/HelloProxy',
  // dev: 'https://test-app.helloyo.sg',
  test: 'https://test-app.helloyo.sg',
  gray: 'https://app-grey.helloyo.sg',
  prod: 'https://app.helloyo.sg'
};

const ACT_BASE_URL = {
  test: 'https://test-act.helloyo.sg',
  dev: 'https://test-act.helloyo.sg',
  gray: 'https://grey-act.helloyo.sg',
  prod: `https://${yoDomain()}`
};

const phpApi = ajaxConstructor({
  app: 'helloyo',
  domain: BASE_URL[BUILD_ENV] || '',
  tipsMap,
  disablePlugins: ['check-data-type'] // 兼容旧接口返回数据格式不规范，此处不检查
});

const actJavaTestApi = ajaxConstructor({
  app: 'helloyo',
  domain: javaTestApiDomainMap[BUILD_ENV] || '',
  tipsMap
});

const options = {
  showLoading: false,
  useJSON: true,
  useHeaderToken: true
};

export {
  BASE_URL
};

export default {
  getGoodsList: (data) => phpApi('/act/sharePullNew/goodsList', data, { options, ...{ useJSON: false, isHandleMsgBySelf: true } }), // 获取棒棒糖礼物列表

  getShortLink: (data) => actJavaTestApi('/shortLink/change/longToShort', data, { ...options, ...{ showLoading: true } }), // 长链换短链

  checkSharePullNew: (data) => phpApi('/act/sharePullNew/check', data, {
    ...options,
    ...{
      showLoading: true,
      useJSON: false,
      isHandleMsgBySelf: true,
      useHeaderToken: false
    }
  }), // 检查分享

  getDisplayInfo: (data) => phpApi('/act/sharePullNew/getDisplayInfo', data, {
    ...options,
    ...{
      showLoading: true,
      useJSON: false,
      useHeaderToken: false,
      isNeedToken: false
    }
  }), // 获取信息

  checkShare: (data) => phpApi('/act/sharePullNew/share', data, {
    ...options,
    ...{
      useJSON: false,
      useHeaderToken: false,
      isHandleMsgBySelf: true,
      isNeedToken: false
    }
  }), // 检查分享

  // 获取分享页面html
  shareLink: () => `${ACT_BASE_URL[BUILD_ENV]}/Common/renderShare/share`,

  getUserInfo: (data) => actJavaTestApi('/act51286/getUserInfo', data, { ...options, ...{ showLoading: true } }), // 获取用户信息

  receiveAward: (data) => actJavaTestApi('/act51286/receiveAward', data, { ...options, ...{ showLoading: true } }) // 领取奖励
};
