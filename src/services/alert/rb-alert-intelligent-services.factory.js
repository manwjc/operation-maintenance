/*
* Mirror 项目
*/
import rbHttp from 'assets/js/utility/rb-http.factory'

export default class rbAlertIntelligentServicesFactory {
  // 获取过滤条件下的告警收敛列表
  static async queryAlertIntelligent (obj,alertId) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      params: {
        'alertId': alertId
      },
      url: `/v1/alerts/intelligent/queryAlertIntelligent`
    }).then(function (data) {
      return data
    })
  }
  static async alertIntelligentOverview (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/alerts/intelligent/alertIntelligentOverview`,
      data: obj,
      params: {
      }
    }).then(function (data) {
      return data
    })
  }
  static async exportAlertIntelligentData (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      params: {
      },
      binary: true,
      url: '/v1/alerts/intelligent/exportAlertIntelligentData'
    }).then(function (data) {
      return data
    })
  }

}
