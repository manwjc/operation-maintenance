/*
* @author huangzhijie
* @date   19.2.25
* @description 系统管理-功能角色请求接口
*/
import rbHttp from 'assets/js/utility/rb-http.factory'

export default class RoleServiceFactory {
  // 3.5.1	新增功能角色
  static async addRole (obj) {
    const actions = []
    if (obj.actionData && obj.actionData.length > 0) {
      obj.actionData.map((item) => {
        actions.push(item.id)
      })
    }
    const params = {
      name: obj.name,
      describe: obj.describe,
      permissions: [
        {
          actions: actions,
          resource: obj.visitData
        }
      ],
      admin_role: false
    }
    // TODO url '/v1/roles/{namespace}'
    return rbHttp.sendRequest({
      method: 'POST',
      params: params,
      url: '/v1/roles/alauda'
    })
  }
  // 3.5.2	修改功能角色
  static async updateRole (obj) {
    const actions = []
    if (obj.actionData && obj.actionData.length > 0) {
      obj.actionData.map((item) => {
        actions.push(item.id)
      })
    }
    const params = {
      name: obj.name,
      describe: obj.describe,
      permissions: [
        {
          actions: actions,
          resource: obj.visitData
        }
      ],
      admin_role: false
    }
    // TODO url '/v1/roles/{namespace}/{role_id}'
    return rbHttp.sendRequest({
      method: 'PUT',
      params: params,
      url: `/v1/roles/alauda/${obj.id}`
    })
  }
  // 3.5.3	删除功能角色
  static async deleteRole (id) {
    // TODO url '/v1/roles/delete/{namespace}/{id}'
    return rbHttp.sendRequest({
      method: 'DELETE',
      url: `/v1/roles/delete/alauda/${id}`
    }).then(function (data) {
      return data
    })
  }
  // 3.5.4	查询功能角色列表
  static async getRoleList (pageSize = 10, pageNo = 1) {
    // TODO url '/v1/roles/{namespace}'
    const params = {
      pageSize: pageSize,
      pageNo: pageNo
    }
    return rbHttp.sendRequest({
      method: 'GET',
      params: params,
      url: '/v1/roles/alauda'
    })
  }
  // 3.5.5	查询访问权限树
  static async getVisitTree (id) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: {
        id: id
      },
      url: '/v1/role-schema/tree'
    })
  }
  // 3.5.6	查询操作权限树
  static async getOperateTree (name) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/role-schema/${name}`
    })
  }
  // 3.5.6-2	查询操作权限全部
  static async getOperateAllList () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: '/v1/role-schema'
    })
  }
  // 3.5.7	查询功能角色详情
  static async getRoleDetail (id) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/roles/detail/${id}`
    })
  }
}
