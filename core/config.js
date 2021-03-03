// 工程配置
const fs = require('fs')
const utils = require('./utils')
const core = require('./index')
const merge = require('lodash/merge')

const configPath = utils.join(core.ProjectRootPath, 'my.config.js')
let myConfig = null

// 若工程根目录中已存在my.config.js文件，则读取配置文件，合并到配置信息中
if (!myConfig && fs.existsSync(configPath)) {
  myConfig = core.IsInstalled ? require('../../../../my.config.js') : require('../my.config')
}

let __config__ = {
  publicPath: '/', // 部署应用时的基本URL

  entry: './src/main.js', // 入口文件

  devServerPort: 8000, // 开发环境端口号

  devServerProxy: null,

  previewServerPort: 7000, // dist预览服务器端口号

  outputDir: 'dist', // 生成的生产环境构建文件目录

  assetsDir: 'assets', // 生成的静态资源目录

  extendContentBase: [], // 扩展的静态资源目录，只对主站有效

  lintOnSave: 'error', // 强制eslint-loader将lint错误输出成编译错误

  prefetch: false, // 设置开启预加载，页面加载完成后，利用空闲时间提前获取用户未来可能会访问的内容

  dll: ['vue', 'vue-loader', 'vuex', 'axios', 'path-to-regexp', 'nprogress'], // 生产环境打包

  docsDevPort: 3001, // 文档开发环境启动端口号

  docsBaseUrl: '/my/', // 文档部署目录

  docsOutputDir: 'web', // 文档编译输出目录

  autoRoutes: true, // 自动生成路由表

  serverPort: 7001, // 服务端启动端口号

  staticConfig: true, // 开启静态资源配置

  coder: {}, // 代码生成器配置

  transpileDependencies: ['@xdh/my'], // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来。

  productionSourceMap: false, // 生产环境是否生成SourceMap

  mock: process.env.NODE_ENV !== 'production', // 是否开启模拟数据

  microApp: false, // 是否开启微服务,

  // webpack自定义配置
  chainWebpack: chain => {

  }
}

__config__ = merge(__config__, myConfig || {})

module.exports = config => {
  if (config) {
    return merge(__config__, config || {})
  }
  return __config__
}