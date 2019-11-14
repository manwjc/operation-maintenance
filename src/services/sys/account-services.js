/*
* @author wupeng
* @date   19.4.2
* @description 系统管理-账号管理请求接口
*/
import rbHttp from 'assets/js/utility/rb-http.factory'

export default class AccountServiceFactory {
  // 3.5.2.1新增账号
  static addAccount (formData, user_id, org_name = 'alauda') {
    return rbHttp.sendRequest({
      method: 'POST',
      data: formData,
      addNamespace: false,
      url: `/v1/orgs/${org_name}/accounts/${user_id}`
    })
  }
  // 分配角色给一个用户
  static assignAccount (roleName, username, org_name = 'alauda') {
    return rbHttp.sendRequest({
      method: 'POST',
      params: roleName,
      addNamespace: false,
      url: ` /v1/orgs/${org_name}/accounts/${username}/assign`
    })
  }
  // 修改启用状态
  static toggleType (name, type, org_name = 'alauda') {
    // TODO url确认
    const param = {
      username: name,
      enable: type
    }
    return rbHttp.sendRequest({
      method: 'PUT',
      params: param,
      addNamespace: false,
      url: `/v1/orgs/${org_name}/keycloak/${name}`
    })
  }
  // 	删除
  static deleteAccount (id, org_name = 'alauda') {
    // TODO url确认
    return rbHttp.sendRequest({
      method: 'DELETE',
      addNamespace: false,
      url: `/v1/orgs/${org_name}/accounts/${id}`
    })
  }
  // 查询列表
  static getAccountList (pageSize = 10, pageNo = 1, searchData, username) {
    let org_name = sessionStorage.getItem('namespace')
    const params = {
      page_size: pageSize,
      page: pageNo
    }
    if (searchData) {
      params.search = searchData
    }
    if (username) {
      params.username = username
    }
    return rbHttp.sendRequest({
      method: 'GET',
      params: params,
      addNamespace: false,
      url: `/v1/orgs/${org_name}/accounts`
    })
  }
  // 修改全量账户信息
  static updateAccount (formData, user_id, username) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: formData,
      addNamespace: false,
      url: `/v1/orgs/${username}/accounts/${user_id}/update`
    })
  }
  // 查询指定用户详情
  static getAccountDetail (username, org_name = 'alauda') {
    // TODO url确认
    return rbHttp.sendRequest({
      method: 'GET',
      addNamespace: false,
      url: `/v1/orgs/${org_name}/alauda/${username}`
    })
  }
}
