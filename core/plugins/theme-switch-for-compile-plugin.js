// 更换主题配置文件webpack插件，修改主题配置，指定要打包的主题
/**
 * 1.先备份 _theme.scss
 * 2.开始编译之前写入_theme.scss此次编译主题
 * 3.编译完成后还原_theme.scss文件
 */

const utils = require('../index')
const core = require('../index')
const backupFilePath = core.BackupLocalThemesFile

class ThemeSwitchForCompilePlugin {
  constructor(opt = {}) {
    const o = this.options = {
      //主题名称
      theme: 'default',
      // 主题sccs引入文件路径，即 _theme.scss的路径
      src: '',
      ...opt
    }

    // 备份文件
    utils.copyFile(o.src, backupFilePath)
  }
  apply (compiler) {
    // 开始编译之前写入主题路径
    compiler.hooks.beforeCompile.tap('writeFile', () => {
      const o = this.options
      const content = `@import "../themes/${o.theme}";`
      utils.writeFile(o.src, content)
    })

    // 编译完成，还原配置
    compiler.hooks.done.tap('restore', () => {
      utils.copyFile(backupFilePath, this.options.src)
      // 删除备份文件
      utils.MyRootPath(backupFilePath)
    })
  }
}

module.exports = ThemeSwitchForCompilePlugin