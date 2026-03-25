import path from 'path';
import { rootPath } from './utils';

const alias = {
  'COMMON': 'common',
  'ASSETS': 'common/assets',
  'XHR': 'common/xhr',
  'UTILS': 'common/utils',
  'SENTRY': 'common/sentry',
  'STATIC': 'static',
  'MONITOR': 'common/monitor',
  'COMPONENTS': 'common/components',
  '@': 'src',
  '@src': 'src',
  '@interface': 'src/interface',
  '@assets': 'src/assets',
  '@views': 'src/views',
  '@components': 'src/components',
  '@services': 'src/services',
  '@constant': 'src/constant',
  '@lang': 'src/lang',
  '@hooks': 'src/hooks',
  '@pages': 'src/pages',
};

export default Object.entries(alias).reduce((acc, [key, value]) => {
  acc[key] = path.resolve(rootPath, value as string);
  return acc;
}, {} as Record<string, string>);
