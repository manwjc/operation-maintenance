import rbHttp from 'assets/js/utility/rb-http.factory'

const bizResReportManager = '/v1/cmdb/bizResReport'

export default class BizResReport {
  // 分页查询
  static async listByPage (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: data,
      url: bizResReportManager + '/list'
    }).then(function (data) {
      return data
    })
  }

  // 导出
  static async exportGridData (obj) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: obj,
      binary: true,
      url: bizResReportManager + `/exportBizRes`
    }).then(function (data) {
      return data
    })
  }
}
