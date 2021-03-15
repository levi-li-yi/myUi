// 运行时配置
const merge = require('lodash/merge')

const __config__ = {
  // 版本号
  version: '1.0.0',

  // debug模式
  debug: process.env.NODE_ENV !== 'production',

  // 子应用
  appName: null,

  // 路由path前缀，只对hash模式的子应用有效
  routePrefix: null,

  // 路由配置
  router: {
    // 路由模式
    mode: 'hash',
    // 应用的根路径
    base: '/'
  },

  // 是否读取自动创建的路由表配置
  autoRoutes: true,

  // vuex配置
  vuex: {
    // 进入严格模式，在严格模式下，任何mutation处理函数以外修改vuex state 都会抛出错误
    strict: process.env.NODE_ENV !== 'production'
  },

  // 属性名映射
  keys: {
    code: 'code',
    data: 'data',
    message: 'msg',
    total: 'total',
    list: 'list',
    page: 'page',
    limit: 'limit',
    pages: 'pages'
  },

  // 请求响应状态码
  statusCode: {
    // 响应成功
    success: 0,
    // 未登录，或登录失败
    notLogin: 401,
    // 权限不足
    authorize: 403,
    // 系统内部错误
    error: 500
  },

  // axios实例配置
  axios: {
    // 请求头
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    // 超时时间
    timeout: 0,
    // 携带验证
    withCredentials: true,
    // 响应数据类型
    responseType: 'json',
    // 请求内容长度
    maxContentLength: -1
  },
  // svg图标配置
  svg: {
    viewBox: '0 0 1024 1024',
    width: '1em',
    height: '1em',
    fill: 'currentColor'
  },
  // 权限控制实例配置
  access: {},
  // 模拟数据配置
  mock: {
    timeout: '50-200'
  },
  // 缩放页面
  scale: {
    // 基准宽度
    width: 1920,
    // 基准高度
    height: 1080,
    // 是否禁止缩放功能
    disabled: true,
    // 是否锁定比例，
    lock: true
  },
  // 启动统计埋点
  analysis: false,
  // 微服务启动配置， 设置为null/false 表示关闭微服务功能
  microApp: {
    // 是否开启预加载，默认为true
    prefetch: false,
    // 是否为单实例场景，默认true（可选）
    singular: true,
    // 是否开启沙箱，默认true（可选）;在开发环境开启sandbox时加载子应用切换主题，热更新会报错
    sandbox: process.env.NODE_ENV === 'production'
  }
}

export default __config__

export function set (config) {
  merge(__config__, config || {})
}