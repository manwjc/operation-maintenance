/*
* Mirror 项目
*/
import rbHttp from 'assets/js/utility/rb-http.factory'

export default class rbAlertWorkLogFactory {
  static async createdAlertWorkConfig (req) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/alerts/workLog/createdAlertWorkConfig`,
      params: req
    }).then(function (data) {
      return data
    })
  }
  static async getAlertWorkConfig (req) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/workLog/getAlertWorkConfig`
    }).then(function (data) {
      return data
    })
  }
  static async getWorkLogList (req) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/workLog/getWorkLogList`,
      params: req
    }).then(function (data) {
      return data
    })
  }

  static async getWorkLogInfo (req) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/workLog/getWorkLogInfo`,
      params: req
    }).then(function (data) {
      return data
    })
  }
}
