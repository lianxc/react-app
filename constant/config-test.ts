export default () => {
  let protocol = '';
  try {
    protocol = window.location.protocol || '';
  } catch (e) {
    console.error(e);
    protocol = '';
  }

  const config: any = {};

  config.buildEnv = 'test';

  config.javaApiHost = `${protocol}//d1y1q88l9efen2.cloudfront.net`;

  config.pearEnv = 'gray';

  return config;
};
