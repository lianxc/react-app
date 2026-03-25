'use strict';
import fs from 'fs';
import path from 'path';
import { rootPath } from './utils';

// 获取entry，根据entry文件夹里的js文件名提取入口名称并生成入口配置
export const getEntries = () => {
  const entryPath = path.resolve(rootPath, 'src/entry');
  const entryNames = fs
    .readdirSync(entryPath)
    .filter(n => /\.tsx$/g.test(n))
    .map(n => n.replace(/\.tsx$/g, ''));
  const entryMap: Record<string, string> = {};
  entryNames.forEach(name => {
    entryMap[name] = path.resolve(rootPath, `./src/${name}.html`);
  });
  return entryMap;
};
