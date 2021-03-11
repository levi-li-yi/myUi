// 在html文件注入配置文件
class HtmlInjectConfigPlugin {
  constructor(baseUrl = '') {
    this.files = [baseUrl + 'config.js?t=' + (new Date().getTime())]
  }

  apply (compiler) {
    compiler.hooks.compilation.tap()
  }
}