import rbHttp from 'assets/js/utility/rb-http.factory'
export default class deviceUserRateService {
  static async queryServiceCount (param) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: param,
      url: `/v1/cmdb/instance/queryServiceCount`
    })
  }
  static async deviceUsedRate (param) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: param,
      url: `/v1/alerts/zabbix/deviceUsedRate`
    })
  }
}
