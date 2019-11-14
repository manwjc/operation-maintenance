import rbHttp from 'assets/js/utility/rb-http.factory'

const ProjectEndPoint = '/v1/cmdb/maintenance'
const ProduceEndPoint = '/v1/cmdb/maintenProduce'
const SoftwareEndPoint = '/v1/cmdb/maintensoft'
const SoftwareRecordEndPoint = '/v1/cmdb/maintenance/software/record'

export default class maintenanceService {
  // project
  // 查询维保项目
  static async listMaintenanceProject (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: ProjectEndPoint + `/project/list`
    }).then(function (data) {
      return data
    })
  }

  // produce
  // 分页查询软件维保数据
  static async listProduceByPage (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: ProduceEndPoint + `/listProduceByPage`
    }).then(function (data) {
      return data
    })
  }

  // software
  // 分页查询软件维保数据
  static async listMaintenanceByPage (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: SoftwareEndPoint + `/listMaintenSoftwareByPage`
    }).then(function (data) {
      return data
    })
  }

  // 插入新软件维保
  static async insertMaintenance (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: SoftwareEndPoint + `/insertMaintenSoftware`
    }).then(function (data) {
      return data
    })
  }

  // 根据id删除软件维保
  static async deleteMaintenanceById (data) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      params: data,
      url: SoftwareEndPoint + `/deleteMaintenSoftware`
    }).then(function (data) {
      return data
    })
  }

  // 查询软件维保根据软件名称
  static async selectMaintenSoftwareBySoftNmae (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: data,
      url: SoftwareEndPoint + `/selectMaintenSoftwareBySoftNmae`
    }).then(function (data) {
      return data
    })
  }
  // 导出软件维保数据
  static async exportTemp (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      binary: true,
      url: SoftwareEndPoint + `/downloadTemplate`
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
      url: SoftwareEndPoint + `/downloadMaintenSoftware`
    }).then(function (data) {
      return data
    })
  }
  // softwareRecord
  // 分页查询软件维保数据
  static async listSoftwareRecordByPage (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: SoftwareRecordEndPoint + `/list`
    }).then(function (data) {
      return data
    })
  }
  // 新增或修改软件使用记录
  static async saveAndUpdateSoftwareRecord (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: SoftwareRecordEndPoint + `/saveAndUpdate`
    }).then(function (data) {
      return data
    })
  }

  // 删除软件维保使用
  static async deleteSoftwareRecord (data) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      data: data,
      url: SoftwareRecordEndPoint + `/delete`
    }).then(function (data) {
      return data
    })
  }

  // 下载软件维保使用模板
  static async downloadSoftwareRecordTemplate (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      binary: true,
      url: SoftwareRecordEndPoint + `/downloadTemplate`
    }).then(function (data) {
      return data
    })
  }
  // 导出软件维保使用数据
  static async exportSoftwareRecordData (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      binary: true,
      url: SoftwareRecordEndPoint + `/exportData`
    }).then(function (data) {
      return data
    })
  }
}
