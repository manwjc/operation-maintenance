import rbHttp from 'src/assets/js/utility/rb-http.factory.js'
const ENDPOINT_ROLE = '/v1/permissions'
const namespace = sessionStorage.getItem('namespace')
export default class rbRolePermissionServiceFactory {
  static async getPermissions (resource_type) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `${ENDPOINT_ROLE}/${namespace}/${resource_type}`
    }).then(data => {
      return data
    })
  }
}
