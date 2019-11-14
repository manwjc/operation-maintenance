/*
* Mirror 项目
*/
import rbHttp from 'assets/js/utility/rb-http.factory'

export default class rbAlertprimary_secondaryServiceFactory {
  static async getprimarySecondaryList (req) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/primary_secondary/list`,
      params: req
    }).then(function (data) {
      return data
    })
  }
  static async checkName (name) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/primary_secondary/check/${name}`,
    }).then(function (data) {
      return data
    })
  }
  static async getDetail (id) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/primary_secondary/detail/${id}`,
    }).then(function (data) {
      return data
    })
  }
  static async insert (req) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/alerts/primary_secondary/insert`,
      data: req
    }).then(function (data) {
      return data
    })
  }
  static async update (req) {
    return rbHttp.sendRequest({
      method: 'PUT',
      url: `/v1/alerts/primary_secondary/update`,
      data: req
    }).then(function (data) {
      return data
    })
  }
  static async delete (req) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      url: `/v1/alerts/primary_secondary/delete`,
      data: req
    }).then(function (data) {
      return data
    })
  }

  static async start (req) {
    return rbHttp.sendRequest({
      method: 'PUT',
      url: `/v1/alerts/primary_secondary/status/1`,
      data: req
    }).then(function (data) {
      return data
    })
  }

  static async stop (req) {
    return rbHttp.sendRequest({
      method: 'PUT',
      url: `/v1/alerts/primary_secondary/status/0`,
      data: req
    }).then(function (data) {
      return data
    })
  }
  static async getprimarySecondaryAlertList (req) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/primary_secondary_alerts/list`,
      params: req
    }).then(function (data) {
      return data
    })
  }
  static async exportprimarySecondaryAlertList (req) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/alerts/primary_secondary_alerts/export`,
      binary: true,
      params: req
    }).then(function (data) {
      return data
    })
  }
}
