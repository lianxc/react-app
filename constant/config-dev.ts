export default () => {
  let protocol = '';
  try {
    protocol = window.location.protocol || '';
  } catch (e) {
    console.error(e);
    protocol = '';
  }

  const config: any = {};

  config.buildEnv = 'dev';

  // 本地配置
  // java业务服务
  config.javaApiHost = `https://d1y1q88l9efen2.cloudfront.net`;

  // pear环境
  config.pearEnv = 'gray';

  return config;
};
