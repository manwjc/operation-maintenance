/*
* Mirror 项目
*/
import rbHttp from 'assets/js/utility/rb-http.factory'

export default class rbAlertNotifyConfigFactory {
  static async getAlertNotifyConfigList (req) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/notifyConfig/getAlertNotifyConfigList`,
      params: req
    }).then(function (data) {
      return data
    })
  }
  static async createAlertNotifyConfig (req) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/alerts/notifyConfig/createAlertNotifyConfig`,
      data: req
    }).then(function (data) {
      return data
    })
  }
  static async updateAlertNotifyConfig (req) {
    return rbHttp.sendRequest({
      method: 'PUT',
      url: `/v1/alerts/notifyConfig/updateAlertNotifyConfig`,
      data: req
    }).then(function (data) {
      return data
    })
  }
  static async getAlertNotifyConfigDetail (req) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/notifyConfig/getAlertNotifyConfigDetail`,
      params: req
    }).then(function (data) {
      return data
    })
  }
  static async deleteAlertNotifyConfig (req) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      url: `/v1/alerts/notifyConfig/deleteAlertNotifyConfig`,
      data: req
    }).then(function (data) {
      return data
    })
  }
  static async openAlertNotifyConfig (req) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/alerts/notifyConfig/openAlertNotifyConfig`,
      data: req
    }).then(function (data) {
      return data
    })
  }
  static async closeAlertNotifyConfig (req) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/alerts/notifyConfig/closeAlertNotifyConfig`,
      data: req
    }).then(function (data) {
      return data
    })
  }
  static async copyAlertNotifyConfig (req) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/notifyConfig/copyAlertNotifyConfig`,
      params: req
    }).then(function (data) {
      return data
    })
  }
  static async getAlertNotifyConfigRule () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/notifyConfig/getAlertNotifyConfigRule`
    }).then(function (data) {
      return data
    })
  }
  static async updateAlertNotifyConfigRule (req) {
    return rbHttp.sendRequest({
      method: 'PUT',
      url: `/v1/alerts/notifyConfig/updateAlertNotifyConfigRule`,
      data: req
    }).then(function (data) {
      return data
    })
  }
  static async getOperationPermission (req) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/notifyConfig/getOperationPermission`,
      params: {
        'creator': req
      }
    }).then(function (data) {
      return data
    })
  }
}
