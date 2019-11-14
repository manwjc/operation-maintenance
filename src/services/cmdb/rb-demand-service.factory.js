import rbHttp from 'assets/js/utility/rb-http.factory'

const DemandPoint = '/v1/cmdb/demandManager'
const orgManger = '/v1/cmdb/orgManager'
export default class rbConfigDictServiceFactory {
  // 分页查询
  static async listDemandByPage (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: DemandPoint + '/list'
    }).then(function (data) {
      return data
    })
  }

  // 获取需求收集表头
  static async getDemandTableHeader () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: DemandPoint + `/list/header`
    }).then(function (data) {
      return data
    })
  }

  // 获取需求收集表头
  static async getDemandManager (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: DemandPoint + `/list/`
    }).then(function (data) {
      return data
    })
  }

  // 获取需求资源分类
  static async getModelDemandType () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: DemandPoint + `/demandTypeList`
    }).then(function (data) {
      return data
    })
  }

  static async getConfigDictByType (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: data,
      url: `/v1/cmdb/configDict/getDictsByType`
    }).then(function (data) {
      return data
    })
  }

  static async getDepartment (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: data,
      url: orgManger + `/getByPid`
    }).then(function (data) {
      return data
    })
  }

  // 新增
  static async save (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: DemandPoint + `/save`
    }).then(function (data) {
      return data
    })
  }

  static async exportGridData (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      binary: true,
      url: DemandPoint + `/exportDemand`
    }).then(function (data) {
      return data
    })
  }

  static async exportDemandTemplate (obj) {
    return rbHttp.sendRequest({
      method: 'GET',
      binary: true,
      url: DemandPoint + `/importDemandTemplate`
    }).then(function (data) {
      return data
    })
  }

  // 保存excel数据
  static async saveExcelData1 (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      useFormData: true,
      url: `/cmdb/demandManager/saveExcelData/`
    }).then(function (data) {
      return data
    })
  }

  // 修改
  static async update (data) {
    return rbHttp.sendRequest({
      method: 'PUT',
      data: data,
      url: DemandPoint + `/update`
    }).then(function (data) {
      return data
    })
  }

  static async getById (demandId) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: DemandPoint + `/get?demandId=` + demandId
    }).then(function (data) {
      return data
    })
  }
}
