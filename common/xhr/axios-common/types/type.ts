enum ErrorNamesEnum {
  UNEXPECT_DATA_CODE = 'UnexpectDataCode',
  UNEXPECT_ERROR = 'UnexpectError',
  REQUEST_ERROR = 'RequestError',
  PENDING_ERROR = 'PendingError',
  CLIENT_API_ERROR = 'ClientApiError',
  UNEXPECT_DATA_TYPE = 'UnexpectDataType'
}

enum CodeEnum {
  TOKEN_EXPIRED = 1001, // token过期
  OK = 0 // 成功
}

enum TipsEnum {
  ERROR = '你的网络出小差了，请稍后再试!!!',
  DATA_EXCEPTION = '数据异常，请稍后重试',
  TOKEN_EXPIRED = 'token过期，请重试'
};

// 各APP获取token方法
enum GetTokenMethodEnum {
  HELLO = 'getHelloToken', // hello
  HELLOYO = 'getHelloyoToken', // helloyo
  YUANYUAN = 'getYuanyuanToken', // yuanyuan
  CUPID = 'getCupidToken', // cupid
  FIRE = 'getFireToken', // fire
  LUD = 'getLudoToken', // ludo
  XIAOERWO = 'getXiaoerwoToken' // xiaoerwo
};

interface DebugInfo {
  debug_uid: string; // 调试uid
  token: string; // token
}

interface DefaultConfig {
  disableFormat: boolean; // 是否全局关闭yapi接口校验
  disableSentry: boolean; // 是否关闭sentry上报，不建议关闭
  disableHandleReject: boolean; // 是否关闭自动处理rejection情况
  tipsMap: Record<string, string>;
  codeMap: typeof CodeEnum;
  domain: string; // 接口域名
  formatTpl: undefined; // yapi校验数据
  app: string; // hello、helloyo、yuanyuan、xiaoerwo
  debugInfo: DebugInfo; // 调试信息
  reportErrCode: number[]; //  sentry上报code码区段
  disablePlugins: string[]; // 禁止插件
  getTokenMethod: () => Promise<string>;
  isNeedToken: boolean;
};

// 默认参数
interface DefaultOptions {
  type?: 'post' | 'get' | 'put' | 'delete'; // 请求方式
  showLoading?: boolean; // 展示loading
  hyHomeLoading?: boolean; // helloyo主页loading
  isHandleMsgBySelf?: boolean; // 是否自己处理错误
  proxy?: string; // 为了实现不同api代理到不同的环境
  timeout?: number; // 超时时间
  headers?: Record<string, string>; // 请求头
  useJSON?: boolean; // 是否使用json类型传递数据
  useHeaderToken?: boolean; // 是否在header中带上token
  isNeedToken?: boolean; // 如果活动不需要token，请设置为false
  format?: boolean; // 是否开启数据校验
  disablePlugins?: string[]; // 禁止插件，权重高于全局参数
  withCredentials?: boolean; // 接口是否携带cookie
  isNeedMixParamsWithToken?: boolean; // 是否需要在body带上token
};

export { ErrorNamesEnum, CodeEnum, TipsEnum, GetTokenMethodEnum, DebugInfo, DefaultConfig, DefaultOptions };