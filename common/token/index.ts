/*
 * @Description: get token
 * @Author: haven(luohanwen@bigo.sg)
 * @Date: 2019-03-11 14:32:44
 * @LastEditTime: 2022-07-04 17:04:13
 */
import { Toast } from 'COMPONENTS/Toast';

// 错误提示语
let ERROR_TIP = 'token error. please try again later';

function genareteGetToken() {
  const expire = 5 * 60 * 1e3; // 单位毫秒
  let p: Promise<string> | null = null;
  let lastTime = 0;
  return function getToken() {
    if (p === null || Date.now() - lastTime > expire) {
      lastTime = Date.now();
      p = new Promise((resolve) => {
        resolve('mock-token');
      });
    }
    return p;
  };
}

const getToken = genareteGetToken();

const SET_ERROR_TIP = (msg: string) => {
  ERROR_TIP = msg;
};

export { getToken, SET_ERROR_TIP };
