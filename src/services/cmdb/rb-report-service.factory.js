import rbHttp from 'assets/js/utility/rb-http.factory'

const reportManager = '/v1/cmdb/report'

export default class report {
  // 分页查询
  static async listReportByBizSystem (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: data,
      url: reportManager + '/listReportByBizSystem'
    }).then(function (data) {
      return data
    })
  }

  // 导出
  static async exportReportByBizSystem (obj) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: obj,
      binary: true,
      url: reportManager + `/exportReportByBizSystem`
    }).then(function (data) {
      return data
    })
  }

// 分页查询
  static async listReportByDepartment (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: data,
      url: reportManager + '/listReportByDepartment'
    }).then(function (data) {
      return data
    })
  }

  // 导出
  static async exportReportByDepartment (obj) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: obj,
      binary: true,
      url: reportManager + `/exportReportByDepartment`
    }).then(function (data) {
      return data
    })
  }
}
