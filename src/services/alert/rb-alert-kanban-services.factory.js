/*
* Mirror 项目
*/
import rbHttp from 'assets/js/utility/rb-http.factory'

export default class rbAlertKanBanServiceFactory {
  // 资源总览系统存储分配总览
  static async getStorageEstimateData (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/resource/ResourceHighChart/getStorageEstimateData/`
    }).then(function (data) {
      return data
    })
  }
// 获取告警列表
  static async getAlertList (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/v1/alerts/statistic/query-his/`
    }).then(function (data) {
      return data
    })
  }
// 获取过滤条件下的告警列表
  static async getSearchAlertList (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/v1/alerts/statistic/query`
    }).then(function (data) {
      return data
    })
  }
 // 告警派单
  static async alertHandle (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/v1/alerts/alertOrder`
    }).then(function (data) {
      return data
    })
  }

  // 告警转派
  static async alertTransfer (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/v1/alerts/alertTransfer`
    }).then(function (data) {
      return data
    })
  }

  // 告警确认
  static async alertConfirm (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/v1/alerts/alertConfirm`
    }).then(function (data) {
      return data
    })
  }

  // 删除告警
  static async deleteAlert (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/v1/alerts/alertRemove`
    }).then(function (data) {
      return data
    })
  }
  static async ExportGridData (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      binary: true,
      url: '/v1/alerts/statistic/export'
    }).then(function (data) {
      return data
    })
  }

  static async ExportGridData1 (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      // binary: true,
      url: '/v1/alerts/statistic/export-his'
    }).then(function (data) {
      return data
    })
  }

  static async ExportCorfGridData (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      binary: true,
      url: `/v1/alerts/alertDetailDownload/${data.alert_id}?module=${data.module}`
    }).then(function (data) {
      return data
    })
  }

  static async ExportDataFromDetail (url, req) {
    return rbHttp.sendRequest({
      method: 'GET',
      binary: true,
      url: url,
      params: req
    }).then(function (data) {
      return data
    })
  }

  static async alertRecordDownload (url) {
    return rbHttp.sendRequest({
      method: 'GET',
      binary: true,
      url: url
    }).then(function (data) {
      return data
    })
  }

  static async alertGenerateDownload (url) {
    return rbHttp.sendRequest({
      method: 'GET',
      binary: true,
      url: url
    }).then(function (data) {
      return data
    })
  }

  static async alertNotifyDownload (url) {
    return rbHttp.sendRequest({
      method: 'GET',
      binary: true,
      url: url
    }).then(function (data) {
      return data
    })
  }

  static async bizSysTree () {
    let subElement = function (item, p_id) {
      let element = {
        resource: item.uuid || 'all',
        general: false,
        name: item.name,
        parentResource: p_id || 'all',
        childList: []
      }
      if (item.subList && item.subList.length > 0) {
        _(item.subList).forEach(subItem => {
          element.childList.push(subElement(subItem, item.uuid))
        })
      }
      return element
    }
    return rbHttp.sendRequest({
      method: 'GET',
      url: '/v1/cmdb/orgManager/loadTreeDepBiz?namespace=alauda'
    }).then(function (data) {
      let sys_tree = []
      let root = {
        resource: 'all',
        general: false,
        name: '所有',
        childList: []
      }
      _(data).forEach(item => {
        root.childList.push(subElement(item, root.resource))
      })
      sys_tree.push(root)
      return sys_tree
    })
  }

  static async bizSysTreeOptions () {
    let subElement = function (item) {
      let element = {
        id: item.name,
        label: item.name,
        children: []
      }
      if (item.subList && item.subList.length > 0) {
        _(item.subList).forEach(subItem => {
          element.children.push(subElement(subItem))
        })
      } else {
        element.children = null
      }
      return element
    }
    return rbHttp.sendRequest({
      method: 'GET',
      url: '/v1/cmdb/orgManager/loadTreeDepBiz?namespace=alauda'
    }).then(function (data) {
      let biz_tree = []
      let root = {
        id: '',
        label: '所有',
        children: []
      }
      _(data).forEach(item => {
        root.children.push(subElement(item))
      })
      biz_tree.push(root)
      return biz_tree
    })
  }

  static async bizSysTreeOptionByResourcePollSel (pool) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: '/v1/cmdb/instance/getDepartmentsByIDC?idcType=' + pool || ''
    }).then(pooldeps => {
      return pooldeps
    })
  }
}
