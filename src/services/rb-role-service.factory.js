import rbHttp from 'assets/js/utility/rb-http.factory'

const ROLES_ENDPOINT = '/v1/roles/'
const NAMESPACE = sessionStorage.getItem('namespace')
const ROLE_URL = `/v1/roles/${NAMESPACE}/`
export default class rbConfigurationService {
  static async deleteRoles (name) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      url: `${ROLES_ENDPOINT}${NAMESPACE}/${name}`
    })
  }
  static async roleList ({filterKey = '', page = 1, page_size = 20}) {
    return rbHttp.sendRequest({
      url: ROLES_ENDPOINT + NAMESPACE,
      params: {
        page: page,
        page_size: page_size,
        search: filterKey
      }
    }).then((data) => {
      return data
    })
  }
  static async createConfiguration (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: ROLES_ENDPOINT + NAMESPACE,
      data
    })
  }
  static async getRoleUsers ({role_name}) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: ROLE_URL + role_name + '/users'
    }).then(data => data)
  }
  static async revokeRoleUsers (data, {role_name}) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      url: ROLE_URL + role_name + '/users',
      data
    })
  }
  static async roleDetail (role_name) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: ROLE_URL + role_name
    }).then(data => data)
  }
  static async revokeParentRole (role_name, parent_uuid) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      url: ROLE_URL + role_name + '/parents' + '/' + parent_uuid
    })
  }
  static async addPermission (role_name, data) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: ROLE_URL + role_name + '/permissions',
      data
    })
  }
  static async revokePermission (role_name, permission_uuid) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      url: ROLE_URL + role_name + '/permissions' + '/' + permission_uuid
    })
  }
  static async updatePermission (role_name, permission_uuid, data) {
    return rbHttp.sendRequest({
      method: 'PUT',
      url: ROLE_URL + role_name + '/permissions' + '/' + permission_uuid,
      data
    })
  }
  static async addUsersForRole (data, role_name) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: ROLE_URL + role_name + '/users',
      data
    }).then(data => data)
  }
  static async addParentForRole (data, role_name) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: ROLE_URL + role_name + '/parents',
      data
    }).then(data => data)
  }
  static async getAllRoleSchemas () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: '/v1/role-schema'
    }).then(data => data)
  }
  static async getOneRoleSchema (resource_type) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: '/v1/role-schema/' + resource_type
    }).then(data => data)
  }
  static async createRole (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: ROLE_URL,
      data
    }).then(data => data)
  }
  static async updateLogo (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: '/v1/users/' + NAMESPACE + '/logo',
      data
    })
  }
}
