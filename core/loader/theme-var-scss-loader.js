/**
 * 主题样式变量文件 webpack loader
 */
const utils = require('../utils')
module.exports = function (source) {
  const vars = `@import "${utils.urlFormat(this.query.vars)}";\n`
  return vars + source
}