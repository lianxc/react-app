import dayjs from 'dayjs';
import * as cheerio from 'cheerio';

function addDebugPlugin() {
  return {
    name: "AddDebug",
    transformIndexHtml(html = '') {
      const $ = cheerio.load(html);
      const currentTime = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');

      const erudaStr = `<script>(!/(eruda=false)|(eruda=close)/.test(window.location))&&(document.write('<script src="//h5-yunpan-static.520yundong.cn/as/hello-static/debug/eruda.min.js"><\/' + 'script>'),document.write('<script src="//h5-yunpan-static.520yundong.cn/as/hello-static/debug/eruda-check-gray.js?t=' + Date.now() + '"><\/' + 'script>'),document.write('<script src="https://h5-yunpan-static.520yundong.cn/as/hello-static/coverage/prod/eruda-bigo-coverage.js?t=' + Date.now() + '"></' + 'script>'),document.write("<script>eruda.init(); eruda.add(erudaCheckGray(eruda, {isExcludeApiFn: function(url) {return /(\\\\\/\\\\\/support-json)|(\\\\\.svga$)|(com\\\\\/api\\\\\/call$)/.test(url)}})); eruda.add(erudaBigoCoverage); setTimeout(() => {eruda.scale(window.lib.flexible.dpr);}, 500);<\/" + "script>"));</script>`
      const performanceStr = `<script>!/(performance=false)|(performance=close)/.test(window.location.href)&&(document.write('<script src="//h5-yunpan-static.520yundong.cn/as/common-static/libs/performance-tool/1.0.0/index.umd.min.js"><\/' + 'script>'),document.write("<script>var performanceTool = new PerformanceTool();  performanceTool.init();<\/" + "script>"));</script>`
      
      $('head title').after(`<script>console.log("该页面的构建时间：", "${currentTime}");</script>`);
      $('head title').after(erudaStr);
      $('body').append(performanceStr);
   
      return $.html();
    }
  };
}

export default addDebugPlugin;
