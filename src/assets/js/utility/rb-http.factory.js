import axios from 'axios'
import Message from 'element-ui/packages/message'
import cookieService from 'src/services/cookie.service.js'
import common from './common.js'
const FormData = window.FormData

// 超时时间
axios.defaults.timeout = 50000
// http请求拦截器
// let loadinginstace
axios.interceptors.request.use(config => {
  config.headers['RUBICK-AJAX-REQUEST'] = true
  config.headers['X-REQUESTED-WITH'] = 'XMLHttpRequest'
  return config
}, error => {
  // loadinginstace.close()
  Message.error({
    message: '加载超时'
  })
  return Promise.reject(error)
})
// http响应拦截器
axios.interceptors.response.use(data => {
  return data
}, error => {
  // error.response.data
  error.response.config && error.response.config.client === 'rbHttp' && common.ajaxGenericOnError(error.response)
  return Promise.reject(error.response)
})

export default class rbHttp {
  /**
   * Simply a migration from legacy ajax.sendRequest method, but with new ES6 signature
   *
   * @param method HTTP method (e.g. 'GET', 'POST', etc)
   * @param url Absolute or relative URL of the resource that is being requested.
   * @param params Map of strings or objects which will be serialized with the paramSerializer and appended as GET parameters.
   * @param data Data to be sent as the request message data.
   * @param timeout timeout in milliseconds, or promise that should abort the request when resolved.
   * @param binary Whether or not to expect the response is binary
   * @param cache A boolean value or object created with $cacheFactory to enable or disable caching of the HTTP response.
   *        Typically, use this only if you know this value will not be updated.
   * @param useFormData Indicates that the data passed in should be transformed to FormData
   * @param addNamespace add namespace to params by default
   */
  static sendRequest({
    method = 'GET',
    url,
    data,
    params = {},
    timeout = 1000 * 300,
    binary = false,
    cache = false,
    useFormData = false,
    addNamespace = true,
    Authorization,
    responseType
  }) {
    const namespace = sessionStorage.getItem('namespace')
    const token = sessionStorage.getItem('token')
    // Most rubick ajax calls are subject to namespace
    if (!params.namespace && addNamespace) {
      params.namespace = namespace
    }

    if (cookieService.getCookie('project')) {
      params.project_name = cookieService.getCookie('project')
    }

    // combine params & data and assign to data
    if (!(data instanceof FormData) && !(data instanceof Array)) {
      data = Object.assign({}, data, params)
    }

    const config = {
      method,
      url,
      timeout,
      cache,
      data,
      params,
      xsrfHeaderName: 'X-CSRFToken',
      xsrfCookieName: '294f62ecd0',
      client: 'rbHttp',
      responseType
    }
    config.headers = {}
    config.headers['Content-Type'] = 'application/json'

    config.headers.head_orgAccount = sessionStorage.getItem('namespace')
    config.headers.head_userName = sessionStorage.getItem('username')
    config.headers.head_isAdmin = sessionStorage.getItem('isAdmin')
    config.headers.Accept = 'application/json, text/plain, */*'
    config.headers.Authorization = 'Bearer ' + token
    if (useFormData) {
      if (!(data instanceof FormData)) {
        config.data = this._buildFormData(data)
      }
      config.headers['Content-Type'] = 'multipart/form-data'
    }

    if (binary) {
      config.responseType = 'arraybuffer'
    }
    if (Authorization) {
      config.headers.Authorization = Authorization
    }
    return axios(config).then(function (response) {
      return response.data
    })
  }

  static _buildFormData(data) {
    const formData = new FormData()
    for (const key in data) {
      const value = data[key]
      if (value instanceof Array) {
        for (let i = 0; i < value.length; i++) {
          formData.append(key, value[i])
        }
      } else {
        formData.append(key, value)
      }
    }
    return formData
  }

  static getList(url) {
    return new Promise((resolve, reject) => {
      axios.get(url).then(response => {
        resolve(response.data)
      }).catch((error) => {
        reject(error)
      })
    })
  }

  //   static sendMirrorRequest ({
  //                              method = 'GET',
  //                              url,
  //                              data,
  //                              params = {},
  //                              timeout = 1000 * 30
  //                            }) {
  //     const config = {
  //       method,
  //       url,
  //       timeout,
  //       data,
  //       params
  //     }
  //     config.headers = {}
  //     config.headers['Content-Type'] = 'application/json'
  //     config.headers.Accept = 'application/json, text/plain, */*'
  //     config.headers.head_orgAccount = 'alauda'
  //     config.headers.head_userName = 'alauda'
  //     return axios(config).then(response => response.data)
  //   }
  // }
}
