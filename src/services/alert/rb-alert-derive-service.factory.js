/*
* Mirror 项目
*/
import rbHttp from 'assets/js/utility/rb-http.factory'

export default class rbAlertderiveServiceFactory {
  static async getDeriveList (req) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/derive/list`,
      params: req
    }).then(function (data) {
      return data
    })
  }
  static async checkName (name) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/derive/check/${name}`,
    }).then(function (data) {
      return data
    })
  }
  static async getDetail (id) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/derive/detail/${id}`,
    }).then(function (data) {
      return data
    })
  }
  static async insert (req) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/alerts/derive/insert`,
      data: req
    }).then(function (data) {
      return data
    })
  }
  static async update (req) {
    return rbHttp.sendRequest({
      method: 'PUT',
      url: `/v1/alerts/derive/update`,
      data: req
    }).then(function (data) {
      return data
    })
  }
  static async delete (req) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      url: `/v1/alerts/derive/delete`,
      data: req
    }).then(function (data) {
      return data
    })
  }

  static async start (req) {
    return rbHttp.sendRequest({
      method: 'PUT',
      url: `/v1/alerts/derive/status/1`,
      data: req
    }).then(function (data) {
      return data
    })
  }

  static async stop (req) {
    return rbHttp.sendRequest({
      method: 'PUT',
      url: `/v1/alerts/derive/status/0`,
      data: req
    }).then(function (data) {
      return data
    })
  }
  static async getDeriveAlertList (req) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/deriveAlert/list`,
      params: req
    }).then(function (data) {
      return data
    })
  }
  static async exportDeriveAlertList (req) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/alerts/deriveAlert/export`,
      binary: true,
      params: req
    }).then(function (data) {
      return data
    })
  }
}
