import ajaxConstructor from 'COMMON/xhr/axios-common';
import getEnvConfig from 'CONSTANT/get-config';
import { getUrlParameter } from 'COMMON/utils';
import { getToken } from 'COMMON/token';

// 非正式环境可以用 mockConfigEnv 模拟环境
console.log('当前环境配置的常量：', getEnvConfig);

const { VITE_BUILD_ENV } = import.meta.env;

let actId: string | number = getUrlParameter('actId') || 0;

// 调试参数
let debugUid: string | number = '';
if (VITE_BUILD_ENV !== 'prod') {
  debugUid = getUrlParameter('debug_uid') || '3882950024';
}

// 错误提示
const tipsMap = {
  error: 'network error',
  dataException: 'api data error',
  tokenExpired: 'api token error'
};

const javaApi = ajaxConstructor({
  app: 'helloyo',
  debugInfo: { debug_uid: debugUid, token: '' },
  domain: getEnvConfig.javaApiHost,
  tipsMap,
  getTokenMethod: () => getToken()
});

// java接口，用来访问独立部署的新业务接口
function javaApiFn(url: string, options = {}) {
  return (data = {}) => javaApi(url, data, {
    useJSON: true,
    useHeaderToken: true,
    showLoading: true,
    isHandleMsgBySelf: false,
    ...options
  });
}

// 动态获取活动id，调用设置
export const setActId = (cid: number) => actId = cid;
export const getActId = () => actId;

// 业务接口
export const getPearConfig26335 = javaApiFn('/as/common-static/pear/prod/10000000833.json', { isNeedToken: false, statKey: 'getPearConfig' });
export const getPearConfig45397 = javaApiFn('/as/common-static/pear/prod/10000000818.json', { isNeedToken: false, statKey: 'getPearConfig' });

export const rocketHistoryMultiply = javaApiFn('/ta_helloyo_rocket_api/act85175/historyMultiply', { statKey: 'historyMultiply', showLoading: false }); // 获取历史倍率
export const rocketIndex = javaApiFn('/ta_helloyo_rocket_api/act85175/index', { statKey: 'rocketIndex', showLoading: false }); // 页面初始化信息接口
export const rocketStageInfo = javaApiFn('/ta_helloyo_rocket_api/act85175/stageInfo', { statKey: 'rocketStageInfo', showLoading: false, isHandleMsgBySelf: true, timeout: 8000,retryCount: 2,retryDelay: 100 }); // 轮次信息
export const rocketExplodeInfo = javaApiFn('/ta_helloyo_rocket_api/act85175/explodeInfo', { statKey: 'rocketExplodeInfo', showLoading: false, isHandleMsgBySelf: true }); // 倍率信息
export const rocketBet = javaApiFn('/ta_helloyo_rocket_api/act85175/fire', { statKey: 'rocketBet', showLoading: false, isHandleMsgBySelf: true }); // 下注
export const rocketRecycle = javaApiFn('/ta_helloyo_rocket_api/act85175/recycle', { statKey: 'rocketRecycle', showLoading: false, isHandleMsgBySelf: true }); // 回收钻石
export const rocketStageResult = javaApiFn('/ta_helloyo_rocket_api/act85175/stageResult', { statKey: 'stageResult', showLoading: false, isHandleMsgBySelf: true }); // 本轮结果
export const rocketTopFireInfo = javaApiFn('/ta_helloyo_rocket_api/act85175/topFireInfo', { statKey: 'topFireInfo', showLoading: false }); // 投注列表
export const rocketHeartbeat = javaApiFn('/ta_helloyo_rocket_api/act85175/heartbeat', { statKey: 'rocketHeartbeat', showLoading: false, timeout: 8000,retryCount: 2,retryDelay: 100 }); // 心跳保活
export const rocketRankInfo = javaApiFn('/ta_helloyo_rocket_api/act85175/dailyTopRank', { statKey: 'rocketRankInfo', showLoading: true }); // 榜单
export const rocketRecordList = javaApiFn('/ta_helloyo_rocket_api/act85175/myHistory', { statKey: 'rocketRecordList', showLoading: true }); // 记录
