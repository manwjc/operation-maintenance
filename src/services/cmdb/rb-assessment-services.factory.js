import rbHttp from 'assets/js/utility/rb-http.factory'

const assessment = '/v1/cmdb/assessment'


export default class assessmentService {
  //

  // 新增设备问题列表
  static async getEquipmentProblemList (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: assessment + `/getEquipmentProblemList`
    }).then(function (data) {
      return data
    })
  }

  // 查询设备问题列表
  static async saveEquipmentProblemList (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: assessment + `/saveEquipmentProblemList`
    }).then(function (data) {
      return data
    })
  }


  // 分页查询设备问题列表
  static async seleteEquipmentProblemByPage (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: assessment + `/seleteEquipmentProblemByPage`
    }).then(function (data) {
      return data
    })
  }


  // 审批设备问题
  static async approveEquipmentProblem (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: assessment + `/approveEquipmentProblem`
    }).then(function (data) {
      return data
    })
  }


  // 获取部门列表
  static async getprovinceList (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: `/v1/department/queryList`
    }).then(function (data) {
      return data
    })
  }


  // 获取用户列表
  static async getpersionList (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: `/v1/user/queryList`
    }).then(function (data) {
      return data
    })
  }

// 获取设备量列表
  static async getDeviceCountList (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/cmdb/device/count/list`,
      data: data
    }).then(function (data) {
      return data
    })
  }

  // 获取分支机构状态（待审批等）
  static async getProvinceStatus (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/cmdb/device/count/getProvinceStatus`,
      params: data
    }).then(function (data) {
      return data
    })
  }

  // 获取厂家列表
  static async getdeviceMfrsList (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/cmdb/device/produce/list`
    }).then(function (data) {
      return data
    })
  }


  // 获取设备类型列表
  static async getdeviceTypeList (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/cmdb/device/type/list`
    }).then(function (data) {
      return data
    })
  }

// 获取设备类型列表
  static async  saveProduceAssessment(data) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/cmdb/assessment/assessment/save`,
      data: data
    }).then(function (data) {
      return data
    })
  }


// 获取维修事件模板
  static async  getRepairEventTemp() {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/cmdb/static/excel/repairevent.xlsx`,
      binary: true
    }).then(function (data) {
      return data
    })
  }
  // 获取设备类型列表
  static async  getProblemEventTemp() {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/cmdb/static/excel/problemevent.xlsx`,
      binary: true
    }).then(function (data) {
      return data
    })
  }

  // 获取设备类型列表
  static async  getEquipmentProblemTemp() {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/cmdb/static/excel/equipmentproblem.xlsx`,
      binary: true
    }).then(function (data) {
      return data
    })
  }
  // 获取设备类型评分状态
  static async  getScoreDeviceTypeStatus(data) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/cmdb/device/serviceAssess/getScoreDeviceTypeStatus`,
      params: data
    }).then(function (data) {
      return data
    })
  }

}
