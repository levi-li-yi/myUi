// 初始化，在启动开发环境或生产环境打包之前要完成的操作

module.exports = function (args) {
  const fs = require('fs')
  const core = require('../index')
  const themeBuilder = require('./theme')
  const elThemes = core.OutputElementThemePath
  const uiThemes = core.OutputUIThemePath

  // 若不存在el-themes则编译
  if (!fs.existsSync(elThemes)) {
    themeBuilder(['el'])
  }

  // 若不存在ui-themes则编译
  if (!fs.existsSync(uiThemes)) {
    themeBuilder(['ui'])
  }

  // 重新生成代码
  require('./coder')(args)
}