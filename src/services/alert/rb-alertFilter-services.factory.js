/*
* Mirror 项目
*/
import rbHttp from 'assets/js/utility/rb-http.factory'

export default class rbAlertFilterServiceFactory {
  static async getList (page) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/alerts/alerts_filter/pageList`,
      data: page
    }).then(function (data) {
      return data
    })
  }
  static async create (filter) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/alerts/alerts_filter/create`,
      data: filter
    }).then(function (data) {
      return data
    })
  }
  static async update (id, filter) {
    return rbHttp.sendRequest({
      method: 'PUT',
      url: `/v1/alerts/alerts_filter/update/` + id,
      params: {
        filter_id: id
      },
      data: filter
    }).then(function (data) {
      return data
    })
  }
  static async delete (id) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      url: `/v1/alerts/alerts_filter/delete/` + id,
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
      url: `/v1/alerts/alerts_filter/detail/` + id,
      params: {
        filter_id: id
      }
    }).then(function (data) {
      return data
    })
  }

  static async getByName (name) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/alerts_filter/check/` + name,
      params: {
        filter_name: name
      }
    }).then(function (data) {
      return data
    })
  }

  static async getAll (filterFlag) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/alerts_filter/selectAll`,
      params: {
        filterFlag: filterFlag
      }
    }).then(function (data) {
      return data
    })
  }

  static async getFilterData (page) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/alerts/alerts_filter/filterData`,
      data: page
    }).then(function (data) {
      return data
    })
  }

  static async ExportFilterGridData (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      binary: true,
      url: `/v1/alerts/alerts_filter/exportFilterAlerts`
    }).then(function (data) {
      return data
    })
  }

  static async getFilterScene (id) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/alerts_filter/filter/` + id
    }).then(function (data) {
      return data
    })
  }

  static async querySceneByFilterId (id) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/alerts_filter/querySceneByFilterId/` + id
    }).then(function (data) {
      return data
    })
  }

  static async copy (filter) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/alerts/alerts_filter/copy`,
      data: filter
    }).then(function (data) {
      return data
    })
  }
}
