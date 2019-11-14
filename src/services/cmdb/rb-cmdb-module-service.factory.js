import rbHttp from 'assets/js/utility/rb-http.factory'
// const ModuleEndPoint = '/cmdb/module'
const ModuleEndPoint = '/v1/cmdb/module'
// const IconEndPoint = '/cmdb/icon'
const IconEndPoint = '/v1/cmdb/icon'
const DictEndPoint = '/v1/cmdb/configDict'
const ValidEndPoint = '/v1/cmdb/code/validate'

export default class cmdbModueService {
  /* icon */
  static async getIcons (params, body) {
    return rbHttp.sendRequest({
      method: 'POST',
      params: params,
      data: body,
      url: IconEndPoint + `/getIcons`
    }).then(function (data) {
      return data
    })
  }
  /* dict */
  static async getDictByColName (col_name) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: DictEndPoint + `/getTree/${col_name}`
    }).then(function (data) {
      return data
    })
  }
  /* icon */
  static async listValid () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: ValidEndPoint + `/list`
    }).then(function (data) {
      return data
    })
  }
  /* module */
  static async getModuleTree () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: ModuleEndPoint + '/getTree'
    }).then(function (data) {
      return data
    })
  }
  static async addModule (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      timeout: 600000,
      url: ModuleEndPoint + '/addModule'
    }).then(function (data) {
      return data
    })
  }

  static async getModuleSelective (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      params: data,
      url: ModuleEndPoint + '/getModuleSelective'
    }).then(function (data) {
      return data
    })
  }
  static async getModuleDetail (moduleId) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: ModuleEndPoint + `/getModuleDetail?moduleId=${moduleId}`
    }).then(function (data) {
      return data
    })
  }

  static async addModuleCode (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      timeout: 600000,
      url: ModuleEndPoint + `/addModuleCode`
    }).then(function (data) {
      return data
    })
  }

  static async updateModule (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      timeout: 600000,
      url: ModuleEndPoint + `/updateModule`
    }).then(function (data) {
      return data
    })
  }
  static async getModuleTags (moduleId) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: ModuleEndPoint + `/getModuleTag/${moduleId}`
    }).then(function (data) {
      return data
    })
  }
  static async deleteModule (moduleId) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      timeout: 600000,
      url: ModuleEndPoint + `/deleteModule/${moduleId}`
    }).then(function (data) {
      return data
    })
  }
  static async queryTableData (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      timeout: 600000,
      data: data,
      url: ModuleEndPoint + `/queryTableData/`
    }).then(function (data) {
      return data
    })
  }
}
