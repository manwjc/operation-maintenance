import rbHttp from 'assets/js/utility/rb-http.factory'

const HardWareUse = '/v1/cmdb/mainten/hardwareuse'
//

export default class maintenanceService {
  // 新增
  static async addMaintenanceuse (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: HardWareUse + `/addHardwareUse`
    }).then(function (data) {
      return data
    })
  }
  // 分页查询硬件维保使用数据
  static async listMaintenanceByPage (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: HardWareUse + `/selectHardwareUseByPage`
    }).then(function (data) {
      return data
    })
  }

  // 修改硬件维保使用
  static async updateMaintenance (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: HardWareUse + `/updateHardwareUse`
    }).then(function (data) {
      return data
    })
  }

  // 批量更新硬件维保使用
  static async batchUpdateMaintenHardware (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: HardWareUse + `/batchUpdateHardwareUse`
    }).then(function (data) {
      return data
    })
  }

  // 删除硬件维保使用
  static async deleteMaintenanceById (data) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      params: data,
      url: HardWareUse + `/deleteHardwareUse`
    }).then(function (data) {
      return data
    })
  }

  // 导出硬件维保使用
  static async downloadMaintenHardware (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      binary: true,
      url: HardWareUse + `/export`
    }).then(function (data) {
      return data
    })
  }

  // 厂商
  static async queryProduceInfoList () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/cmdb/maintenProduce/queryProduceInfoList`
    }).then(function (data) {
      return data
    })
  }

}
