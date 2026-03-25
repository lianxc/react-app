import initConfig from './init';

const projectName = initConfig.__ACT_NAME__;
const host = `https://test-inner-web-gateway.bigo.sg/ta_temp_web_hello_test`;
const pathRewrite = '';

export default {
  projectName,
  assetsPath: {
    dev: '',
    test: '/live/helloyo',
    gray: '/live/helloyo',
    prod: '/live/helloyo',
    preprod: '/live/helloyo/preprod',
    deploy: '/live/helloyo/deploy'
  },
  sourceMapPublicPath: `https://frontmon-sysop.helloyo.sg/map/m-weihuitel-com/sourcemaps/helloyo/${projectName}/`,
  proxyConfig: {
    '/HelloProxy': {
      target: host,
      changeOrigin: true,
      ws: true,
      secure: false,
      rewrite: (path: string) => path.replace(new RegExp('^/HelloProxy'), pathRewrite),
    }
  }
};
