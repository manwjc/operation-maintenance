import rbHttp from 'assets/js/utility/rb-http.factory'

const deviceStatistic = '/v1/cmdb/deviceStatistic'
const invalidResource = '/v1/cmdb/invalidResource'
const configureChange = '/v1/cmdb/configureChange'
//

export default class deviceStatisticService {
  // 各类型设备的数量统计
  static async selectDeviceBydeviceType (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: deviceStatistic + `/selectDeviceBydeviceType`
    }).then(function (data) {
      return data
    })
  }
  // 各类型的各品牌设备数量统计
  static async selectDeviceBydeviceTypeDeviceMfrs (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: deviceStatistic + `/selectDeviceBydeviceTypeDeviceMfrs`
    }).then(function (data) {
      return data
    })
  }
  // 各资源池各类型的数量统计
  static async selectDeviceByidcTypeDeviceType (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: deviceStatistic + `/selectDeviceByidcTypeDeviceType`
    }).then(function (data) {
      return data
    })
  }
  // 各业务系统各分类数量统计
  static async selectDeviceBybizSystem (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: deviceStatistic + `/selectDeviceBybizSystem`
    }).then(function (data) {
      return data
    })
  }
  // 各归属部门各分类数量统计
  static async selectDeviceByDepartment (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: deviceStatistic + `/selectDeviceByDepartment`
    }).then(function (data) {
      return data
    })
  }
  // 下载各类型设备的数量统计
  static async downloadDeviceBydeviceType (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      binary: true,
      url: deviceStatistic + `/downloadDeviceBydeviceType`
    }).then(function (data) {
      return data
    })
  }
  // 下载各类型的各品牌设备数量统计
  static async downloadDeviceBydeviceTypeDeviceMfrs (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      binary: true,
      url: deviceStatistic + `/downloadDeviceBydeviceTypeDeviceMfrs`
    }).then(function (data) {
      return data
    })
  }
  // 下载各资源池各类型的数量统计
  static async downloadDeviceByidcTypeDeviceType (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      binary: true,
      url: deviceStatistic + `/downloadDeviceByidcTypeDeviceType`
    }).then(function (data) {
      return data
    })
  }
  // 下载各业务系统进行各分类数量统计
  static async downloadDeviceBybizSystem (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      binary: true,
      url: deviceStatistic + `/downloadDeviceBybizSystem`
    }).then(function (data) {
      return data
    })
  }
  // 下载各归属部门进行各分类数量统计
  static async downloadDeviceByDepartment (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      binary: true,
      url: deviceStatistic + `/downloadDeviceByDepartment`
    }).then(function (data) {
      return data
    })
  }

  // 低效无效资源统计
  static async selectInvalidResource (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: invalidResource + `/selectInvalidResource`
    }).then(function (data) {
      return data
    })
  }

  // 低效无效资源统计下载
  static async downloadInvalidResource (data,getObj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      params: getObj,
      binary: true,
      url: invalidResource + `/downloadInvalidResource`
    }).then(function (data) {
      return data
    })
  }

  // 配置项变更统计
  static async selectConfigureChange (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: configureChange + `/selectConfigureChange`
    }).then(function (data) {
      return data
    })
  }

  // 配置项变更统计下载
  static async downloadConfigureChange (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      binary: true,
      url: configureChange + `/downloadConfigureChange`
    }).then(function (data) {
      return data
    })
  }

  // 各资源池各类型的数量统计
  static async selectIdcStatistic () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: deviceStatistic + `/idcTypeStatistic`
    }).then(function (data) {
      return data
    })
  }

  // 资源池下工期统计
  static async selectProjectStatistic (params) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: params,
      url: deviceStatistic + `/projectStatistic`
    }).then(function (data) {
      return data
    })
  }

  // 指定资源池、工期下的POD池统计
  static async selectPodStatistic (params) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: params,
      url: deviceStatistic + `/podStatistic`
    }).then(function (data) {
      return data
    })
  }

  // 下载各资源池各类型的数量统计
  static async downloadReport (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      binary: true,
      url: deviceStatistic + `/downloadReport`
    }).then(function (data) {
      return data
    })
  }
}
