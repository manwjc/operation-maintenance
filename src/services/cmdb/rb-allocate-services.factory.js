import rbHttp from 'assets/js/utility/rb-http.factory'

const AllocateManage = '/v1/cmdb/allocate'
//

export default class allocateService {
  //
  // 分页查询域名数据
  static async listDomineByPage (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: AllocateManage + `/listDomaineByPage`
    }).then(function (data) {
      return data
    })
  }

  // 根据id删除域名
  static async deleteDomineById (data) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      params: data,
      url: AllocateManage + `/deleteDomain`
    }).then(function (data) {
      return data
    })
  }
  // 插入新域名
  static async insertDomain (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: AllocateManage + `/insertDomain`
    }).then(function (data) {
      return data
    })
  }

  // 查询单个新域名
  static async selectDomainById (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: data,
      url: AllocateManage + `/selectDomainById`
    }).then(function (data) {
      return data
    })
  }

  // 查询域名根据名称
  static async selectDomainByName (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: data,
      url: AllocateManage + `/selectDomainByName`
    }).then(function (data) {
      return data
    })
  }
  // 查询网段根据名称
  static async selectNetsegmentByName (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: data,
      url: AllocateManage + `/selectNetsegmentByName`
    }).then(function (data) {
      return data
    })
  }
  // 查询网段下ip分配数
  static async getNetsegIpaddrressCount (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: data,
      url: AllocateManage + `/getNetsegIpaddrressCount`
    }).then(function (data) {
      return data
    })
  }
  // 修改域名
  static async updateDomain (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: AllocateManage + `/updateDomain`
    }).then(function (data) {
      return data
    })
  }
  // 查询菜单
  static async selectAllocateMenu () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: AllocateManage + `/selectAllocateMenu`
    }).then(function (data) {
      return data
    })
  }
}
