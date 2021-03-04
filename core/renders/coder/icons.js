const _ = require('lodash')

module.exports = _.template(`
/**
 *  icons
 *  @module $my/code/icons
 */

export const elIcons = <%=elItems%>;

export const myIcons = <%=items%>

export default {elIcons, myIcons}

`)
