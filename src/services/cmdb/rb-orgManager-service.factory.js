import rbHttp from 'assets/js/utility/rb-http.factory'

const orgManagerManage = '/v1/cmdb/orgManager'

export default class Class {
  //
  static async loadTree () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: orgManagerManage + '/loadTree'
    }).then(function (data) {
      return data
    })
  }
// 分页查询
  static async listAllOrg () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: orgManagerManage + '/getAllOrg'
    }).then(function (data) {
      return data
    })
  }
  // 分页查询
  static async listOrgManagerByPage (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: data,
      url: orgManagerManage + '/list'
    }).then(function (data) {
      return data
    })
  }

  // 插入
  static async insert (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: orgManagerManage + '/add'
    }).then(function (data) {
      return data
    })
  }

  // 根据id查询
  static async getById (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: data,
      url: orgManagerManage + '/getById'
    }).then(function (data) {
      return data
    })
  }

  // 根据id删除
  static async deleteById (data) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      params: data,
      url: orgManagerManage + '/deleteOrg'
    }).then(function (data) {
      return data
    })
  }

  // 更新
  static async update (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      params: data,
      url: orgManagerManage + '/update'
    }).then(function (data) {
      return data
    })
  }

  // 查询一级部门下的所有二级部门及业务
  static async loadTreeDepBiz () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: orgManagerManage + '/loadTreeDepBiz'
    }).then(function (data) {
      return data
    })
  }
}
