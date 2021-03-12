const config = requir('./config')()
const utils = require('./utils')
const core = require('./index')

const baseConfig = require('./config/webpack.base.extend')
const devConfig = require('./config/webpack.dev.extend')
const prodConfig = require('./config/webpack.prod.extend')
const proxyFactory = require('./config/proxy.factory')

// 获取子应用的信息
const packageJson = core.IsInstalled ? require('../../../../package.json') : require('../package.json')
const apps = packageJson.apps || {}
