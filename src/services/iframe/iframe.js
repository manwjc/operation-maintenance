/*
 * Mirror 项目
 */
import rbHttp from 'assets/js/utility/rb-http.factory'

// import {
//   setSessionStorage,
//   removeSessionStorage,
//   getSessionStorage
// } from "../../pages/resource/iframe/iframeHome/components/middleKey/storage";

export default class iframe {
  // POD池/ v1/cmdb/index/countIdcAndPod
  static async getCountIdcAndPod() {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/cmdb/index/countIdcAndPod`
    }).then(function(data) {
      return data
    })
  }
  // / v1/cmdb/index/countDeviceByDeviceClass 这个接口 获取服务器、网络、存储、安全等设备的数量
  static async getCountDeviceByDeviceClass() {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/cmdb/index/countDeviceByDeviceClass`
    }).then(function(data) {
      return data
    })
  }

  // 信息港资源池第一级饼图GET /v1/cmdb/index/countByIdcDevCT
  static async getCountByIdcDevCT(data) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/cmdb/index/countByIdcDevCT`,
      params: data
    }).then(function(data) {
      return data
    })
  }
  // // 信息港资源池第二级饼图 GET /v1/cmdb/index/countByIdcDevCT
  // static async getCountByIdcDevCT2 () {
  //   let IdcType = getSessionStorage('idcType')
  //   return rbHttp.sendRequest({
  //     method: 'GET',
  //     url: `/v1/cmdb/index/countByIdcDevCT?idcType=` +IdcType
  //   }).then(function (data) {
  //     return data
  //   })
  // }

  // 信息港资源池第二级 GET /v1/cmdb/index/countByIdcPro
  static async getCountByIdcPro(data) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/cmdb/index/countByIdcPro`,
      params: data
    }).then(function(data) {
      return data
    })
  }

  // 各资源池租户分布饼图GET /v1/cmdb/index/countBizByIdc
  static async getCountBizByIdc() {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/cmdb/index/countBizByIdc`
    }).then(function(data) {
      return data
    })
  }
  // 租户一级柱子GET /v1/cmdb/index/countBizByIdcDep1
  static async getCountBizByIdcDep1(data) {
    // let IdcType1 = getSessionStorage('idcType1')
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/cmdb/index/countBizByIdcDep1`,
      params: data
    }).then(function(data) {
      return data
    })
  }
  // 初始化租户一级柱子GET /v1/cmdb/index/countBizByIdcDep1
  // static async getCountBizByIdcDep10 () {
  //     return rbHttp.sendRequest({
  //       method: 'GET',
  //       url: `/v1/cmdb/index/countBizByIdcDep1`
  //     }).then(function (data) {
  //       return data
  //     })
  //   }
  // 租户二级环形图GET /v1/cmdb/index/countBizByDep1
  static async getCountBizByDep1(data) {
    // let Department = getSessionStorage('department')
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/cmdb/index/countBizByDep1`,
      params: data
    }).then(function(data) {
      return data
    })
  }
  // 租户二级柱子图GETGET GET /v1/cmdb/index/countBizByIdcDep2
  static async getCountBizByIdcDep2(data) {
    // let Department1 = getSessionStorage('department2')
    // let Department = getSessionStorage('department')
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/cmdb/index/countBizByIdcDep2`,
      params: data
    }).then(function(data) {
      return data
    })
  }
  // 初始化不传值  租户二级柱子图GETGET GET /v1/cmdb/index/countBizByIdcDep2
  // static async getCountBizByIdcDep20 () {
  //   let Department = getSessionStorage('department')
  //   return rbHttp.sendRequest({
  //     method: 'GET',
  //     url: `/v1/cmdb/index/countBizByIdcDep2?department1=`+ Department
  //   }).then(function (data) {
  //     return data
  //   })
  // }

  // 各资源池一级部门下二级部门下各业务系统的设备数量
  static async getCountByIdcDep2Biz(data) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/cmdb/index/countByIdcDep2Biz`,
      params: data
    }).then(function(data) {
      return data
    })
  }
  // 统计该项目下各pod池下设备数据
  static async getCountByIdcDevPro(data) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/cmdb/index/countByIdcDevPro`,
      params: data
    }).then(function(data) {
      return data
    })
  }
}
