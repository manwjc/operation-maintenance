/**
 * 项目工程service
 */
import rbAccountService from './rb-account-service.factory'
import rbHttp from 'assets/js/utility/rb-http.factory'

const namespace = rbAccountService.getCurrentNamespace()
const PROJECTS_URL = `/v1/projects/${namespace}/`
const PROJECT_TEMPLATES_URL = `/v1/project-templates/${namespace}/`
const PROJECT_RESOURCE_URL = `/v1/projects/${namespace}/resources/`
const PROJECT_DETAIL_URL = `/v1/projects/${namespace}/`
const PROJECT_ROLE_URL = `/v1/roles/${namespace}/`
const PROJECT_ACCOUNT_URL = `/v1/orgs/${namespace}/accounts/`

export default class rbProjectDataServiceFactory {
  static async getProjects () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: PROJECTS_URL
    }).then(data => data)
  }
  static async getProjectTemplates () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: PROJECT_TEMPLATES_URL
    }).then(data => data)
  }
  static async getProjectResources () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: PROJECT_RESOURCE_URL
    }).then(data => data)
  }
  static async createProject (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: PROJECTS_URL,
      data
    })
  }
  static async modifyProject (data) {
    return rbHttp.sendRequest({
      method: 'PUT',
      url: PROJECTS_URL + data.project_name,
      data
    })
  }
  static async getProjectDetail ({project_name}) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: PROJECT_DETAIL_URL + project_name
    }).then(data => data)
  }
  static async deleteProject ({project_name}) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      url: PROJECT_DETAIL_URL + project_name
    })
  }
  static async deleteRole ({role_name, project_name}) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      url: PROJECT_ROLE_URL + role_name,
      params: {
        project_name: project_name
      }
    })
  }
  static async getRoleUsers ({role_name, project_name}) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: PROJECT_ROLE_URL + role_name + '/users',
      params: {
        project_name: project_name
      }
    }).then(data => data)
  }
  static async getUserRoles ({username, project_name}) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: '/v1/orgs/' + namespace + '/accounts/' + username + '/roles',
      params: {
        project_name: project_name
      }
    }).then(data => data)
  }
  static async revokeRoleUsers (data, {role_name, project_name}) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      url: PROJECT_ROLE_URL + role_name + '/users',
      data,
      params: {
        project_name: project_name
      }
    })
  }
  static async getProjectDetailStatus ({project_name}) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: PROJECT_DETAIL_URL + project_name + '/status'
    }).then(data => data)
  }
  static async getProjectRoles ({page = 1, page_size = 20, project_name, search, action = 'view'}) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: PROJECT_ROLE_URL,
      params: {
        page: page,
        page_size: page_size,
        project_name: project_name,
        namespace: namespace,
        action: action,
        search: search
      }
    }).then(data => data)
  }
  static async getProjectAccounts ({page = 1, page_size = 20, project_name, search, assign}) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: PROJECT_ACCOUNT_URL,
      params: {
        page: page,
        page_size: page_size,
        project_name: project_name,
        namespace: namespace,
        order_by: 'username',
        search: search,
        assign: assign
      }
    }).then(data => data)
  }
  static async assignUserRoles (data, {username, project_name}) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: '/v1/orgs/' + namespace + '/accounts/' + username + '/roles',
      data,
      params: {
        project_name: project_name
      }
    }).then(data => data)
  }
  static async assignRoleUsers (data, {role_name, project_name}) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: '/v1/roles/' + namespace + '/' + role_name + '/users',
      data,
      params: {
        project_name: project_name
      }
    }).then(data => data)
  }
  static async saveAsTemplate (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/project-templates/${namespace}`,
      data
    }).then(data => data)
  }
}
