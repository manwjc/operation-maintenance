import rbHttp from 'assets/js/utility/rb-http.factory'

const bizSystemManage = '/v1/cmdb/bizSystem'

export default class Class {
  //
  static async loadTree () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: bizSystemManage + '/loadTree'
    }).then(function (data) {
      return data
    })
  }

  // 分页查询
  static async listBizSystemByPage (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: data,
      url: bizSystemManage + '/list'
    }).then(function (data) {
      return data
    })
  }

  // 插入
  static async insert (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: bizSystemManage + '/add'
    }).then(function (data) {
      return data
    })
  }

  // 根据id查询
  static async getById (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: data,
      url: bizSystemManage + '/getById'
    }).then(function (data) {
      return data
    })
  }

  // 根据id查询联系人
  static async getConcatsById (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: data,
      url: bizSystemManage + '/getConcatsById'
    }).then(function (data) {
      return data
    })
  }

  // 更新
  static async update (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      params: data,
      url: bizSystemManage + '/update'
    }).then(function (data) {
      return data
    })
  }

  // 根据id删除
  static async deleteById (data) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      params: data,
      url: bizSystemManage + '/deleteBiz'
    }).then(function (data) {
      return data
    })
  }
}
