// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store/index'
import ElementUI from 'element-ui'
import './assets/iconfont/iconfont.css'

// flexible
import 'static/js/flexible'

// import './mock/index.js'
// filters(后续要优化，新写的过滤器请写在src/utils/filters.js里)
import * as filters from './assets/js/utility/rb-filters'
import VueBus from './store/vue-bus'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.css'
import './assets/iconfont/iconfont.js'
import rbHttp from './assets/js/utility/rb-http.factory'
import * as ProdEnv from 'assets/js/config/prod.env'
import Keycloak from './assets/js/common/keycloak'
import navConfig from 'assets/js/menu/default-nav-config.js'
import router from './router'
import fullscreen from 'vue-fullscreen'
import {
  api
} from 'src/services/api.js'

// import VuePreview from 'vue-preview'
// Vue.use(VuePreview)
require('static/js/jtopo-0.4.8-min.js')
Vue.prototype.$api = api

Vue.prototype.$http = rbHttp
Vue.use(fullscreen)
Vue.use(VueBus) // 中央总线
Vue.use(ElementUI)

Vue.config.productionTip = false

Vue.prototype.rbHttp = rbHttp
if (process.env.NODE_ENV === 'development') {
  rbHttp.sendRequest({
    method: 'GET',
    url: `/api/env`
  }).then(function(data) {
    init(data)
  })
} else {
  init(ProdEnv)
}
//
// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }
function init(data) {
  sessionStorage.setItem('BPMX_SERVER_URL', data['BPMX_SERVER_URL'])
  sessionStorage.setItem('OPERATE_SERVER_URL', data['OPERATE_SERVER_URL'])
  sessionStorage.setItem('X7_SERVER_URL', data['X7_SERVER_URL'])
  sessionStorage.setItem('GRAFANA_SERVER_URL', data['GRAFANA_SERVER_URL'])
  Vue.prototype.env = data
  let keycloak = Keycloak({
    'realm': data['REALM'],
    'url': data['AUTH_SERVER_URL'],
    'ssl-required': data['SSL_REQUIRED'],
    'clientId': data['RESOURCE'],
    'public-client': data['PUBLIC_CLIENT']
  })
  keycloak.init({
    onLoad: 'login-required'
  }).success(function(authenticated) {
    keycloak.loadUserInfo().success(() => {
      sessionStorage.setItem('token', keycloak.token)
      sessionStorage.setItem('mobile', keycloak.userInfo.mobile)
      sessionStorage.setItem('username', keycloak.userInfo.userName)
      sessionStorage.setItem('isAdmin', keycloak.userInfo.employeeType === 'admin')
      let Base64 = require('js-base64').Base64
      sessionStorage.setItem('mirror', Base64.encode(keycloak.userInfo.userName + '||name'))
      const fields = keycloak.userInfo.employeeType.split('.')
      if (fields[0] === 'user' && fields.length === 2) {
        sessionStorage.setItem('namespace', fields[1])
      } else {
        sessionStorage.setItem('namespace', keycloak.userInfo.userName)
      }
      Vue.prototype.keycloak = keycloak
      var navConfigObj = navConfig
      // 得到菜单操作权限
      if (keycloak.userInfo.employeeType !== 'admin') {
        rbHttp.sendRequest({
          method: 'GET',
          url: `/v1/roles/${sessionStorage.getItem('namespace')}/getRoleByUserName/${sessionStorage.getItem('username')}`
        }).then((res) => {
          let obj = {}
          res.forEach(function(item) {
            Object.assign(obj, item.permissions[0].resource)
          })
          let target = []
          for (let key in obj) {
            target.push(obj[key])
          }
          navConfigObj.categories.forEach(function(item, index) {
            let deleteFlag0
            if (target.includes(item.name)) {
              deleteFlag0 = false
            } else {
              deleteFlag0 = true
            }
            if (item.children && item.children.length > 0) {
              item.children.forEach((subitem, subindex) => {
                let deleteFlag
                if (target.includes(subitem.name)) {
                  deleteFlag0 = false
                  deleteFlag = false
                } else {
                  deleteFlag = true
                }
                if (subitem.children && subitem.children.length > 0) {
                  subitem.children.forEach((threeItem, threeindex) => {
                    if (!target.includes(threeItem.name)) {
                      subitem.children = subitem.children.del(threeItem)
                    } else {
                      deleteFlag0 = false
                      deleteFlag = false
                    }
                  })
                }
                if (deleteFlag) {
                  item.children = item.children.del(subitem)
                }
                // else {
                //   if (target.includes(subitem.name)) {
                //     deleteFlag0 = false
                //   }
                // }
              })
            }
            if (deleteFlag0) {
              navConfigObj.categories = navConfigObj.categories.del(item)
            }
          })
          store.commit('modifyOperResource', navConfigObj)
          // 得到数据字典
          rbHttp.sendRequest({
            method: 'GET',
            url: `/v1/dict/listAll`
          }).then((res) => {
            let obj = JSON.parse(res.result)
            store.commit('modifyDictObj', obj)
            // 如果后台配置不需要短信认证则直接设置已校验通过
            if (obj.login_valid && obj.login_valid.need_sms_captcha.name && obj.login_valid.need_sms_captcha.name === 'false') {
              sessionStorage.setItem('logValid', true)
            }
            /* eslint-disable no-new */
            new Vue({
              el: '#app',
              router,
              store: store,
              template: '<App/>',
              components: {
                App
              }
            })
          })
        })
      } else {
        store.commit('modifyOperResource', navConfigObj)
        sessionStorage.setItem('logValid', true)
        // 得到数据字典
        rbHttp.sendRequest({
          method: 'GET',
          url: `/v1/dict/listAll`
        }).then((res) => {
          let obj = JSON.parse(res.result)
          store.commit('modifyDictObj', obj)
          // 如果后台配置不需要短信认证则直接设置已校验通过
          // if (obj.login_valid && obj.login_valid.need_sms_captcha.name && obj.login_valid.need_sms_captcha.name === 'false') {
          // }
          /* eslint-disable no-new */
          new Vue({
            el: '#app',
            router,
            store: store,
            template: '<App/>',
            components: {
              App
            }
          })
        })
      }
    })
  })

  keycloak.onTokenExpired = function() {
    const redirectUri = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '')
    const logoutUrl = keycloak.createLogoutUrl({
      redirectUri: redirectUri
    })
    window.location.href = logoutUrl
    // alert('长时间未操作，用户信息失效')
  }
}

// 注册全局过滤器(后续要优化，新写的过滤器请写在src/utils/filters.js里)
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
