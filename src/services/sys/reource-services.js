/*
* @author huangzhijie
* @date   19.3.2
* @description 系统管理-资源请求接口
*/
import rbHttp from 'assets/js/utility/rb-http.factory'

export default class ResourceServiceFactory {
  static ROOT_ID = '000000'
  // 3.6.2	设备类型列表查询
  static getDevicetypeList (id) {
    let params = {}
    // if (ids) {
    //   params.ids = ids
    // }
    return rbHttp.sendRequest({
      method: 'GET',
      params: params,
      url: '/v1/cmdb/instance/getDeviceClassTree'
    })
  }
  static async getInstance (ids) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: '/v1/cmdb/instance/listInstanceBaseInfo/' + ids
    })
  }
  static getBizSysList (id) {
    let params = {}
    return rbHttp.sendRequest({
      method: 'GET',
      params: params,
      url: '/v1/cmdb/orgManager/loadTreeDepBiz'
    })
  }
  // 获取树
  static getDictTree (colName, ids) {
    let params = {}
    if (ids) {
      params.ids = ids
    }
    return rbHttp.sendRequest({
      method: 'GET',
      params: params,
      url: '/v1/cmdb/configDict/getTree/' + colName
    })
  }
  // 设备通用权限（区域）
  static getAreaTree () {
    let params = {}
    // if (ids) {
    //   params.ids = ids
    // }
    return rbHttp.sendRequest({
      method: 'GET',
      params: params,
      url: '/v1/cmdb/instance/getIdcTree'
    })
  }
  // 设备特殊权限（设备）
  static getDeviceTree () {
    return this.getAreaTree()
  }
  static async getAuthDevice (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      params: obj,
      url: `/v1/permissions/getAuthDeviceData`
    }).then(function (data) {
      return data
    })
  }
  // 3.6.4	查询资源角色列表
  static getResourceList () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: '/v1/roles/rolesRerouceAllList'
    })
  }
  // 3.6.5	新增资源角色
  static addResource (obj) {
    const constraints = {
      area: '',
      deviceType: '',
      bizSystem: '',
      device: ''
    }
    if (obj.area) {
      constraints.area = obj.area
    }
    if (obj.deviceType) {
      constraints.deviceType = obj.deviceType
    }
    if (obj.bizSystem) {
      constraints.bizSystem = obj.bizSystem
    }
    if (obj.device) {
      constraints.device = obj.device
    }
    // [{"area": "1111,2222"},{"deviceType": "2,3"},{"device": "4,5"}

    const params = {
      name: obj.name,
      describe: obj.describe,
      resources: [],
      parents: [
        {
          uuid: obj.pid
        }
      ],
      permissions: [
        {
          resource: [],
          actions: [],
          constraints: [constraints]
        }
      ],
      admin_role: false
    }
    if (obj.pid === ResourceServiceFactory.ROOT_ID) {
      delete params.parents
    }
    // TODO /v1/roles/resource/{namespace}
    return rbHttp.sendRequest({
      method: 'POST',
      params: params,
      url: '/v1/roles/resource/alauda'
    })
  }
  // 3.6.6	修改资源角色
  static updateResource (obj) {
    const constraints = {
      area: '',
      deviceType: '',
      bizSystem: '',
      device: ''
    }
    if (obj.area) {
      constraints.area = obj.area
    }
    if (obj.deviceType) {
      constraints.deviceType = obj.deviceType
    }
    if (obj.bizSystem) {
      constraints.bizSystem = obj.bizSystem
    }
    if (obj.device) {
      constraints.device = obj.device
    }
    // [{"area": "1111,2222"},{"deviceType": "2,3"},{"device": "4,5"}]

    const params = {
      role_id: obj.id,
      name: obj.name,
      describe: obj.describe,
      resources: [],
      parents: [
        {
          uuid: obj.pid
        }
      ],
      permissions: [
        {
          resource: [],
          actions: [],
          constraints: [constraints]
        }
      ],
      admin_role: false
    }
    if (obj.pid === ResourceServiceFactory.ROOT_ID) {
      delete params.parents
    }
    // TODO url '/v1/roles/{namespace}'
    return rbHttp.sendRequest({
      method: 'PUT',
      params: params,
      url: `/v1/roles/alauda/${obj.id}`
    })
  }
  // 3.6.7	删除资源角色
  static deleteResource (id) {
    // TODO url '/v1/roles/delete/{namespace}/{id}'
    return rbHttp.sendRequest({
      method: 'DELETE',
      url: `/v1/roles/delete/alauda/${id}`
    }).then(function (data) {
      return data
    })
  }
  // 3.6.8	查询资源角色信息
  static getResourceDetail (id) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/roles/detail/${id}`
    })
  }

  // 3.6.8	查询资源角色信息
  static getDict (ids) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: {'ids': ids},
      url: `/v1/cmdb/configDict/getByIds`
    })
  }
}
