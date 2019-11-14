import rbHttp from 'assets/js/utility/rb-http.factory'

const ROLES_ENDPOINT = '/v1/orgs/'
const namespace = sessionStorage.getItem('namespace')
const PROJECT_ROLE_URL = `/v1/roles/${namespace}/`
const AUTH_COMPANY = '/v1/auth/'
export default class orgService {
  static async listOrgAccounts ({
                                 page = 1, page_size = 20, order_by = 'username',
                                 search = '', team_name_filter = '', assign = ''
                               }) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `${ROLES_ENDPOINT}${namespace}/accounts`,
      params: {
        page: page,
        page_size: page_size,
        order_by: order_by,
        search: search,
        team_name_filter: team_name_filter,
        assign: assign
      }
    })
  }
  static async createAccount (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `${ROLES_ENDPOINT}${namespace}/accounts`,
      data
    }).then((data) => {
      return data
    })
  }
  static async deleteAccount (username) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      url: `${ROLES_ENDPOINT}${namespace}/accounts/${username}`
    })
  }
  static async addAccountRoles (username, roles) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `${ROLES_ENDPOINT}${namespace}/accounts/${username}/roles`,
      data: roles
    }).then((data) => {
      return data
    })
  }
  static async updateAccountPassword (username, data) {
    return rbHttp.sendRequest({
      method: 'PUT',
      url: `${ROLES_ENDPOINT}${namespace}/accounts/${username}`,
      data
    }).then((data) => {
      return data
    })
  }
  static async getUserRoles ({username}) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: ROLES_ENDPOINT + namespace + '/accounts/' + username + '/roles'
    }).then(data => data)
  }
  static async revokeRoleUsers (data, {role_name}) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      url: PROJECT_ROLE_URL + role_name + '/users',
      data
    })
  }
  static async updateCompanyNameEmailPassword (data) {
    return rbHttp.sendRequest({
      method: 'PUT',
      url: ROLES_ENDPOINT + namespace,
      data
    })
  }
  static async updateUserPassword (data, username) {
    return rbHttp.sendRequest({
      method: 'PUT',
      url: ROLES_ENDPOINT + namespace + '/accounts/' + username,
      data
    })
  }
  /* 获取命名空间数据 */
  static async getCompanyInformation () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: AUTH_COMPANY + namespace + '/profile'
    }).then(data => data)
  }
  /* 获取一个组织详细信息 */
  static async getOrganizationInfo () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: '/v1/orgs/' + namespace
    }).then(data => data)
  }
  static async updateCompanyLogo (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: '/v1/users/' + namespace + 'logo',
      data
    })
  }
}
