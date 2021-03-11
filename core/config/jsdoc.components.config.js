// jsdoc配置
const factory = require('./jsdoc.factory')
module.exports = factory(
  'ui/lib/components',
  'docs/.vuepress/public/api/components',
  'docs/ui/components/README.md'
)