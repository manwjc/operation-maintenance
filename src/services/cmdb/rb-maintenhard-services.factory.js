import rbHttp from 'assets/js/utility/rb-http.factory'

const MaintenanceHard = '/v1/cmdb/mainten/hardware'
//

export default class maintenanceService {
  // 查询硬件维保数据已经存在
  static async queryMaintenanceHardwareIsExist (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: data,
      url: MaintenanceHard + `/queryIsExist`
    }).then(function (data) {
      return data
    })
  }

  //
  // 分页查询硬件维保数据
  static async listMaintenanceByPage (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: MaintenanceHard + `/selectHardwareByPage`
    }).then(function (data) {
      return data
    })
  }


  // 查询单个新硬件维保
  static async selectMaintenanceById (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: data,
      url: MaintenanceHard + `/selectMaintenHardwareById`
    }).then(function (data) {
      return data
    })
  }
  // 查询硬件维保通过设备型号
  static async selectMaintenHardwareByDeviceModel (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: data,
      url: MaintenanceHard + `/selectMaintenHardwareByDeviceModel`
    }).then(function (data) {
      return data
    })
  }
  // 修改硬件维保
  static async updateMaintenance (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: MaintenanceHard + `/updateHardware`
    }).then(function (data) {
      return data
    })
  }
  // 批量更新硬件维保
  static async batchUpdateMaintenHardware (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: MaintenanceHard + `/batchUpdateHardware`
    }).then(function (data) {
      return data
    })
  }
  // 导出硬件维保
  static async downloadMaintenHardware (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      binary: true,
      url: MaintenanceHard + `/export`
    }).then(function (data) {
      return data
    })
  }

  static async queryProduceInfoList () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/cmdb/maintenProduce/queryProduceInfoList`
    }).then(function (data) {
      return data
    })
  }

  static async queryProduceConcatList (param) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: param,
      url: `/v1/cmdb/maintenProduce/queryConcatByProduceId`
    }).then(function (data) {
      return data
    })
  }

}
