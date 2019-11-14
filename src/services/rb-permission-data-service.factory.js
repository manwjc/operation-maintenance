/**
 * 操作权限service
 */
import rbAccountService from './rb-account-service.factory'
import rbHttp from 'assets/js/utility/rb-http.factory'

const namespace = rbAccountService.getCurrentNamespace()

export default class rbPermissionDataServiceFactory {
  static async getPermission ({resource_type, context}) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: '/v1/permissions/' + namespace + '/' + resource_type,
      params: {
        context: context
      }
    }).then(data => data)
  }
}
