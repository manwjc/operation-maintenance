import rbHttp from 'assets/js/utility/rb-http.factory'

const MaintenanceSoft = '/v1/cmdb/maintensoft'
//

export default class maintenanceService {
  //
  // 分页查询软件维保数据
  static async listMaintenanceByPage (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: MaintenanceSoft + `/listMaintenSoftwareByPage`
    }).then(function (data) {
      return data
    })
  }

  // 根据id删除软件维保
  static async deleteMaintenanceById (data) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      params: data,
      url: MaintenanceSoft + `/deleteMaintenSoftware`
    }).then(function (data) {
      return data
    })
  }
  // 插入新软件维保
  static async insertMaintenance (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: MaintenanceSoft + `/insertMaintenSoftware`
    }).then(function (data) {
      return data
    })
  }

  // 查询单个软件维保
  static async selectMaintenanceById (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: data,
      url: MaintenanceSoft + `/selectMaintenSoftwareById`
    }).then(function (data) {
      return data
    })
  }
  // 查询软件维保根据软件名称
  static async selectMaintenSoftwareBySoftNmae (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: data,
      url: MaintenanceSoft + `/selectMaintenSoftwareBySoftNmae`
    }).then(function (data) {
      return data
    })
  }
  // 修改软件维保
  static async updateMaintenance (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: MaintenanceSoft + `/updateMaintenSoftware`
    }).then(function (data) {
      return data
    })
  }
  // 批量更新软件维保
  static async batchUpdateMaintenSoftware (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: MaintenanceSoft + `/batchUpdateMaintenSoftware`
    }).then(function (data) {
      return data
    })
  }
  // 导出软件维保
  static async downloadMaintenSoftware (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      binary: true,
      url: MaintenanceSoft + `/downloadMaintenSoftware`
    }).then(function (data) {
      return data
    })
  }
}
