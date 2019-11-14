/*
* Mirror 项目
*/
import rbHttp from 'assets/js/utility/rb-http.factory'

export default class rbAlertKanBanServiceFactory {
  // 获取过滤条件下的告警列表
  static async getHomeAlertList (obj, alertType) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      params: {
        'alertType': alertType
      },
      url: `/v1/alerts/home/query`
    }).then(function (data) {
      return data
    })
  }
  static async getHomeAlertCount (obj, alertType) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/alerts/home/overview`,
      data: obj,
      params: {
        'alertType': alertType
      }
    }).then(function (data) {
      return data
    })
  }
  // 获取告警列表
  static async getHomeAlertHisList (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/v1/alerts/home/query-his`
    }).then(function (data) {
      return data
    })
  }
// 活动/确认告警导出
  static async ExportHomeAlertData (data, alertType) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      params: {
        'alertType': alertType
      },
      binary: true,
      url: '/v1/alerts/home/export'
    }).then(function (data) {
      return data
    })
  }
//  解除告警导出
  static async ExportHomeAlertHisData (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      binary: true,
      url: '/v1/alerts/home/export-his'
    }).then(function (data) {
      return data
    })
  }
  // 获取告警列表
  static async getHomeAlertVoiceContent (alertType) {
    return rbHttp.sendRequest({
      method: 'POST',
      params: {
        'alertType': alertType
      },
      url: `/v1/alerts/home/getHomeAlertVoiceContent`
    }).then(function (data) {
      return data
    })
  }
}
