/**
 * 生产环境
 */
;(function () {
  window.SITE_CONFIG = {};

  // 根域名
  window.SITE_CONFIG['indexUrl'] = 'https://www.gdjxch.cn/';
  // api接口请求地址
  window.SITE_CONFIG['baseUrl'] = 'https://www.gdjxch.cn/rensys';
  // 文件地址
  window.SITE_CONFIG['uploadUrl'] = 'https://www.gdjxch.cn/uploadFile/';

  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain']  = './'; // 域名
  window.SITE_CONFIG['version'] = '';   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl']  = window.SITE_CONFIG.domain + window.SITE_CONFIG.version;
})();
