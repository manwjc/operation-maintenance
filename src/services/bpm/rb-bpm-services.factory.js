/*
* Mirror 项目
*/
import rbHttp from 'assets/js/utility/rb-http.factory'

export default class rbBpmServiceFactory {
  static async getAccountByParam () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/order/getAccountByParam`
    }).then(function (data) {
      return data
    })
  }
  static async instDistribution (type,isWhole) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/order/instDistribution`,
      params: {
        'type': type ,
        'isWhole': isWhole
      }
    }).then(function (data) {
      return data
    })
  }
  static async instTrend (startDate,endDate,isWhole) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/order/instTrend`,
      params: {
        'startDate': startDate ,
        'endDate': endDate ,
        'isWhole': isWhole
      }
    }).then(function (data) {
      return data
    })
  }
  static async listJson (param) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/order/listJson`,
      params: param
    }).then(function (data) {
      return data
    })
  }
  static async instStatistics (defKey,startDate,endDate,isWhole) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/order/instStatistics`,
      params: {
        'defKey': defKey ,
        'startDate': startDate ,
        'endDate': endDate ,
        'isWhole': isWhole 
      }
    }).then(function (data) {
      return data
    })
  }

}
