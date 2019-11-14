/*
 * Mirror 项目
 */
import rbHttp from 'assets/js/utility/rb-http.factory'

export default class rbAlertServiceFactory {
  static async getAlertNum() {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/statistic/summary`
    }).then(function (data) {
      return data
    })
  }
  static async getAlertLevel(type) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/statistic/level-span`,
      params: {
        'span': type
      }
    }).then(function (data) {
      return data
    })
  }
  static async getNewAlert() {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/statistic/latest`,
      params: {
        'limit': 10
      }
    }).then(function (data) {
      return data
    })
  }
  static async getAlertLine(type) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/statistic/trend`,
      params: {
        'span': type
      }
    }).then(function (data) {
      return data
    })
  }
  static async getAlertType(type) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/statistic/classify-span`,
      params: {
        'span': type
      }
    }).then(function (data) {
      return data
    })
  }

  static async getDictByCode(code) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/cmdb/configDict/getDictsByType`,
      params: {
        'type': code
      }
    })
  }

  static async getAlertRes(type) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/statistic/source-classify-span`,
      params: {
        'span': type
      }
    }).then(function (data) {
      return data
    })
  }

  static async getAlertDetail(alert_id) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/alertDetail/` + alert_id
    }).then(function (data) {
      return data
    })
  }

  static async getAlertCount(code) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/statistic/overview/`,
      params: {
        'codes': code
      }
    }).then(function (data) {
      return data
    })
  }

  static async changeRemarkContent(id, note) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/updateNote/` + id,
      params: {
        'note': note
      }
    }).then(function (data) {
      return data
    })
  }

  static async changeHisAlertRemarkContent(id, note) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts_his/updateNote/` + id,
      params: {
        'note': note
      }
    }).then(function (data) {
      return data
    })
  }

  static async getMonitorValue() {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/statistic/monit-obj-list`
    }).then(function (data) {
      return data
    })
  }

  static async getHisMonitorValue() {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/statistic/monit-obj-list-his`
    }).then(function (data) {
      return data
    })
  }

  static async getHisAlertDetail(str) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts_his/alertDetail/${str}`
    }).then(function (data) {
      return data
    })
  }

  static async alertGenerateList(request) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/alertGenerateList`,
      params: request
    }).then(function (data) {
      return data
    })
  }

  static async alertRecordList(request) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/alertRecordList`,
      params: request
    }).then(function (data) {
      return data
    })
  }

  static async alertNotifyList(request) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/alertNotifyList`,
      params: request
    }).then(function (data) {
      return data
    })
  }

  static async alertHisGenerateList(request) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts_his/alertGenerateList`,
      params: request
    }).then(function (data) {
      return data
    })
  }

  static async getInspectionDaily(page) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/alerts/report/inspection_daily`,
      data: page
    }).then(function (data) {
      return data
    })
  }

  // 导出
  static async exportData(data) {
    return rbHttp.sendRequest({
      method: 'POST',
      params: data,
      binary: true,
      url: `/v1/alerts/report/exportDaily`
    }).then(function (data) {
      return data
    })
  }

  // 告警监控信息
  static async getAlertMonitInfo(params) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: '/v1/alerts/zabbix/item',
      params: params
    }).then(function (data) {
      return data
    })
  }
  // 触发器列表
  static async getTriggerInfo(params) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: '/v1/alerts/zabbix/trigger',
      params: params
    }).then(function (data) {
      return data
    })
  }
  // 监控项数据
  static async getProcessLoad(params) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: '/v1/alerts/zabbix/trends',
      params: params
    }).then(function (data) {
      return data
    })
  }

  // 安全漏洞扫描汇总
  static async getSecurityLeakScan(params) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: '/v1/alerts/leak-scan/summary',
      params: params
    }).then(function (data) {
      return data
    })
  }

  //  安全漏洞扫描报告
  static async getSecurityLeakScanReport(params) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: '/v1/alerts/leak-scan/report',
      params: params
    }).then(function (data) {
      return data
    })
  }

  // 根据ID获取扫描记录信息
  static async getSecurityLeakScanById(id) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: '/v1/alerts/leak-scan/record/' + id
    }).then(function (data) {
      return data
    })
  }

  // 安全漏洞扫描导出
  static async exportSecurityLeakScanRecords(params) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: '/v1/alerts/leak-scan/export',
      binary: true,
      params: params
    }).then(function (data) {
      return data
    })
  }

  static async getAlertHisList(params) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: '/v1/alerts_his/getAlertHisList',
      data: params
    }).then(function (data) {
      return data
    })
  }

  static async getAlertSummaryByDeviceClass(code) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: {
        'code': code
      },
      url: `/v1/alerts/statistic/getAlertSummaryByDeviceClass`
    }).then(function (data) {
      return data
    })
  }

  static async getAlertSummary() {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/statistic/getAlertSummary`
    }).then(function (data) {
      return data
    })
  }

  static async getCurrentAlertByInstanceId(params) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: '/v1/alerts/statistic/query',
      data: params
    }).then(function (data) {
      return data
    })
  }

  static async getHistoryAlertByInstanceId(params) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: '/v1/alerts/statistic/query-his',
      data: params
    }).then(function (data) {
      return data
    })
  }


}
