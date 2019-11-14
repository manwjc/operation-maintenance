import rbHttp from 'assets/js/utility/rb-http.factory'
const MonitorEndPoint = '/v1/alerts/auto'

export default class monitorService {
  static async autoSendInfo (query_data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: query_data,
      url: MonitorEndPoint + '/autoSendInfo'
    }).then(function (data) {
      return data
    })
  }

  static async insertAutoAlarmConfig (query_data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: query_data,
      // useFormData: true,
      url: MonitorEndPoint + '/insertAutoAlarmConfig'
    }).then(function (data) {
      return data
    })
  }
}
