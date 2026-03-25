import { readFileSync, readdirSync, writeFile as _writeFile } from 'fs';
import { sep, join } from 'path';
import { createHash } from 'crypto';
import { execa } from 'execa';

// 图片信息保存目录
const FOLDERPATH = '.devp/image';

// 图片信息按开发者区分
const imageInfoMap = {};
let imgInfo = {};

function getFileMd5(filePath) {
  const fileData = readFileSync(filePath.replace('/', sep));
  const hash = createHash('md5').update(fileData);
  return hash.digest('hex');
}

// 从文件重新获取最新的图片信息
export const imageRefresh = () => {
  const getFiles = () => {
    // 这里根据开发者区分文件，避免冲突
    const files = readdirSync(FOLDERPATH) || [];
    return files
      .filter(v => /\.json$/.test(v))
      .map(v => join(FOLDERPATH, v));
  };

  const readFile = file => {
    try {
      return readFileSync(file, 'utf8');
    } catch (err) {
      return '';
    }
  };

  const files = getFiles();
  files.forEach(v => {
    imageInfoMap[v] = JSON.parse(readFile(v) || '{}');
  });

  // 获取图片信息文件
  imgInfo = Object.keys(imageInfoMap)
    .map(v => imageInfoMap[v])
    .reduce((a, b) => {
      const item = { ...a };
      for (const x in b) {
        // 如果不同文件有相同的图片，需要变成一个数组
        if (item[x]) {
          if (Array.isArray(item[x])) {
            item[x] = [...item[x], b[x]];
          } else {
            item[x] = [item[x], b[x]];
          }
        } else {
          item[x] = b[x];
        }
      }

      return item;
    }, {});
};

// 写入文件
export const setFile = async infos => {
  // 兼容单个文件或者多个文件
  if (!Array.isArray(infos)) {
    infos = [infos];
  }

  const { stdout: username } = await execa('git', ['config', 'user.name']);
  const myFile = `${FOLDERPATH}/${username}.json`;
  const myFileInfo = imageInfoMap[myFile] || {};
  infos.forEach(({ file, data }) => {
    myFileInfo[file] = getFile(file) || {};
    myFileInfo[file]['md5'] = getFileMd5(file);
    myFileInfo[file]['png'] = readFileSync(file).length;
    myFileInfo[file] = { ...myFileInfo[file], ...data };
    imgInfo[file] = { ...myFileInfo[file] };
  });
  imageInfoMap[myFile] = { ...myFileInfo };

  const writeFile = async data => {
    return new Promise((resolve, reject) => {
      _writeFile(myFile, JSON.stringify(data, undefined, 4), err => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }
        resolve();
      });
    });
  };

  // 重新排序
  const json = {};
  Object.keys(myFileInfo)
    .sort()
    .forEach(v => {
      json[v] = myFileInfo[v];
    });
  await writeFile(json);
};

// 获取图片信息
export const getFile = file => {
  const md5 = getFileMd5(file);

  // 如果存在相同的文件，则以md5为准，这种情况通常是多人开发时，同时改到同一张图片导致的
  if (Array.isArray(imgInfo[file]) && imgInfo[file].length > 0) {
    return imgInfo[file].find(v => v.md5 === md5);
  }

  if (imgInfo[file] && imgInfo[file]['md5'] === md5) {
    return imgInfo[file];
  }
};
