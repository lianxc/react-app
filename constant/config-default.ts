export default () => {
  let protocol = '';
  try {
    protocol = window.location.protocol || '';
  } catch (e) {
    console.error(e);
    protocol = '';
  }

  const config: any = {};

  // 默认配置正式环境字段
  config.buildEnv = 'prod';

  config.javaApiHost = `${protocol}//d1y1q88l9efen2.cloudfront.net`;

  config.pearEnv = 'gray';

  return config;
};
