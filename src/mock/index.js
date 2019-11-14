import Mock from 'mockjs'
import {vuetable} from './vuetable.js'
import {datasource} from './datasource.js'
import {template} from './template.js'
import {alert} from './alert.js'
import {alertDetail} from './alertDetail.js'

let data = [].concat(vuetable, datasource, template)
let data1 = [].concat(alert, alertDetail)

data.forEach(function (res) {
  // Mock.mock(res.path, res.data)
})

data1.forEach(function (res) {
  // Mock.mock(res.path, res.data)
})

export default Mock
