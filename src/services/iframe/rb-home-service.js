import rbHttp from 'assets/js/utility/rb-http.factory'

const homeIndex = '/v1/cmdb/index'

export default class rbHomeService {

    // 首页——设备趋势图(日)
    static async countDeviceClassTrendWithDay () {
        return rbHttp.sendRequest({
          method: 'GET',
          url: homeIndex + `/countDeviceClassTrend/day`
        }).then(function (data) {
          return data
        })
    }

  // 首页——设备趋势图(月)
  static async countDeviceClassTrendWithMonth () {
      return rbHttp.sendRequest({
        method: 'GET',
        url: homeIndex + `/countDeviceClassTrend/month`
      }).then(function (data) {
        return data
      })
  }

  //各一级租户设备类型分布
  static async countDeviceClassByDepartment1 () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: homeIndex + `/countDeviceClassByDep1`
    }).then(function (data) {
      return data
    })
  }

  //设备子类型分布
  static async countDeviceTypeByDeviceClass (params) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: params,
      url: homeIndex + `/countDevTypeByDevClass`
    }).then(function (data) {
      return data
    })
  }

  //各一级租户设备量趋势(日)
  static async countDevClsByDepWithDay () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: homeIndex + `/countDevClsTrendWithDay`
    }).then(function (data) {
      return data
    })
  }

  //各一级租户设备量趋势(月)
  static async countDevClsByDepWithMonth () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: homeIndex + `/countDevClsTrendWithMonth`
    }).then(function (data) {
      return data
    })
  }
}