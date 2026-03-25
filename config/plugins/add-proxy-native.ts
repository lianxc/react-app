import * as cheerio from 'cheerio';

function addProxyNative() {
  return {
    name: "AddProxyNative",
    transformIndexHtml(html = '') {
      const $ = cheerio.load(html);
      const str = `<script ignore>/proxy_native/.test(window.location.href)&&document.write('<script src="//h5-yunpan-static.520yundong.cn/as/common-static/libs/native-intercept/1.0.0/test/index.umd.js"<\/' + 'script>')</script>`;
      $('head title').after(str);
      return $.html();
    }
  };
}

export default addProxyNative;
