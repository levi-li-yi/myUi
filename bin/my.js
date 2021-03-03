#!/usr/bin/env node

// 命令脚本执行入口文件

const { semver, error, warn } = require('@vue/cli-shared-utils')
const requiredVersion = require('../package.json').engines.node

// 判定用户当前Node版本
if (!semver.satisfies(process.version, requiredVersion)) {
  error(`您当前使用的Node版本是${process.version},但是MYUI命令行工具所需的Node版本是${requiredVersion}。请升级您的Node版本`)
  process.exit(1)
}

const defaultCommand = function (args, type) {
  warn(`MYUI不支持${type}命令，请检查输入的命令是否正确，或查看MYUI命令文档和用法`)
}

const commandArray = [
  'coder',
  'fix',
  'color',
  // 'jsdoc',
  // 'svg',
  // 'demo',
  // 'theme',
  // 'ready',
  // 'route',
  // 'bridge',
  // 'start',
  // 'serve',
  // 'preview',
  // 'app',
  // 'page'
]

const commandMap = Object.create(null)
commandArray.forEach(name => {
  commandMap[name] = require(`../core/bin/${name}`)
})

const rawArgv = process.argv.slice(2)
const [type, ...args] = rawArgv
const commandHandler = commandMap[type] || defaultCommand

// 执行指定任务
commandHandler(args, type)