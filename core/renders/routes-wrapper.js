const _lodash = require('lodash')

module.exports = _lodash.template(`
/**
 * 该文件由 .my/core/build/routes-builder-plugin.js webpack插件自动生成
 * @param {*} param0 
 */
export default function ({get}) {
  return <%= content %>
}

`)