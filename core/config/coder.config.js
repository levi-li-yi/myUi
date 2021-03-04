// 代码生成器配置

// const _ = require('lodash')
const utils = require('../utils')
const core = require('../index')
const { merge } = require('lodash')
const config = require('../config')()

const outDir = core.OutputCodePath

module.exports = merge({
  // 架构配置文件目录
  schemasDir: core.SchemasPath,

  // 模板文件目录
  templatesDir: utils.resolve('core/renders/coder'),

  // 代码输出文件目录
  outDir: outDir,

  // iconfont css 文件路径
  iconCssFile: utils.join(core.LibPath, 'assets/icons/iconfont.css'),

  // svg图标目录
  svgIconDirL: utils.join(core.LibPath, 'assets/svg/'),

  // element ui icon文件目录合并
  elIconCssFile: utils.join(core.ProjectRootPath, 'node_modules/element-ui/packages/theme-chalk/lib/icon.css'),

  // 生成api文件路径
  outApiPath: utils.join(outDir, 'api'),

  // 生成mock文件路径
  outMockPath: utils.join(outDir, 'mock'),

  // 生成mock配置文件路径
  outMockConfig: outDir,

  // 生成store文件路径
  outStorePath: utils.join(outDir, 'store'),

  // 生成store配置文件路径
  outStoreType: outDir,

  // 生成mixin文件路径
  outMixinPath: utils.join(outDir, 'mixin'),

  // 生成icon文件路径
  outIconFile: utils.join(outDir, 'icon.js'),

  // api请求地址前缀
  pathPrefix: 'API_HOST',

  // api支持的请求方法
  methods: [
    'fetch', // 获取列表数据，响应数据含有分页信息，如：总数、当前页码、页大小
    'get', // 获取单条实体数据， 响应数据是对象形式
    'add', // 新增实体数据
    'update', // 更新实体数据
    'remove', // 删除实体
    'batch' // 批量删除
  ],

  // 数据请求类型对应http请求方法的映射
  methodTypeMap: {
    fetch: 'get',
    get: 'get',
    add: 'post',
    update: 'patch',
    remove: 'delete',
    batch: 'post'
  },

  // 数据请求类型对应api地址的后缀映射
  methodSuffixMap: {
    fetch: '',
    get: '/:id',
    add: '',
    update: '',
    remove: '/:id',
    batch: '/remove'
  },

  //请求方法对应的中文注释
  methodCommentMap: {
    fetch: '获取<%=cname%>列表',
    get: '获取<%=cname%>单条记录',
    add: '新增<%=cname%>',
    update: '更新<%=cname%>',
    remove: '删除<%=cname%>',
    batch: '批量删除<%=cname%>'
  },

  // 是否开启生成批量删除
  batchEnabled: true,

  // store 或 mixin 状态保存列表的字段名称，和接口响应数据对应， 默认：list
  stateListName: 'list',

  // store 或 mixin 状态保存单个实体字段名称，默认：model
  stateModelName: 'model',

  // store 或 mixin 状态保当前页码的字段名称，和接口响应数据对应， 默认：page
  statePageName: 'page',

  // store 或 mixin 状态保存页大小的字段名称，和接口响应数据对应，默认：limit
  statePageSizeName: 'limit',

  // store 或 mixin 状态保存数据总条数字段名称，和接口响应数据对应，默认：total
  stateTotalName: 'total',

  // Mock响应数据字段名称，默认：data
  mockDataName: 'data',

  // Mock响应状态字段名称，默认：code
  mockCodeName: 'code',

  // Mock响应信息说明字段名称，默认：msg
  mockMsgName: 'msg',

  // Mock响应成功时的code值，默认：0
  successCodeValue: 0,

  // Mock新增接口响应mock信息
  addMockData: {
    id: '@guid'
  },

  // Mock更新接口响应mock信息
  updateMockData: true,

  // Mock删除接口响应mock信息
  removeMockData: true,

  // Mock批量删除响应mock信息
  batchMockData: true
}, config.coder || {})