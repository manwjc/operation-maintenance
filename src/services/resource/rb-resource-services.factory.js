/*
* Mirror 项目
*/
import rbHttp from 'assets/js/utility/rb-http.factory'

export default class rbProjectDataServiceFactory {
  // 资源接口方法
  static async resourceBuildList (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/resource/resourceCollect/getResouceBuildManageData/`
    }).then(function (data) {
      return data
    })
  }
  // 提交excel得到数据
  static async getExcelData (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/resource/resourceCollect/GetExcelData/`
    }).then(function (data) {
      return data
    })
  }
  // 保存excel数据
  static async saveExcelData (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      useFormData: true,
      url: `/resource/resourceCollect/saveExcelData/`
    }).then(function (data) {
      return data
    })
  }
  // 导出模板
  static async exportGridData (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      params: obj,
      binary: true,
      url: `/resource/resourceCollect/exportGridData/`
    }).then(function (data) {
      return data
    })
  }
  // 收集数据导出
  static async resourceCollectExportGridData (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      useFormData: true,
      binary: true,
      url: `/resource/resourceCollect/resourceCollectExportGridData/`
    }).then(function (data) {
      return data
    })
  }
  // 配置数据字典 资源预估
  static async resourcePool (obj) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/resource/resourceEstimate/getResourcePoolAll_config/`
    }).then(function (data) {
      return data
    })
  }
  // 预估列表
  static async resourceEstimateList (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      useFormData: true,
      url: `/resource/resourceEstimate/gridData/`
    }).then(function (data) {
      return data
    })
  }
  // 资源信息查询列表
  static async collectGridData (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      useFormData: true,
      url: `/resource/resourceEstimate/collectGridData/`
    }).then(function (data) {
      return data
    })
  }
  // 修改时的列表
  static async collectGridDataAll (arr) {
    return rbHttp.sendRequest({
      method: 'POST',
      params: arr,
      url: `/resource/resourceEstimate/collectGridDataAll`
    }).then(function (data) {
      return data
    })
  }
  // 资源信息查询第二步
  static async getCollectByCollectIds (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/resource/resourceEstimate/getCollectByCollectIds/`
    }).then(function (data) {
      return data
    })
  }
  // 关闭
  static async closeEstimate (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/resource/resourceEstimate/closeEstimate/`
    }).then(function (data) {
      return data
    })
  }
  // 录入修改
  static async addOrEditEstimate (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/resource/resourceEstimate/addOrEditEstimate/`
    }).then(function (data) {
      return data
    })
  }
  // 资源建设 配置接口
  static async getComboboxData (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/resource/resourceBuildManage/getComboboxData/`
    }).then(function (data) {
      return data
    })
  }
  // 资源池列表
  static async getResourceEstimate (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/resource/resourceBuildManage/getResourceEstimate/`
    }).then(function (data) {
      return data
    })
  }
  // 建设列表
  static async getResouceBuildManageData (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/resource/resourceBuildManage/getResouceBuildManageData/`
    }).then(function (data) {
      return data
    })
  }
  // 开启接口
  static async importOpen (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/resource/resourceBuildManage/importOpen/`
    }).then(function (data) {
      return data
    })
  }
  // 关闭接口
  static async importClose (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/resource/resourceBuildManage/importClose/`
    }).then(function (data) {
      return data
    })
  }
  // 资源建设名称接口
  static async getResourceBuildName (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/resource/resourceBuildManage/getResourceBuildName/`
    }).then(function (data) {
      return data
    })
  }
  // 资源建设添加接口
  static async addResourceBuild (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/resource/resourceBuildManage/addResourceBuild/`
    }).then(function (data) {
      return data
    })
  }
  // 资源建设修改接口
  static async getResourceBuildData (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/resource/resourceBuildManage/getResourceBuildData/`
    }).then(function (data) {
      return data
    })
  }
  // 资源建设修改更新接口
  static async updateResourceBuild (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/resource/resourceBuildManage/updateResourceBuild/`
    }).then(function (data) {
      return data
    })
  }
  // 资源建设下载模板
  static async exportGridDataCMDB2 (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      params: obj,
      binary: true,
      url: `/resource/resourceBuildManage/exportGridDataCMDB2/`
    }).then(function (data) {
      return data
    })
  }
  // 提交excel得到数据
  static async GetCmdbHostAssetsExcelData (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/resource/cmdb/GetCmdbHostAssetsExcelData/`
    }).then(function (data) {
      return data
    })
  }
  // 资源建设保存excel数据
  static async saveCmdbHostAssetsExcelData (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      useFormData: true,
      url: `/resource/resourceBuildManage/saveCmdbHostAssetsExcelData/`
    }).then(function (data) {
      return data
    })
  }
  // 建设数据导出
  static async resourceBuildExportGridData (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      useFormData: true,
      binary: true,
      url: `/resource/authComponent/resourceBuildExportGridData/`
    }).then(function (data) {
      return data
    })
  }
  // 预分配资源池数据字典
  static async resourcePoolJsonDatas (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      params: obj,
      url: `/resource/component/jsonDatas/`
    }).then(function (data) {
      return data
    })
  }
  // 预分配数据列表
  static async distributedGridata (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      useFormData: true,
      url: `/resource/resource/gridData/`
    }).then(function (data) {
      return data
    })
  }
  // 分配数据列表
  static async distributedGridata1 (arr) {
    return rbHttp.sendRequest({
      method: 'POST',
      params: arr[0],
      data: arr[1],
      useFormData: true,
      url: `/resource/authComponent/gridData/`
    }).then(function (data) {
      return data
    })
  }
  // 分配厂商品牌数据字典
  static async getBrand (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      params: obj,
      url: `/resource/cmdb/getBrand/`
    }).then(function (data) {
      return data
    })
  }
  // 分配数据字典
  static async jsonDatas (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      params: obj,
      url: `/resource/component/jsonDatas/`
    }).then(function (data) {
      return data
    })
  }
  // 分配查询
  static async cmdbAdvancedSearchDeviceIdList (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      params: obj,
      url: `/resource/cmdb/cmdbAdvancedSearchDeviceIdList/`
    }).then(function (data) {
      return data
    })
  }
  // 分配查询分页
  static async gridData1 (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      useFormData: true,
      url: `/resource/component/gridData_1/`
    }).then(function (data) {
      return data
    })
  }
  // 预分配
  static async preAsset (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/resource/resource/asset/`
    }).then(function (data) {
      return data
    })
  }
  // 预分配保存excel数据
  static async saveExcelData1 (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      useFormData: true,
      url: `/resource/resource/saveExcelData/`
    }).then(function (data) {
      return data
    })
  }
  // 资源总览资源池字典
  // static async getResourcePool (obj) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     data: obj,
  //     url: `/resource/ResourceHighChart/getResourcePool/`
  //   }).then(function (data) {
  //     return data
  //   })
  // }
  static async getResourcePool (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/cmdb/form/getDictValue?formId=5b63f7e78ff7443fb6a92613b07f99e6`
    }).then(function (data) {
      return data
    })
  }

  // 资源总览
  static async getOverviewData (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/resource/ResourceHighChart/getOverviewData/`
    }).then(function (data) {
      return data
    })
  }
  // 资源总览服务器总览
  static async getServerOverviewData (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/resource/ResourceHighChart/getServerOverviewData/`
    }).then(function (data) {
      return data
    })
  }
  // 资源总览系统存储总览
  static async getStorageOverviewData (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/resource/ResourceHighChart/getStorageOverviewData/`
    }).then(function (data) {
      return data
    })
  }
  // 资源总览服务器分配总览
  static async getServerEstimateData (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/resource/ResourceHighChart/getServerEstimateData/`
    }).then(function (data) {
      return data
    })
  }
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

  // 资源总览系统存储分配总览
  static async getBizSysList () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/cmdb/getBizSysList`
    }).then(function (data) {
      return data
    })
  }
  // 资源接口方法
  static async saveCollect (obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/resource/resourceCollect/insertResourceCollect`
    }).then(function (data) {
      return data
    })
  }
}
