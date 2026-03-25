/*
 * wiki:http://wiki.bigo.sg:8090/pages/viewpage.action?pageId=963773921
 * Vite Plugin for TinyPNG Image Compression
 */
import path from 'path';
import fs from 'fs';
import tinify from 'tinify';
import { imageRefresh, getFile, setFile } from './utils/image';

const rootPath = fs.realpathSync(process.cwd()); // 项目根目录

// 随机获取 token 池里面的 token
const TOKEN = (() => {
  const tokens = [
    'kvbknl8ktQmsGr3Vdy7HcP4sx4V7sJYC',
    '2zqWlQ4FdkVphBvWQrw2dCbtk9thh9g7',
    '8W0r81WZ8PsnPxs5f4Nf4CChqzzmPBMS',
    '5JDDZZ9h7mR2fPrGpNnq9tW1Kzln4m1l',
    'GmKLJQkF7nzv47hKMDBp9PWvrCvFwqyL',
    'ryvq0PB9jg3ltbkPX9rj5PrjzpRLKJzV',
    'schsT6qKy9JjRtwccg3TbgNtKXLHGW46',
    'MKwLN0lLPt6GN4cDYGBcQxF31qjjhql6',
    'pspRc7lZ9pLSYMW0GQ7TChX0jLpn6bds',
    'Ttz8kBqG0z93LSsZqSMPKTQm0L9HM7bx'
  ];
  const index = Math.floor(Math.random() * tokens.length);
  return tokens[index];
})();

const ERROR_MSG_BY_TYPE = {
  AccountError: '认证失败，您是否设置了API密钥',
  ClientError: '请检查您的源图像和设置',
  ServerError: 'TinyPNG API当前不可用',
  ConnectionError: '发生网络问题，请检查您的互联网连接'
};

// node api压缩图片
// api 文档 https://tinypng.com/developers/reference
const makeTinyPng = async file => {
  // 先校验api key
  const validate = () => {
    return new Promise((resolve, reject) => {
      tinify.key = TOKEN;
      tinify.validate(function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };

  // 压缩图片
  const compressImg = file => {
    return new Promise((resolve, reject) => {
      tinify.fromFile(file).toFile(file, (error) => {
        if (error) {
          reject(error);
          if (error instanceof tinify.AccountError) {
            console.log(ERROR_MSG_BY_TYPE.AccountError);
          } else if (error instanceof tinify.ClientError) {
            console.log(ERROR_MSG_BY_TYPE.ClientError);
          } else if (error instanceof tinify.ServerError) {
            console.log(ERROR_MSG_BY_TYPE.ServerError);
          } else if (error instanceof tinify.ConnectionError) {
            console.log(ERROR_MSG_BY_TYPE.ConnectionError);
          } else {
            console.log(error.message);
          }
        } else {
          resolve();
        }
      });
    });
  };

  await validate();
  return await compressImg(file);
};

const isTinypnged = file => {
  const target = getFile(file);
  return target ? target.tinypng : false;
};

const isLimitSize = (file, limitSize) => {
  const fileSize = fs.statSync(file).size;
  return fileSize <= limitSize;
};

const isExcludeImage = (file, excludeImages) => excludeImages.some(image => file.indexOf(image) !== -1);

// 路径统一处理用'/'分隔
const sepFilePath = file => file.replace(path.sep, '/');

// 检查文件是否是目标图片
const isTargetImage = (filePath, includeImageSrcDirs) => {
  if (typeof includeImageSrcDirs === 'string') {
    includeImageSrcDirs = [includeImageSrcDirs];
  }
  const regList = includeImageSrcDirs.map((dir) => new RegExp(`^\\./src/${dir}[\\S\\s]*.(jpe?g|png)$`));
  return regList.some((reg) => reg.test(sepFilePath(filePath.replace(rootPath, '.'))));
};

// 处理图片压缩的函数
const processImages = async (files, options) => {
  const succFileInfo = [];
  
  try {
    await Promise.all(
      files.map(async file => {
        // 这里使用相对路径，主要对应生成json key
        const relativePath = sepFilePath(file.replace(rootPath + path.sep, ''));
        
        if (!isTinypnged(relativePath) && 
            !isLimitSize(file, options.limitSize) && 
            !isExcludeImage(file, options.excludeImages)) {
          
          await makeTinyPng(file);
          succFileInfo.push({
            file: relativePath,
            data: { tinypng: true }
          });
          
          // 延迟输出日志，避免阻塞
          setTimeout(() => {
            console.log(`${file} tinypng 压缩完成`);
          }, 2000);
        }
      })
    );

    await setFile(succFileInfo);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Vite Plugin for TinyPNG Image Compression
 * @param {Object} options 配置选项
 * @returns {Object} Vite plugin object
 */
export default function tinyPngPlugin(options = {}) {
  const pluginOptions = Object.assign({
    includeImageSrcDirs: ['assets'], // 指定src下压缩图片资源目录，默认只压缩assets目录下的图片
    excludeImages: [], // 排除不想被压缩的图片名称列表，如['banner.png', 'tab1/bg.png']
    limitSize: 50 * 1024 // 限制最小压缩体积，默认50kb，小于等于该值图片不被压缩
  }, options);

  let isDevMode = false;
  const processedFiles = new Set(); // 避免重复处理

  return {
    name: 'vite-plugin-tinypng',
    configResolved(config) {
      isDevMode = config.command === 'serve';
    },
    buildStart() {
      // 只在开发模式下启用
      if (!isDevMode) return;
      
      // 刷新 imginfo，主要预防切换分支或者拉取分支的时候，imginfo 没有更新
      imageRefresh();
    },
    async handleHotUpdate({ file }) {
      console.log('handleHotUpdate file:', file);
      // 只在开发模式下处理
      if (!isDevMode) return;
      
      // 检查是否是目标图片文件
      if (isTargetImage(file, pluginOptions.includeImageSrcDirs) && !processedFiles.has(file)) {
        processedFiles.add(file);
        
        // 异步处理图片压缩，不阻塞HMR
        setImmediate(async () => {
          try {
            await processImages([file], pluginOptions);
          } catch (error) {
            console.error('TinyPNG compression failed:', error);
          }
        });
      }
    }
  };
}
