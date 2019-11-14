/*
* @author huangzhijie
* @date   19.2.25
* @description 系统管理-功能角色请求接口
*/
import rbHttp from 'assets/js/utility/rb-http.factory'

export default class LogServiceFactory {
  // 获取日志过滤规则列表
  static async getLogFilterRuleList () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/log/getLogFilterRuleList`
    }).then(function (data) {
      return data
    })
  }
  // 创建日志过滤规则
  static async createLogFilterRule (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: `/v1/log/createLogFilterRule`
    }).then(function (data) {
      return data
    })
  }
  // 获取日志过滤规则详情
  static async getLogFilterRuleDetail (uuid) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: {
        'uuid': uuid
      },
      url: `/v1/log/getLogFilterRuleDetail`
    }).then(function (data) {
      return data
    })
  }
  // 删除日志过滤规则
  static async deleteLogFilterRule (uuid) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      params: {
        'uuid': uuid
      },
      url: `/v1/log/deleteLogFilterRule`
    }).then(function (data) {
      return data
    })
  }
  // 更新日志过滤规则
  static async updateLogFilterRule (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: `/v1/log/updateLogFilterRule`
    }).then(function (data) {
      return data
    })
  }
  // 根据过滤规则获取日志数据
  static async getLogDataByFilterRule (uuid, pageNo, pageSize) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: {
        'uuid': uuid,
        'pageNo': pageNo,
        'pageSize': pageSize
      },
      url: `/v1/log/getLogDataByFilterRule`
    }).then(function (data) {
      return data
    })
  }
  // 获取日志告警规则列表
  static async getLogAlertRuleList (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/v1/log/getLogAlertRuleList`
    }).then(function (data) {
      return data
    })
  }
  // 创建日志告警规则
  static async createLogAlertRule (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: `/v1/log/createLogAlertRule`
    }).then(function (data) {
      return data
    })
  }
  // 获取日志告警规则详情
  static async getLogAlertRuleDetail (uuid) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: {
        'uuid': uuid
      },
      url: `/v1/log/getLogAlertRuleDetail`
    }).then(function (data) {
      return data
    })
  }
  // 删除日志告警规则
  static async deleteLogAlertRule (uuid) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      data: uuid,
      url: `/v1/log/deleteLogAlertRule`
    }).then(function (data) {
      return data
    })
  }
  // 更新日志告警规则
  static async updateLogAlertRule (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: `/v1/log/updateLogAlertRule`
    }).then(function (data) {
      return data
    })
  }
  // 启用日志告警规则
  static async openLogAlertRule (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: `/v1/log/openLogAlertRule`
    }).then(function (data) {
      return data
    })
  }
  // 停用日志告警规则
  static async closeLogAlertRule (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: `/v1/log/closeLogAlertRule`
    }).then(function (data) {
      return data
    })
  }
}
