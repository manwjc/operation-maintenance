/*
* Mirror 项目
*/
import rbHttp from 'assets/js/utility/rb-http.factory'

export default class rbAlertIsolateServiceFactory {
  static async getIsolateList (req) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/isolate/list`,
      params: req
    }).then(function (data) {
      return data
    })
  }
  static async getDetail (id) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/isolate/detail/${id}`,
    }).then(function (data) {
      return data
    })
  }
  static async insert (req) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/alerts/isolate/insert`,
      data: req
    }).then(function (data) {
      return data
    })
  }
  static async update (req) {
    return rbHttp.sendRequest({
      method: 'PUT',
      url: `/v1/alerts/isolate/update`,
      data: req
    }).then(function (data) {
      return data
    })
  }
  static async delete (req) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      url: `/v1/alerts/isolate/delete`,
      data: req
    }).then(function (data) {
      return data
    })
  }

  static async start (req) {
    return rbHttp.sendRequest({
      method: 'PUT',
      url: `/v1/alerts/isolate/status/1`,
      data: req
    }).then(function (data) {
      return data
    })
  }

  static async stop (req) {
    return rbHttp.sendRequest({
      method: 'PUT',
      url: `/v1/alerts/isolate/status/0`,
      data: req
    }).then(function (data) {
      return data
    })
  }
  static async getOperateLogList (req) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/log/list`,
      params: req
    }).then(function (data) {
      return data
    })
  }
  static async getIsolateAlertList (req) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/isolateAlert/list`,
      params: req
    }).then(function (data) {
      return data
    })
  }
  static async exportIsolateAlertList (req) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/alerts/isolateAlert/export`,
      binary: true,
      params: req
    }).then(function (data) {
      return data
    })
  }
}
