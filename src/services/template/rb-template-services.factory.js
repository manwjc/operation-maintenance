/*
 * Mirror 项目
 */
import rbHttp from 'assets/js/utility/rb-http.factory'

export default class rbProjectDataServiceFactory {
  // 模板接口方法
  static async findTemName(str) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/template/findByName/${str}`
    }).then(function (data) {
      return data
    })
  }

  static async getList(obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: '/v1/template/list'
    }).then(function (data) {
      return data
    })
  }

  static async getZbxList(str) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/template/zbxTemplateList/${str}`
    }).then(function (data) {
      return data
    })
  }

  static async detail(str) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/template/${str}`
    }).then(function (data) {
      return data
    })
  }

  static async creat(obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: '/v1/template/'
    }).then(function (data) {
      return data
    })
  }

  static async delete(obj) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      url: `/v1/template/${obj.template_ids}`
    }).then(function (data) {
      return data
    })
  }

  static async update(obj) {
    return rbHttp.sendRequest({
      method: 'PUT',
      data: obj,
      url: `/v1/template/${obj.template_id}`
    }).then(function (data) {
      return data
    })
  }

  static async copy(str) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/template/copy/${str}`
    }).then(function (data) {
      return data
    })
  }

  // 巡检项接口方法
  static async getItemList(obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: '/v1/items/pageList'
    }).then(function (data) {
      return data
    })
  }

  static async getItemDetail(str) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/items/${str}`
    }).then(function (data) {
      return data
    })
  }

  static async getZbxItem(obj) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: obj,
      url: '/v1/items/zbxItem/list'
    }).then(function (data) {
      return data
    })
  }

  static async creatItem(obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      params: {
        'resource_type': 'template',
        'action': 'create'
      },
      url: '/v1/items/create'
    }).then(function (data) {
      return data
    })
  }

  static async batchCreatItem(obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      params: {
        'resource_type': 'template',
        'action': 'create'
      },
      url: '/v1/items/batchCreate'
    }).then(function (data) {
      return data
    })
  }

  static async updateItem(arr) {
    return rbHttp.sendRequest({
      method: 'PUT',
      data: arr[0],
      params: {
        'resource_type': 'template',
        'action': 'update'
      },
      url: `/v1/items/${arr[1]}`
    }).then(function (data) {
      return data
    })
  }

  static async deleteItem(str) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      params: {
        'resource_type': 'template',
        'action': 'delete'
      },
      url: `/v1/items/${str}`
    }).then(function (data) {
      return data
    })
  }

  // 任务接口方法
  static async getTaskList(obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: '/v1/task/list'
    }).then(function (data) {
      return data
    })
  }

  static async getTaskDetail(str) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/task/${str}`
    }).then(function (data) {
      return data
    })
  }

  static async creatTask(obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: '/v1/task/insert'
    }).then(function (data) {
      return data
    })
  }

  static async deleteTask(str) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      url: `/v1/task/${str}`
    }).then(function (data) {
      return data
    })
  }

  static async updateTask(arr) {
    return rbHttp.sendRequest({
      method: 'PUT',
      data: arr[0],
      url: `/v1/task/${arr[1]}`
    }).then(function (data) {
      return data
    })
  }

  // 任务报告
  static async getTaskReport(obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: '/v1/report/list'
    }).then(function (data) {
      return data
    })
  }

  static async getReportDetail(str) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/report/${str}`
    }).then(function (data) {
      return data
    })
  }

  // 设备相关接口
  static async deivceSelectConditionList() {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/task/deivceSelectConditionList`
    }).then(function (data) {
      return data
    })
  }

  static async getRoomList() {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/cmdb/getRoomList`
    }).then(function (data) {
      return data
    })
  }

  static async getModuleTree() {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/cmdb/getModuleTree`
    }).then(function (data) {
      return data
    })
  }

  static async getDeviceList(obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: '/v1/cmdb/deviceList'
    }).then(function (data) {
      return data
    })
  }

  static async getUserList(arr) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: arr[1],
      url: `/v1/task/userList/${arr[0]}`
    }).then(function (data) {
      return data
    })
  }

  // 任务调度相关接口
  static async addScheduling(str) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/task/addScheduling/${str}`
    }).then(function (data) {
      return data
    })
  }

  static async stopScheduling(str) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/task/stopScheduling/${str}`
    }).then(function (data) {
      return data
    })
  }

  static async execute(str) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/task/execute/${str}`
    }).then(function (data) {
      return data
    })
  }

  // 报表导出
  static async exportResultTable(arr) {
    return rbHttp.sendRequest({
      method: 'GET',
      binary: true,
      url: `/v1/report/export/${arr[0]}/${arr[1]}`
    }).then(function (data) {
      return data
    })
  }

  // 告警模块告警处理
  static async getAlertList(obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/v1/alerts/list`
    }).then(function (data) {
      return data
    })
  }

  static async deleteAlert(obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/v1/alerts/alertRemove`
    }).then(function (data) {
      return data
    })
  }

  static async getAlertDetail(str) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/alertDetail/${str}`
    }).then(function (data) {
      return data
    })
  }

  static async getAlertHisList(obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/v1/alerts_his/list`
    }).then(function (data) {
      return data
    })
  }

  static async getAlertHisDetail(str) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts_his/${str}`
    }).then(function (data) {
      return data
    })
  }

  static async getBizSysList() {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/cmdb/getBizSysList`
    }).then(function (data) {
      return data
    })
  }

  static async getConfigDictByType(data) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: data,
      url: `/v1/cmdb/configDict/getDictsByType`
    }).then(function (data) {
      return data
    })
  }

  static async alertNotify(obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/v1/alerts/emailNotify`
    }).then(function (data) {
      return data
    })
  }

  static async alertSMSNotify(obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/v1/alerts/smsNotify`
    }).then(function (data) {
      return data
    })
  }

  static async alertHandle(obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/v1/alerts/alertOrder`
    }).then(function (data) {
      return data
    })
  }

  // 主题模块
  static async getThemeList(obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/v1/theme/pageList`
    }).then(function (data) {
      return data
    })
  }

  // 主题模块
  static async getThemeByObjectType(object_type) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/theme/selectByObjectType/${object_type}`
    }).then(function (data) {
      return data
    })
  }

  static async creatTheme(obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: '/v1/theme/create'
    }).then(function (data) {
      return data
    })
  }

  static async updateTheme(arr) {
    return rbHttp.sendRequest({
      method: 'PUT',
      data: arr[0],
      url: `/v1/theme/${arr[1]}`
    }).then(function (data) {
      return data
    })
  }

  static async deleteTheme(str) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      url: `/v1/theme/${str}`
    }).then(function (data) {
      return data
    })
  }

  static async getThemeDetail(str) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/theme/${str}`
    }).then(function (data) {
      return data
    })
  }
  // 校验主题名称重复
  static async getThemeName(str) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/theme/validThemeName/${str}`
    }).then(function (data) {
      return data
    })
  }

  static async creatThemeData(obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: '/v1/theme/createThemeData'
    }).then(function (data) {
      return data
    })
  }
  // 得到主题数据
  static async getThemeData(arr) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: arr[0],
      url: `/v1/theme/getThemeData/${arr[1]}`
    }).then(function (data) {
      return data
    })
  }

  static async getThemeEcharts(obj) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: obj,
      url: `/v1/theme/getTrendMapData`
    }).then(function (data) {
      return data
    })
  }
  // 查看日志数据
  static async getThemeDataHis(str) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/theme/getThemeDataHis/${str}`
    }).then(function (data) {
      return data
    })
  }
  // 下载日志
  static async downLoadExplainDoc() {
    return rbHttp.sendRequest({
      method: 'GET',
      binary: true,
      url: `/v1/theme/downloadExplainDoc`
    }).then(function (data) {
      return data
    })
  }
  // 获取路径
  static async getThemeDateAccessUrl() {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/theme/getThemeDateAccessUrl`
    }).then(function (data) {
      return data
    })
  }
  // 业务模板 新增巡检项
  static async creatBizItem(obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      params: {
        'resource_type': 'template',
        'action': 'create'
      },
      url: '/v1/items/create'
    }).then(function (data) {
      return data
    })
  }
  // 获取触发器
  static async getTemplateTrigger(str) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: {
        templateId: str
      },
      url: `/v1/triggers/listByTemplateId/${str}`
    }).then(function (data) {
      return data
    })
  }
  // 日志校验
  static async ruleDimList(obj) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: obj,
      url: `/v1/theme/validLogContent`
    }).then(function (data) {
      return data
    })
  }

  static async getIdctypes() {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/cmdb/instance/getIdcTree`
    }).then(function (data) {
      return data
    })
  }

  static async getDeviceTypes() {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/cmdb/instance/getDeviceClassTree`
    }).then(function (data) {
      return data
    })
  }
}
