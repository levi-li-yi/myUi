// const obj = {
//   title: '标题',
//   list: [
//     {
//       name: 'name',
//       age: 18
//     }
//   ]
// }

const fs = require('fs')
const matter = require('gray-matter')
const _ = require('lodash')
const utils = require('../utils')

const regex = /---\n?[\s\S]*\n?---/gi

/**
 * 解析文件返回标记数据
 * @param {*} file 文件路径
 * @param {*} isString 是否返回字符串
 */
function parse (file, isString) {
  const content = fs.readFileSync(file, 'utf-8')
  const matches = content.match(regex) || []
  if (matches.length === 0) return null
  const results = matches.map(block => {
    return matter(block.trim()).data || {}
  })
  const data = _.merge.apply(_.merge, results)
  return _.isPlainObject(data) ? (isString ? utils.stringify(data) : data) : null
}

module.exports = parse