/*
 * Mirror 项目
 */
import rbHttp from 'assets/js/utility/rb-http.factory'

export default class rbProjectDataServiceFactory {
  // 获取权限菜单
  static async authMenus (arr) {
    return rbHttp
      .sendRequest({
        method: 'GET',
        url: `/v1/roles/${arr[0]}/getRoleByUserName/${arr[1]}`
      })
      .then(function (data) {
        return data
      })
  }
  // 获取设备树方法
  static async getDeviceTree (obj) {
    return rbHttp
      .sendRequest({
        method: 'POST',
        params: obj,
        url: `/v1/configManagement/getNewDeviceTree`
      })
      .then(function (data) {
        return data
      })
  }
  // 获取新设备树方法--zhangjinjian
  static async getNewDeviceTree (obj) {
    return rbHttp
      .sendRequest({
        method: 'POST',
        params: obj,
        url: `/v1/configManagement/getNewDeviceTree`
      })
      .then(function (data) {
        return data
      })
  }
  // 获取配置页面设备树方法
  static async getDeviceTrees (obj) {
    return rbHttp
      .sendRequest({
        method: 'POST',
        params: obj,
        url: `/v1/configManagement/getNewDeviceTree`
      })
      .then(function (data) {
        return data
      })
  }
  // 获取整个设备树方法
  static async getAllDeviceTree (obj) {
    return rbHttp
      .sendRequest({
        method: 'POST',
        params: obj,
        url: `/v1/configManagement/getNewDeviceTree`
      })
      .then(function (data) {
        return data
      })
  }
  // 获取人员列表
  static async userPageList (obj) {
    return rbHttp
      .sendRequest({
        method: 'POST',
        params: obj,
        url: `/v1/user/pageList`
      })
      .then(function (data) {
        return data
      })
  }
  // 获取数据字典
  static async getDicsByColNames (obj) {
    return rbHttp
      .sendRequest({
        method: 'GET',
        params: obj,
        url: `/v1/configManagement/getDicsByColNames`
      })
      .then(function (data) {
        return data
      })
  }
  // 获取子设备数据字典
  static async getSubListByUpDict (obj) {
    return rbHttp
      .sendRequest({
        method: 'GET',
        params: obj,
        url: `/v1/configManagement/getSubListByUpDict`
      })
      .then(function (data) {
        return data
      })
  }
  // 获取接入服务器
  static async getAllBInterface () {
    return rbHttp
      .sendRequest({
        method: 'GET',
        url: `/v1/configManagement/getAllBInterface`
      })
      .then(function (data) {
        return data
      })
  }
  // 网管设备创建
  static async saveNmsDevice (obj) {
    return rbHttp
      .sendRequest({
        method: 'POST',
        data: obj,
        url: `/v1/configManagement/saveNmsDevice`
      })
      .then(function (data) {
        return data
      })
  }
  // 监控中心创建
  static async saveIscPrecinct (obj) {
    return rbHttp
      .sendRequest({
        method: 'POST',
        data: obj,
        url: `/v1/configManagement/saveIscPrecinct`
      })
      .then(function (data) {
        return data
      })
  }
  // 普通区域创建
  static async savePrecinct (obj) {
    return rbHttp
      .sendRequest({
        method: 'POST',
        data: obj,
        url: `/v1/configManagement/savePrecinct`
      })
      .then(function (data) {
        return data
      })
  }
  // 站点创建
  static async saveSitePrecinct (obj) {
    return rbHttp
      .sendRequest({
        method: 'POST',
        data: obj,
        url: `/v1/configManagement/saveSitePrecinct`
      })
      .then(function (data) {
        return data
      })
  }
  // 机房创建
  static async saveStationPrecinct (obj) {
    return rbHttp
      .sendRequest({
        method: 'POST',
        data: obj,
        url: `/v1/configManagement/saveStationPrecinct`
      })
      .then(function (data) {
        return data
      })
  }
  // FSU创建
  static async saveFSU (obj) {
    return rbHttp
      .sendRequest({
        method: 'POST',
        data: obj,
        url: `/v1/configManagement/saveFSU`
      })
      .then(function (data) {
        return data
      })
  }
  // 删除区域
  static async delById (obj) {
    return rbHttp
      .sendRequest({
        method: 'DELETE',
        params: obj,
        url: `/v1/configManagement/delById`
      })
      .then(function (data) {
        return data
      })
  }
  // 删除FSU
  static async delFsuById (obj) {
    return rbHttp
      .sendRequest({
        method: 'DELETE',
        params: obj,
        url: `/v1/configManagement/delFsuById`
      })
      .then(function (data) {
        return data
      })
  }
  // 根据名称获取设备或者区域列表
  static async getListByName (obj) {
    return rbHttp
      .sendRequest({
        method: 'GET',
        params: obj,
        url: `/v1/configManagement/listByName`
      })
      .then(function (data) {
        return data
      })
  }
  // 根据查询条件获取树结构数据
  static async getQueryParamTree (obj) {
    return rbHttp
      .sendRequest({
        method: 'POST',
        params: obj,
        url: `/v1/configManagement/queryParamTree`
      })
      .then(function (data) {
        return data
      })
  }
  // 获取右侧信息已废弃
  static async queryObj (obj) {
    return rbHttp
      .sendRequest({
        method: 'GET',
        params: obj,
        url: `/v1/configManagement/queryObj`
      })
      .then(function (data) {
        return data
      })
  }
  // 获取右侧信息区域
  static async getPrecinctPageList (obj) {
    return rbHttp
      .sendRequest({
        method: 'POST',
        params: obj,
        url: `/v1/configManagement/getPrecinctPageList`
      })
      .then(function (data) {
        return data
      })
  }
  // 获取右侧信息设备
  static async getDevicePageList (obj) {
    return rbHttp
      .sendRequest({
        method: 'POST',
        params: obj,
        url: `/v1/configManagement/getDevicePageList`
      })
      .then(function (data) {
        return data
      })
  }
  // 修改获取详情信息
  static async getById (obj) {
    return rbHttp
      .sendRequest({
        method: 'GET',
        params: obj,
        url: `/v1/configManagement/getById`
      })
      .then(function (data) {
        return data
      })
  }
  // 修改获取设备详情信息
  static async getDeviceInfo (obj) {
    return rbHttp
      .sendRequest({
        method: 'GET',
        params: obj,
        url: `/v1/configManagement/getDeviceInfo`
      })
      .then(function (data) {
        return data
      })
  }
  // 判断是否重复fsuCode
  static async isFsuCodeExist (obj) {
    return rbHttp
      .sendRequest({
        method: 'GET',
        params: obj,
        url: `/v1/configManagement/isFsuCodeExist`
      })
      .then(function (data) {
        return data
      })
  }
  // 保存设备系统
  static async saveDeviceSys (obj) {
    return rbHttp
      .sendRequest({
        method: 'POST',
        params: obj,
        url: `/v1/configManagement/deviceSys/save`
      })
      .then(function (data) {
        return data
      })
  }
  // 获取设备系统详情
  static async getDeviceSys (obj) {
    return rbHttp
      .sendRequest({
        method: 'GET',
        url: `/v1/configManagement/deviceSys/getDetail/${obj}`
      })
      .then(function (data) {
        return data
      })
  }
  // 获取设备系统分页数据
  static async getPageList (obj) {
    return rbHttp
      .sendRequest({
        method: 'POST',
        params: obj,
        url: `/v1/configManagement/deviceSys/pageList`
      })
      .then(function (data) {
        return data
      })
  }
  // 根据设备系统id查询分页设置的数据
  static async getPageSysDetailList (obj) {
    return rbHttp
      .sendRequest({
        method: 'POST',
        params: obj,
        url: `/v1/configManagement/deviceSys/pageSysDetailList`
      })
      .then(function (data) {
        return data
      })
  }
  // 删除设备系统
  static async deleteDeviceSys (obj) {
    return rbHttp
      .sendRequest({
        method: 'DELETE',
        url: `/v1/configManagement/deviceSys/delete/${obj}`
      })
      .then(function (data) {
        return data
      })
  }
}
