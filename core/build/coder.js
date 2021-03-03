// 代码生成器

const fs = require('fs')
const path = require('path')
const { logWithSpinner, stopSpinner } = require('@vue/cli-shared-utils')
const _lodash = require('lodash')
const pathToRegexp = require('path-to-regexp')
const config = require('../config/coder.config')
const utils = require('../utils')
const { log } = require('util')


/**
 * 读取模板渲染函数
 * @param {*} file 
 */
function getRender (file) {
  return require(path.join(config.templatesDir, file))
}

/**
 * 读取规范的js文件命名
 * @param {*} name 
 */
function toSchemaName (name) {
  return _lodash.camelCase(name.replace('.js', ''))
}

/**
 * 获取配置文件列表
 * @param {*} root 
 * @param {*} parent 
 */
function getSchemaFiles (root, parent) {
  let fileList = []

  // 若还不存在根目录则先创建根目录
  if (!fs.existsSync(root)) {
    utils.log('警告： schemas已自动创建', 'warning')
    fs.mkdirSync(root)
    return fileList
  }

  // 读取文件
  const files = fs.readdirSync(root)
  _lodash.each(files, (file) => {
    const filePath = path.join(root, file)
    const stat = fs.lstatSync(filePath)

    // 若是文件夹则遍历
    if (stat.isDirectory()) {
      fileList = fileList.concat(getSchemaFiles(filePath, file))
    } else {
      // 若是js文件则收集到列表中
      if (file.indexOf('.js') > 0) {
        fileList.push({
          name: toSchemaName(parent ? [parent, file].join('_') : file),
          path: filePath
        })
      }
    }
  })
  return fileList
}

/**
 * 根据配置文件生成配置JSON 
 * @param {*} files 
 */
function getSchemaInfo (files) {
  const models = {}
  _lodash.each(files, (file) => {
    models[file.name] = require(file.path)
  })
  return models
}

/**
 * 生成文件
 * @param {*} path 
 * @param {*} fileName 
 * @param {*} content 
 */
function writeFile (path, fileName, content) {
  utils.writeFile(utils.join(path, fileName + '.js'), content)
}

// 字母大写转化
function toUpperCase (name) {
  return name.toUpperCase()
}

/**
 * Foo Bar | --foo-bar | __foo_bar__ => fooBar
 * @param name
 */
function toCamelCase (name) {
  return _lodash.camelCase(name)
}

/**
 * Foo Bar | fooBar | --foo-bar => foo_bar
 * @param name
 */
function toSnakeCase (name) {
  return _lodash.snakeCase(name)
}

/**
 * fooBar => foo-bar
 * @param name
 */
function toKebabCase (name) {
  return _lodash.kebabCase(name)
}

function toUpperSnakeCaseName (name) {
  return toUpperCase(toSnakeCase(name))
}

// JSON转换成字符串，并把双引号转换成单引号
function stringify (json) {
  const str = JSON.stringify(json)
  return str ? str.replace(/'/g, '\\\'').replace(/"/g, '\'') : ''
}

/**
 * 解析models
 * @param {*} schemas 
 */
function parseSchemas (schemas) {
  const result = {}
  _lodash.each(schemas, (schema, name) => {
    result[name] = parseModel(schema.model, name, schema.vuex)
  })
  return result
}

// 获取请求信息
function getTitle (name, item, info) {
  const methodComment = config.methodCommentMap[item.methodType] || item.title || '<%=cname%>' + (item.toUpperSnakeCaseName || '')
  return _lodash.template(methodComment)({ cname: info[name].name || name })
}

/**
 * 解析单个model
 * @param {} model 
 * @param {*} name 
 * @param {*} vuex 
 */
function parseModel (model, name, vuex) {
  console.log(model, name, vuex);
  let result = []

  // 若是数组
  if (_lodash.isArray(model)) {
    _lodash.each(model, (item) => {
      if (item.disabled !== true && item.path) result = result.concat(parseModel(item, name, vuex))
    })
    return false
  }

  // 若非数组
  if (model.disabled !== true && model.path) {
    // 当model.methods为false时
    if (model.methods === false) {
      if (!model.name) {
        throw Error('methods为false时，必须要设置name')
      }

      if (vuex && (!model.state && !model.method)) {
        throw Error('vuex模式, methods为false, 并且method为空时, 必须要设置state')
      }

      if (model.method && !config.methods.includes(model.method)) {
        throw Error(`method的值必须是${config.methods.join(' ')}中的一个`)
      }

      // xhr请求类型
      const httpMethod = config.methodTypeMap[model.method || model.name] || 'post'
      // xhr请求选项
      const options = _lodash.extend({}, { method: httpMethod }, model.options || {})

      result.push({
        path: model.path,
        prefix: model.prefix || config.pathPrefix,
        transform: model.transform,
        options: options,
        columns: model.columns,
        methodType: model.method || model.name,
        httpMethod: options.method,
        suffix: '',
        upperSnakeCaseName: toUpperSnakeCaseName(model.name),
        camelCaseName: toCamelCase(model.name),
        template: model.template,
        name: model.name,
        state: model.state,
        cache: model.cache,
        socket: model.socket
      })
    }

    // 当model.methods为true时
    if (model.methods !== false) {
      const methods = model.methods || config.methods
      _lodash.each(methods, (method) => {
        // 检测是否开启了批量删除
        if (method === 'batch' && !config.batchEnabled) return

        // xhr请求类型
        const httpMethod = config.methodTypeMap[method] | 'get'
        // xhr请求选项
        const options = _lodash.extend({}, { method: httpMethod }, model.options || {})

        result.push({
          path: model.path,
          transform: model.transform,
          prefix: model.prefix || config.pathPrefix,
          suffix: config.methodSuffixMap[method] || '',
          options: options,
          columns: model.columns,
          methodType: method,
          httpMethod: httpMethod,
          upperSnakeCaseName: toUpperSnakeCaseName(method + '_' + name),
          camelCaseName: toCamelCase(method + '_' + name),
          template: model.template,
          title: model.title,
          cache: model.cache,
          socket: model.socket
        })
      })
    }
  }

  // 
  return result
}

/**
 * 生成API文件
 * @param {*} json 
 * @param {*} info 
 */
function writeApi (json, info) {
  _lodash.each(json, (model, name) => {
    const items = []
    let configKeys = [], transforms = []

    //
    _lodash.each(model, (item) => {
      if (item.prefix) configKeys.push(item.prefix)
      if (item.transform) transforms.push(item.transform)

      const url = item.path + item.suffix
      const keys = []
      pathToRegexp(url, keys)
    })

    // 去重，在数组中已存在的URL就不再加进去
    if (!items.some(n => n.URL === item.upperSnakeCaseName)) {
      items.push({
        URL: item.upperSnakeCaseName,
        url: item.path + item.suffix,
        prefix: item.prefix,
        params: keys.map(n => n.name),
        camelCaseName: item.camelCaseName,
        options: item.options,
        ajaxParam: 'data',
        transform: item.transform,
        title: getTitle(name, item, info),
        cache: item.cache,
        socket: item.socket
      })
    }
  })

  // configKeys、transforms去重
  configKeys = _lodash.uniq(configKeys)
  transforms = _lodash.uniq(transforms)

  // 写入文件
  writeFile(config.outApiPath, toKebabCase(name), utils.beautifyJs(apiRender({
    cname: info[name].name,
    name: name,
    transforms: transforms,
    configKeys: configKeys,
    items: items
  })))
}

// 生成mock文件
function writeMock (json) {
  const dbConfig = [], extendsArray = [];
  _lodash.each(json, (model, name) => {
    const kebabCaseName = toKebabCase(name)
    dbConfig.push(`import ${name} from '$my/code/mock/${kebabCaseName}'`)
    extendsArray.push(`...${name}`)
    //
    const mocks = []
    let importApiArray = [], templateArray = []
    _lodash.each(model, (item) => {
      if (item.columns || item.template) importApiArray.push(item.upperSnakeCaseName)

      if (item.template) templateArray.push(item.template)

      if (item.columns || item.template) {
        mocks.push({
          URL: item.upperSnakeCaseName,
          page: config.statePageName || 'page',
          limit: config.statePageSizeName || 'limit',
          total: config.stateTotalName || 'total',
          list: config.stateListName || 'list',
          httpMethod: item.httpMethod,
          methodType: item.methodType,
          columns: stringify(item.columns || {}, '', '\t'),
          template: item.template
        })
      }
    })

    //去重
    importApiArray = _lodash.uniq(importApiArray)
    templateArray = _lodash.uniq(templateArray)
    writeFile(config.outMockPath, toKebabCase(name), utils.beautifyJs(mockRender({
      importApiArray: importApiArray,
      name: name,
      kebabCaseName: toKebabCase(name),
      mocks: mocks,
      code: config.mockCodeName || 'code',
      data: config.mockDataName || 'data',
      message: config.mockMsgName || 'message',
      templateArray: templateArray,
      codeValue: config.successCodeValue,
      addData: stringify(config.addMockData),
      updateData: stringify(config.updateMockData),
      removeData: stringify(config.removeMockData),
      batchData: stringify(config.batchMockData)
    })))
  })
  dbConfig.push(`export default [${extendsArray.join(', ')}]`)
  writeFile(config.outMockConfig, 'rules', dbConfig.join('\n') + '\n')
}

// 生成mixin文件
function writeMixin (json, info) {
  _lodash.each(json, (model, name) => {
    if (info[name].vuex) return
    let importTypeArray = [],
      importApiArray = [],
      customStateArray = []
    const items = []
    _lodash.each(model, (item) => {
      importTypeArray.push(item.upperSnakeCaseName)
      importApiArray.push(item.camelCaseName)
      if (item.state) {
        customStateArray.push({
          state: item.state,
          title: item.title || item.upperSnakeCaseName
        })
      }
      const url = item.path + item.suffix
      const keys = []
      pathToRegexp(url, keys)

      items.push({
        NAME: item.upperSnakeCaseName,
        name: item.camelCaseName,
        state: item.state,
        params: keys.map(n => n.name),
        httpMethod: item.httpMethod,
        methodType: item.methodType,
        ajaxParam: 'data',
        title: getTitle(name, item, info),
        cache: item.cache
      })
    })
    importTypeArray = _lodash.uniq(importTypeArray)
    importApiArray = _lodash.uniq(importApiArray)
    customStateArray = _lodash.uniq(customStateArray)
    writeFile(config.outMixinPath, toKebabCase(name), utils.beautifyJs(mixinRender({
      name: name,
      cname: info[name].name || name,
      kebabCaseName: toKebabCase(name),
      importTypeArray: importTypeArray,
      importApiArray: importApiArray,
      customStateArray: customStateArray,
      page: config.statePageName || 'page',
      limit: config.statePageSizeName || 'limit',
      total: config.stateTotalName || 'total',
      list: config.stateListName || 'list',
      model: config.stateModelName || 'model',
      items: items
    })))
  })
}

// 生成store文件
function writeStore (json, info) {
  const types = {}
  const modules = [], extendsArray = []
  _lodash.each(json, function (model, name) {
    if (!info[name].vuex) {
      return
    }
    modules.push(`import {${name}} from '$my/code/store/${toKebabCase(name)}'`)
    extendsArray.push(name)

    let importTypeArray = [],
      importApiArray = [],
      customStateArray = []
    const items = []
    types[name] = []
    _lodash.each(model, function (item) {
      types[name].push({
        name: item.upperSnakeCaseName,
        title: getTitle(name, item, info)
      })
      importTypeArray.push(item.upperSnakeCaseName)
      importApiArray.push(item.camelCaseName)
      if (item.state) {
        customStateArray.push({
          state: item.state,
          title: item.title || item.upperSnakeCaseName
        })
      }
      const url = item.path + item.suffix
      const keys = []
      pathToRegexp(url, keys)
      items.push({
        NAME: item.upperSnakeCaseName,
        name: item.camelCaseName,
        state: item.state,
        params: keys.map(n => n.name),
        httpMethod: item.httpMethod,
        methodType: item.methodType,
        ajaxParam: 'data',
        title: getTitle(name, item, info),
        cache: item.cache
      })
    })
    importTypeArray = _lodash.uniq(importTypeArray)
    importApiArray = _lodash.uniq(importApiArray)
    customStateArray = _lodash.uniq(customStateArray)
    writeFile(config.outStorePath, toKebabCase(name), utils.beautifyJs(storeRender({
      name: name,
      cname: info[name].name || name,
      kebabCaseName: toKebabCase(name),
      importTypeArray: importTypeArray,
      importApiArray: importApiArray,
      customStateArray: customStateArray,
      page: config.statePageName || 'page',
      limit: config.statePageSizeName || 'limit',
      total: config.stateTotalName || 'total',
      list: config.stateListName || 'list',
      model: config.stateModelName || 'model',
      items: items
    })))
  })

  writeFile(config.outStoreType, 'types', utils.beautifyJs(typesRender({ types: types })))
  modules.push(`export default {${extendsArray.join(', ')}}`)
  writeFile(config.outStoreType, 'modules', modules.join('\n') + '\n')
}

// 获取icon
function getMyIconData () {
  const content = fs.readFileSync(config.iconCssFile, { encoding: 'utf-8' })
  const regex = /.icon-[\w-_]+:/g
  const matches = content.match(regex)
  return matches.map((item) => {
    return item.replace('.', '').replace(':', '')
  })
}

// 写入icon element-ui icon
function writeIconData () {
  const content = fs.readFileSync(config.elIconCssFile, { encoding: 'utf-8' })
  const regex = /.el-icon-[\w-_]+:/g
  const matches = content.match(regex)
  const elItems = matches.map((item) => {
    return item.replace('.el-', 'el-').replace(':', '')
  })

  const items = getMyIconData()
  const fileContent = iconsRender({ items: stringify(items), elItems: stringify(elItems) })
  fs.writeFileSync(config.outIconFile, utils.beautifyJs(fileContent), 'utf-8')
}

const schemaFiles = getSchemaFiles(config.schemasDir)
const schemaInfo = getSchemaInfo(schemaFiles)
const schemaJSON = parseSchemas(schemaInfo)
const apiRender = getRender('api.js')
const mockRender = getRender('mock.js')
const storeRender = getRender('store.js')
const mixinRender = getRender('mixin.js')
const typesRender = getRender('types.js')
const iconsRender = getRender('icons.js')

module.exports = (force) => {
  // 强制清空目录
  if (force) {
    utils.rm(config.outDir)
    logWithSpinner('清空目录')
  }
  logWithSpinner('构建代码')
  if (!fs.existsSync(config.outDir)) {
    utils.mkdir(config.outDir)
  }
  writeApi(schemaJSON, schemaInfo)
  writeMock(schemaJSON)
  writeStore(schemaJSON, schemaInfo)
  writeMixin(schemaJSON, schemaInfo)
  writeIconData()
  stopSpinner()
}