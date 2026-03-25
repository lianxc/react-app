import moduleDefault from './config-default';
import moduleDev from './config-dev';
import moduleTest from './config-test';
import moduleGray from './config-gray';
import moduleProd from './config-prod';


interface ModuleObj {
  [key: string]: Function;
}

/* 获取url或链接字符串中参数 */
const getUrlToken = (name: string, str?: string): string|null => {
  str = str || window.location.href;
  /* eslint-disable-next-line */
  const reg = new RegExp('(?:(?:&|\\?)' + name + '=([^&]*))|(?:/' + name + '/([^/]*))', 'i');
  const r = str.match(reg);
  if (r != null) {
    return (r[1] || r[2] || '').split('#')[0] || '';
  }
  return null;
};

const getConfig = (m: Function|ModuleObj) => {
  if (typeof m === 'function') {
    return m();
  }

  if (typeof m === 'object' && m.default && typeof m.default === 'function') {
    return m.default();
  }
  return {};
};

const tempEnv = import.meta.env.MODE;
let curModule;
switch (tempEnv) {
  case 'dev':
    curModule = moduleDev;
    break;
  case 'test':
    curModule = moduleTest;
    break;
  case 'gray':
    curModule = moduleGray;
    break;
  default:
    curModule = moduleProd;
    break;
}

// 非正式环境构建，可通过页面链接，模拟环境
// 不用include等方法判断，避免prod构建会引入其他环境配置
if (tempEnv === 'dev' || tempEnv === 'test' || tempEnv === 'gray') {
  const mockConfigEnv = getUrlToken('mockConfigEnv');
  if (mockConfigEnv) {
    const envMap: ModuleObj = {
      dev: moduleDev,
      test: moduleTest,
      gray: moduleGray,
      prod: moduleProd
    };

    if (envMap[mockConfigEnv]) {
      curModule = envMap[mockConfigEnv];
    }
  }
}

const mergedConfig = { ...getConfig(moduleDefault), ...getConfig(curModule) };

// 输出当前环境配置
export default mergedConfig;
