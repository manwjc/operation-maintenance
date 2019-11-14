/*
* Mirror 项目
*/
import rbHttp from 'assets/js/utility/rb-http.factory'
const URL = '/v1/alerts/monitor'
export default class rbAlertRepPanelServiceFactory {

  static async getEsData (dataSet) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `${URL}/getEsData`,
      data: dataSet
    }).then(function (data) {
      return data
    })
  }
  static async create (filterScene) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `${URL}/create`,
      data: filterScene
    }).then(function (data) {
      return data
    })
  }
  static async update (filterScene) {
    return rbHttp.sendRequest({
      method: 'PUT',
      url: `${URL}/update`,
      data: filterScene
    }).then(function (data) {
      return data
    })
  }
  static async delete (id) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      url: `${URL}/delete/` + id,
      params: {
        id: id
      }
    }).then(function (data) {
      return data
    })
  }
  static async getByKey (id) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `${URL}/detail/` + id,
      params: {
        id: id
      }
    }).then(function (data) {
      return data
    })
  }

  static async getByName (name) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `${URL}/check/` + name,
      params: {
        name: name
      }
    }).then(function (data) {
      return data
    })
  }

  static async getAll () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `${URL}/selectAll`
    }).then(function (data) {
      return data
    })
  }

  static async getIP (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/cmdb/instanceSearch/selectInstanceByPage`,
      data: data
    }).then(function (data) {
      return data
    })
  }

  static async getMonitorItem (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `${URL}/getMoniterItems`,
      data: data
    }).then(function (data) {
      return data
    })
  }

  static async getMonitorItemList (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `${URL}/getMoniObjectList`,
      data: data
    }).then(function (data) {
      return data
    })
  }

}
