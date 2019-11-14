import rbHttp from 'src/assets/js/utility/rb-http.factory.js'
const ENDPOINT_ROLE = '/v1/permissions'
const namespace = sessionStorage.getItem('namespace')
export default class rbRoleDataServiceFactory {
  static getContextPermissions (resource_type) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `${ENDPOINT_ROLE}/${namespace}/${resource_type}`,
      cache: false
    }).catch(() => [])
  }

  /**
   * 获取菜单权限
   * @param username 用户名
   */
  static getMenuPermissions (username, is_admin = false) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `${ENDPOINT_ROLE}/${namespace}/${username}/actions`,
      params: {is_admin},
      cache: false
    }).catch(() => [])
  }
  // function getRoleList({
  //   search = '',
  //   page = 1,
  //   page_size = 20,
  //   action = 'view'
  // }) {
  //   return rbHttp.sendRequest({
  //     method: 'GET',
  //     url: ENDPOINT_ROLE + 'role_list',
  //     params: {
  //       search,
  //       page,
  //       page_size,
  //       order_by: 'created_at',
  //       action
  //     }
  //   });
  // }
  //
  // function createRole(data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     url: ENDPOINT_ROLE + 'role',
  //     data
  //   });
  // }
  //
  // function getRole(role_name) {
  //   return rbHttp.sendRequest({
  //     method: 'GET',
  //     url: ENDPOINT_ROLE + 'role',
  //     params: {
  //       role_name
  //     }
  //   });
  // }
  //
  // function deleteRole(role_name) {
  //   return rbHttp.sendRequest({
  //     method: 'DELETE',
  //     url: ENDPOINT_ROLE + 'role',
  //     params: {
  //       role_name
  //     }
  //   });
  // }
  //
  // function addPermissionOfRole(role_name, data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     url: ENDPOINT_ROLE + 'role_permissions',
  //     data,
  //     params: {
  //       role_name
  //     }
  //   });
  // }
  //
  // function updatePermissionOfRole(role_name, permission_uuid, data) {
  //   return rbHttp.sendRequest({
  //     method: 'PUT',
  //     url: ENDPOINT_ROLE + 'role_permissions',
  //     data,
  //     params: {
  //       role_name,
  //       permission_uuid
  //     }
  //   });
  // }
  //
  // function deletePermissionOfRole(role_name, permission_uuid) {
  //   return rbHttp.sendRequest({
  //     method: 'DELETE',
  //     url: ENDPOINT_ROLE + 'role_permissions',
  //     params: {
  //       role_name,
  //       permission_uuid
  //     }
  //   });
  // }
  //
  // function addParent(role_name, data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     url: ENDPOINT_ROLE + 'parent',
  //     params: {
  //       role_name
  //     },
  //     data
  //   });
  // }
  //
  // function deleteParent(role_name, parent_uuid) {
  //   return rbHttp.sendRequest({
  //     method: 'DELETE',
  //     url: ENDPOINT_ROLE + 'parent',
  //     params: {
  //       role_name,
  //       parent_uuid
  //     }
  //   });
  // }
  //
  // function getRoleSchemaList() {
  //   return rbHttp.sendRequest({
  //     method: 'GET',
  //     url: ENDPOINT_ROLE + 'role_schema'
  //   }).then((data) => data.result).catch(() => {
  //     return [];
  //   });
  // }
  //
  // function getRoleSchema(resource_type = '') {
  //   return rbHttp.sendRequest({
  //     method: 'GET',
  //     url: ENDPOINT_ROLE + 'role_schema',
  //     params: {
  //       resource_type
  //     }
  //   });
  // }
  //
  // function listRoleUsers(role_name) {
  //   return rbHttp.sendRequest({
  //     method: 'GET',
  //     url: ENDPOINT_ROLE + 'role_users',
  //     params: {
  //       role_name
  //     }
  //   });
  // }
  //
  // function addRoleUsers(role_name, users) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     url: ENDPOINT_ROLE + 'role_users',
  //     params: {
  //       role_name
  //     },
  //     data: {
  //       users: users
  //     }
  //   });
  // }
  //
  // function deleteRoleUsers(role_name, users) {
  //   return rbHttp.sendRequest({
  //     method: 'DELETE',
  //     url: ENDPOINT_ROLE + 'role_users',
  //     params: {
  //       role_name
  //     },
  //     data: {
  //       users: users
  //     }
  //   });
  // }
  //
  // function createRoleUser(role_name, data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     url: ENDPOINT_ROLE + 'role_users',
  //     params: {
  //       role_name
  //     },
  //     data
  //   });
  // }
  //
  // function deleteRoleUser(role_name, data) {
  //   return rbHttp.sendRequest({
  //     method: 'DELETE',
  //     url: ENDPOINT_ROLE + 'role_users',
  //     params: {
  //       role_name
  //     },
  //     data
  //   });
  // }
}
