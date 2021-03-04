// 工具集
const _path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const _ = require('lodash')
const url = require('url')
const rm = require('rimraf')
const copy = require('copy-concurrently')
const packageJSON = require('../package')

module.exports = {
  /**
   * 构建文件目录路径
   */
  resolve () {
    const args = [__dirname, '../', ...arguments]
    return _path.join.apply(this, args)
  },
  /**
   * 拼接path路径
   */
  join () {
    return _path.join.apply(this, arguments)
  },
  /**
   * 文件path格式化，适配mac和windows
   */
  urlFormat (path) {
    return url.format(path)
  },
  /**
   * 返回对象，其属性表示path的重要元素，忽略尾部目录分隔符
   */
  parsePath (path) {
    return _path.parse(path)
  },
  /**
   * 输出控制台信息
   */
  log (msg, type = "primary") {
    const colors = {
      success: chalk.green,
      warning: chalk.keyword('orange'),
      error: chalk.bold.red,
      primary: chalk.blue
    }
    // 控制台打印
    console.log(colors[type](msg));
  },
  /**
   *字符串转换
   * _.kebabCase('Foo Bar'); => 'foo-bar' 
   */
  kebabCase (str) {
    return _.kebabCase(str)
  },
  camelCase (str) {
    return _.camelCase(str)
  },
  upperFirst (str) {
    return _.upperFirst(str)
  },
  /**
   * 格式化JS代码
   */
  beautifyJs (content) {
    content = content.replace(/(\r\n|\n)\s*/g, '\n')
      .replace(/\(\n/g, '(')
      .replace(/,\n/g, ',')
      .replace(/\/\*\*/g, '\n/**')
      .replace(/\n\/\//g, '\n\n//')
    const beautify = require('js-beautify').js_beautify
    return beautify(content, {
      indent_with_tabs: false,
      indent_size: 2,
      jslint_happy: true,
      end_with_newline: true,
      space_after_anon_function: true
    })
  },
  /**
   * 将json转换成字符串，并将双引号转换成单引号
   */
  stringify (json) {
    const str = JSON.stringify(json)
    return str ? str.replace(/'/g, '\\\'').replace(/"/g, '\'') : ''
  },
  /**
   * 创建文件目录
   */
  mkdir (dirname) {
    if (fs.existsSync(dirname)) return true
    if (this.mkdir(_path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
  },
  /**
   * 写文件
   */
  writeFile (path, content) {
    this.mkdir(_path.dirname(path))
    fs.writeFileSync(path, content, 'utf-8')
  },
  /**
   * 复制单个文件
   */
  copyFile (from, to) {
    this.mkdir(_path.dirname(to))
    fs.copyFileSync(from, to)
  },
  /**
   * 复制目录下全部文件，不递归
   */
  copyFiles (fromDir, toDir) {
    if (!fs.existsSync(fromDir)) return
    const files = fs.readdirSync(fromDir) || []
    files.forEach(file => {
      const from = this.join(fromDir, file)
      const to = this.join(toDir, file)
      this.copyFile(from, to)
    })
  },
  /**
   * 递归获取文件路径数组
   */
  getFiles (dir) {
    const result = []
    const files = fs.readdirSync(dir) || []
    files.forEach(file => {
      const fullPath = this.join(dir, file)
      const stat = fs.statSync(fullPath)
      if (stat.isDirectory()) {
        result = result.concat(this.getFiles(fullPath))
      } else {
        result.push(fullPath)
      }
    })
    return result
  },
  /**
   * 删除文件和文件夹
   */
  rm (path) {
    rm.sync(path)
  },
  /**
   * 复制文件夹和文件
   */
  copy (from, to) {
    if (fs.existsSync(to)) {
      this.rm(to)
    }
    return copy(from, to)
  },
  /**
   * 判断两个对象是否相等
   */
  isEqual (object, other) {
    return _.isEqual(object, other)
  },
  /**
   * 分隔线
   */
  brand () {
    this.log('-------------------------------------------', 'warning')
    this.log(`前端工程框架 v${packageJSON.version} \n @ 2020`, 'success')
    this.log('-------------------------------------------', 'warning')
  },
  /**
   * 创建唯一ID
   */
  uid () {
    return new Date().getTime().toString() + Math.floor(Math.random() * 1000)
  }
}