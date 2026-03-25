import axios from 'axios';

/**
 * Axios 是一个基于 promise 的 HTTP 库
 * 默认配置为get方法，get方法用params传参，post方法用data传参
 * 更多详细配置请看：https://www.kancloud.cn/yunye/axios/234845
 */

// axios 配置
axios.defaults.timeout = 6000;
axios.defaults.baseURL = '';
axios.defaults.transformRequest = [
  data => Object.entries(data || {})
    .filter(([, value]) => (value !== null && value !== undefined))
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&')
];
// http request 拦截器
axios.interceptors.request.use(config => config, error => Promise.reject(error));

// http response 拦截器
axios.interceptors.response.use(response => response, error => Promise.reject(error));

export default axios;
