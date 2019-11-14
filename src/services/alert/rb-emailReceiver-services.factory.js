/*
* Mirror 项目
*/
import rbHttp from 'assets/js/utility/rb-http.factory'
const URL = '/v1/alerts/mail/strategy'
export default class rbEmailReceiverServiceFactory {
  static async getList (page) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/alerts/mail/strategy-list`,
      data: page
    }).then(function (data) {
      return data
    })
  }
  static async create (filterScene) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `${URL}`,
      data: filterScene
    }).then(function (data) {
      return data
    })
  }
  static async update (filterScene) {
    return rbHttp.sendRequest({
      method: 'PUT',
      url: `${URL}`,
      data: filterScene
    }).then(function (data) {
      return data
    })
  }
  static async delete (ids) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      url: `${URL}/` + ids,
      params: {
        ids: ids
      }
    }).then(function (data) {
      return data
    })
  }
  static async getByKey (id) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `${URL}/` + id,
      params: {
        id: id
      }
    }).then(function (data) {
      return data
    })
  }
  static async getFilterRecords (page) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/alerts/mail/resolve-records`,
      data: page
    }).then(function (data) {
      return data
    })
  }
}
