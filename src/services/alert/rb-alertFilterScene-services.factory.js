/*
* Mirror 项目
*/
import rbHttp from 'assets/js/utility/rb-http.factory'
const URL = '/v1/alerts/filterScene'
export default class rbAlertFilterSceneServiceFactory {
  static async getList (page) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `${URL}/pageList`,
      data: page
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
  static async update (id, filterScene) {
    return rbHttp.sendRequest({
      method: 'PUT',
      url: `${URL}/update/` + id,
      params: {
        filterScene_id: id
      },
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
        filterScene_id: id
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
        filterScene_id: id
      }
    }).then(function (data) {
      return data
    })
  }

  static async getByName (name, filterId) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `${URL}/check/` + name,
      params: {
        filterScene_name: name,
        filter_id: filterId
      }
    }).then(function (data) {
      return data
    })
  }

  static async getOptionAll () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `${URL}/options`
    }).then(function (data) {
      return data
    })
  }
  static async getOptionByType (queryType) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `${URL}/options/${queryType}`
    }).then(function (data) {
      return data
    })
  }
  static async getSourceVal (url, method) {
    return rbHttp.sendRequest({
      method: method,
      url: `/v1/` + url
    }).then(function (data) {
      return data
    })
  }
}
