import rbHttp from 'assets/js/utility/rb-http.factory'
const InstanceEndPoint = '/v1/cmdb/instance'
const SearchEndPoint = '/v1/cmdb/search'
const ModuleEndPoint = '/v1/cmdb/module'
const IconEndPoint = '/v1/cmdb/icon'
const ProcessEndPoint = '/v1/cmdb/process'
const CollectEndPoint = '/v1/cmdb/collect'
const CollectUnknownEndPoint = '/v1/cmdb/collectUnknown'
const ApprovalEndPoint = '/v1/cmdb/collect/approval'
const QueryEndPoint = '/v1/cmdb/query'
const DiscoveryRulePoint = '/v1/cmdb/discovery/rule'
const DiscoveryLogPoint = '/v1/cmdb/discovery/log'
const AllocateIpConfig = '/v1/cmdb/allocateIp'
const DemandPoint = '/v1/cmdb/demandManager'
const InstanceBpmEndpoint = '/v1/cmdb/instanceBpm'
const InstancePortRelationEndpoint = '/v1/cmdb/instancePortRelation'
const NetworkCardEndPoint = '/v1/cmdb/networkCard'

export default class cmdbService {
  /* cricle */
  // static async getHistoryByActionType (query_data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     data: query_data,
  //     url: CricleEndPoint + 'monitor/monitor/autoSendInfo'
  //   }).then(function (data) {
  //     return data
  //   })
  // }

  static async getModuleTree (query_data) {
    return rbHttp.sendRequest({
      method: 'GET',
      data: query_data,
      url: ModuleEndPoint + '/getTree'
    }).then(function (data) {
      return data
    })
  }

  // static async getMaintainViewMenu (query_data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     data: query_data,
  //     url: CricleEndPoint + '/getMaintainViewMenu'
  //   }).then(function (data) {
  //     return data
  //   })
  // }

  // static async deleteMaintainView (query_data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     data: query_data,
  //     url: CricleEndPoint + '/deleteMaintainView'
  //   }).then(function (data) {
  //     return data
  //   })
  // }

  // // 查询圈子
  // static async getCircles (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     params: data,
  //     url: CricleEndPoint + '/getCircles'
  //   }).then(function (data) {
  //     return data
  //   })
  // }

  // // 校验名称
  // static async checkName (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     data: data,
  //     url: CricleEndPoint + '/checkName'
  //   }).then(function (data) {
  //     return data
  //   })
  // }

  // static async getInstanceByView (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     params: data,
  //     url: CricleEndPoint + '/getInstanceByView'
  //   }).then(function (data) {
  //     return data
  //   })
  // }

  // static async deleteInstance (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     params: data,
  //     url: CricleEndPoint + '/deleteInstance'
  //   }).then(function (data) {
  //     return data
  //   })
  // }

  // static async updateTagName (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     params: data,
  //     url: CricleEndPoint + '/updateTagName'
  //   }).then(function (data) {
  //     return data
  //   })
  // }

  // static async getAllCircles (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     data: data,
  //     url: CricleEndPoint + '/getAllCircles'
  //   }).then(function (data) {
  //     return data
  //   })
  // }

  // static async getHistoryByInstanceId (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     data: data,
  //     url: CricleEndPoint + '/getHistoryByInstanceId'
  //   }).then(function (data) {
  //     return data
  //   })
  // }

  // static async checkViewName (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     data: data,
  //     url: CricleEndPoint + '/checkViewName'
  //   }).then(function (data) {
  //     return data
  //   })
  // }

  // static async addMaintainView (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     data: data,
  //     url: CricleEndPoint + '/addMaintainView'
  //   }).then(function (data) {
  //     return data
  //   })
  // }

  // static async add (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     data: data,
  //     url: CricleEndPoint + '/add'
  //   }).then(function (data) {
  //     return data
  //   })
  // }

  // static async delete (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     data: data,
  //     url: CricleEndPoint + '/delete'
  //   }).then(function (data) {
  //     return data
  //   })
  // }
  //
  // static async update (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     data: data,
  //     url: CricleEndPoint + '/update'
  //   }).then(function (data) {
  //     return data
  //   })
  // }
  //
  // static async getCircle (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     params: data,
  //     url: CricleEndPoint + '/getCircle'
  //   }).then(function (data) {
  //     return data
  //   })
  // }
  //
  // static async goHead (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     params: data,
  //     url: CricleEndPoint + '/goHead'
  //   }).then(function (data) {
  //     return data
  //   })
  // }
  //
  // static async editMaintainView (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     data: data,
  //     url: CricleEndPoint + '/editMaintainView'
  //   }).then(function (data) {
  //     return data
  //   })
  // }
  //
  // static async getMaintainView (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     data: data,
  //     url: CricleEndPoint + '/getMaintainView'
  //   }).then(function (data) {
  //     return data
  //   })
  // }

  /* instance */
  static async getInstanceHeader (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      data: data,
      url: InstanceEndPoint + '/header?moduleId=' + (data || '')
    }).then(function (data) {
      return data
    })
  }
  static async getInstanceList (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: InstanceEndPoint + '/list'
    }).then(function (data) {
      return data
    })
  }
  static async exportInstanceList (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      // binary: true,
      url: InstanceEndPoint + '/export'
    }).then(function (data) {
      return data
    })
  }
  static async addInstance (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: InstanceEndPoint + '/add'
    }).then(function (data) {
      return data
    })
  }

  static async updateInstance (id, data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: InstanceEndPoint + `/update/${id}`
    }).then(function (data) {
      return data
    })
  }

  static async getFullInstance (instanceId, params) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: params,
      url: InstanceEndPoint + `/detail/${instanceId}`
    }).then(function (data) {
      return data
    })
  }

  static async deleteInstance (data) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      data: data,
      url: InstanceEndPoint + '/delete'
    }).then(function (data) {
      return data
    })
  }

  static async getFormValuesByModuleId (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: InstanceEndPoint + '/getFormValuesByModuleId'
    }).then(function (data) {
      return data
    })
  }

  static async checkInstancenName (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: InstanceEndPoint + '/checkInstancenName'
    }).then(function (data) {
      return data
    })
  }

  static async updateFormValues (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: InstanceEndPoint + '/updateFormValues'
    }).then(function (data) {
      return data
    })
  }

  static async getFormValues (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: InstanceEndPoint + '/getFormValues'
    }).then(function (data) {
      return data
    })
  }

  static async handUpInstance (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: InstanceEndPoint + '/handUpInstance'
    }).then(function (data) {
      return data
    })
  }

  static async queryDeviceByRoomAndIP (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/cmdb/instance/queryDeviceByRoomAndIP`,
      params: data
    }).then((res) => {
      return res
    })
  }

  /* repertryInstance */
  // static async getDynamicInstanceColumn (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     data: data,
  //     url: RepInstanceEndPoint + '/getDynamicInstanceColumn'
  //   }).then(function (data) {
  //     return data
  //   })
  // }
  //
  // static async updateByBatch (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     data: data,
  //     url: RepInstanceEndPoint + '/updateByBatch'
  //   }).then(function (data) {
  //     return data
  //   })
  // }
  //
  // static async exportExcel (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     params: data,
  //     binary: true,
  //     url: RepInstanceEndPoint + '/exportExcel'
  //   }).then(function (data) {
  //     return data
  //   })
  // }
  // /* relatiomap */
  // static async checkRelationName (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     data: data,
  //     url: RelatiomapEndPoint + '/checkRelationName'
  //   }).then(function (data) {
  //     return data
  //   })
  // }
  //
  // static async getRelanptionByCondition (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     params: data,
  //     url: RelatiomapEndPoint + `/getRelationByCondition`
  //   }).then(function (data) {
  //     return data
  //   })
  // }
  //
  // static async addModuleRelation (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     params: data,
  //     url: RelatiomapEndPoint + '/addModuleRelation'
  //   }).then(function (data) {
  //     return data
  //   })
  // }
  //
  // static async addRelatioType (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     data: data,
  //     url: RelatiomapEndPoint + '/addRelatioType'
  //   }).then(function (data) {
  //     return data
  //   })
  // }
  //
  // static async delRelatioType (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     data: data,
  //     url: RelatiomapEndPoint + '/delRelatioType'
  //   }).then(function (data) {
  //     return data
  //   })
  // }
  //
  // static async getAllRelatioType (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     data: data,
  //     url: RelatiomapEndPoint + '/getAllRelatioType'
  //   }).then(function (data) {
  //     return data
  //   })
  // }
  //
  // static async getModuleByCondition (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     params: data,
  //     url: RelatiomapEndPoint + '/getModuleByCondition'
  //   }).then(function (data) {
  //     return data
  //   })
  // }
  //
  // static async getInstanceRelationByCondition (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     data: data,
  //     url: RelatiomapEndPoint + '/getInstanceRelationByCondition'
  //   }).then(function (data) {
  //     return data
  //   })
  // }
  //
  //
  // static async getInstanceRetionByModule (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     data: data,
  //     url: RelatiomapEndPoint + '/getInstanceRetionByModule'
  //   }).then(function (data) {
  //     return data
  //   })
  // }
  //
  // static async addInstanceRelation (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     data: data,
  //     url: RelatiomapEndPoint + '/addInstanceRelation'
  //   }).then(function (data) {
  //     return data
  //   })
  // }
  //
  // static async checkInstanceRelation (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     data: data,
  //     url: RelatiomapEndPoint + '/checkInstanceRelation'
  //   }).then(function (data) {
  //     return data
  //   })
  // }
  //
  // static async getRelationByCondition (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     data: data,
  //     url: RelatiomapEndPoint + '/getRelationByCondition'
  //   }).then(function (data) {
  //     return data
  //   })
  // }
  //
  // static async deleteModuleRelation (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     data: data,
  //     url: RelatiomapEndPoint + '/deleteModuleRelation'
  //   }).then(function (data) {
  //     return data
  //   })
  // }
  //
  // /* form */
  // static async getFormRule () {
  //   return rbHttp.sendRequest({
  //     method: 'GET',
  //     url: FormEndPoint + '/getFormRule'
  //   }).then(function (data) {
  //     return data
  //   })
  // }
  //
  // static async getDictValue (data) {
  //   return rbHttp.sendRequest({
  //     method: 'GET',
  //     params: data,
  //     url: FormEndPoint + '/getDictValue'
  //   }).then(function (data) {
  //     return data
  //   })
  // }
  //
  // static async getForms (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     data: data,
  //     url: FormEndPoint + '/getForms'
  //   }).then(function (data) {
  //     return data
  //   })
  // }
  //
  // static async updateForm (data) {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     data: data,
  //     url: FormEndPoint + '/updateForm'
  //   }).then(function (data) {
  //     return data
  //   })
  // }
  //
  // static async getDicts () {
  //   return rbHttp.sendRequest({
  //     method: 'GET',
  //     url: FormEndPoint + '/getDicts'
  //   }).then(function (data) {
  //     return data
  //   })
  // }

  /* module */
  static async getModule () {
    return rbHttp.sendRequest({
      method: 'POST',
      url: ModuleEndPoint + '/getModule'
    }).then(function (data) {
      return data
    })
  }
  // 根据主机ID获取模型数据
  static async getModuleByInstanceId (instance_id) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: ModuleEndPoint + '/getModuleByInstanceId?instance_id=' + instance_id
    }).then(function (data) {
      return data
    })
  }
  static async getModuleSelective (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      params: data,
      url: ModuleEndPoint + '/getModuleSelective'
    }).then(function (data) {
      return data
    })
  }

  static async addModule (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: ModuleEndPoint + '/addModule'
    }).then(function (data) {
      return data
    })
  }

  static async getModuleTags (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: ModuleEndPoint + '/getModuleTags'
    }).then(function (data) {
      return data
    })
  }

  static async deleteModule (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      params: data,
      url: ModuleEndPoint + '/deleteModule'
    }).then(function (data) {
      return data
    })
  }

  static async updateModule (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: ModuleEndPoint + '/updateModule'
    }).then(function (data) {
      return data
    })
  }

  static async getScriptByTagId (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: ModuleEndPoint + '/getScriptByTagId'
    }).then(function (data) {
      return data
    })
  }

  /* icon */
  static async getIcons (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      params: data,
      url: IconEndPoint + '/getIcons'
    }).then(function (data) {
      return data
    })
  }

  static async downloadCMDBData (str) {
    return rbHttp.sendRequest({
      method: 'POST',
      binary: true,
      url: `/cmdb/repertory/downloadData/${str}`
    }).then(function (data) {
      return data
    })
  }
  static async downloadExcel (str) {
    return rbHttp.sendRequest({
      method: 'POST',
      binary: true,
      url: ModuleEndPoint + `/download/import/template/${str}`
    }).then(function (data) {
      return data
    })
  }
  static async getImportProcess (processId) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: ProcessEndPoint + '/import/' + processId
    }).then(function (data) {
      return data
    })
  }
  static async removeImportProcess (processId) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      url: ProcessEndPoint + '/import/' + processId
    }).then(function (data) {
      return data
    })
  }
  static async downloadProcessErrorRecord (processId) {
    return rbHttp.sendRequest({
      method: 'POST',
      binary: true,
      url: ProcessEndPoint + `/export/error/${processId}`
    }).then(function (data) {
      return data
    })
  }
  static async downloadReport (exportType, params) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: params,
      binary: true,
      url: ProcessEndPoint + `/export/${exportType}`
    }).then(function (data) {
      return data
    })
  }
  /* 信息采集 */
  static async listModule () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: CollectEndPoint + `/module/list`
    }).then(function (data) {
      return data
    })
  }

  static async getModulePropertys (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: CollectEndPoint + `/forms/` + data.moduleId
    }).then(function (data) {
      return data
    })
  }

  static async getDictByCode (code) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/cmdb/dict/getDict/${code}`
    }).then(function (data) {
      return data
    })
  }

  static async getDictsByType (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: data,
      url: `/v1/cmdb/configDict/getDictsByType`
    }).then(function(data) {
      return data
    })
  }

  static async getConfigTableData (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: CollectEndPoint + `/` + data.moduleId
    }).then(function (data) {
      return data
    })
  }
  static async deleteCollectConfig (id) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      url: CollectEndPoint + `/${id}`
    }).then(function (data) {
      return data
    })
  }

  static async saveAutoCollectConfig (data, moduleId) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: CollectEndPoint + `/${moduleId}`
    }).then(function (data) {
      return data
    })
  }

  static async getCollectRecordByCollectId (data, collectId) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: data,
      url: CollectEndPoint + `/getCollectRecord/${collectId}`
    }).then(function (data) {
      return data
    })
  }

  static async getChangeloglist (data, moduleId) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: CollectEndPoint + `/changelog/${moduleId}`
    }).then(function (data) {
      return data
    })
  }

  static async getColumnFilter (data) {
    if (!data.moduleId || data.moduleId === '') {
      data.moduleId = 'primary-instance'
    }
    return rbHttp.sendRequest({
      method: 'GET',
      url: SearchEndPoint + `/getOrInsertColumnFilter/${data.menuType}/${data.moduleId}`
    }).then(function (data) {
      return data
    })
  }

  static async updateColumnFilter (data) {
    if (!data.moduleId || data.moduleId === '') {
      data.moduleId = 'primary-instance'
    }
    return rbHttp.sendRequest({
      method: 'PUT',
      data: data,
      url: SearchEndPoint + '/updateColumnFilter'
    }).then(function (data) {
      return data
    })
  }

  static async getExceptionDetailByBatchId (batchId) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: CollectEndPoint + `/changelog/detail/${batchId}`
    }).then(function (data) {
      return data
    })
  }

  static async sendMail (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: CollectEndPoint + `/changelog/sendmail/`
    }).then(function (data) {
      return data
    })
  }

  static async changeLogExport (data, moduleId) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      binary: true,
      url: CollectEndPoint + `/changelog/export/${moduleId}`
    }).then(function (data) {
      return data
    })
  }

  /* 高级查询 */
  static async getAllQueryConditions (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: data,
      url: QueryEndPoint + `/condition/`
    }).then(function (data) {
      return data
    })
  }

  // 新增或修改自定义条件
  static async updateQueryConditions (data) {
    return rbHttp.sendRequest({
      method: 'PUT',
      data: data,
      url: QueryEndPoint + `/condition/update`
    }).then(function (data) {
      return data
    })
  }

  static async deleteQueryConditions (queryId) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      url: QueryEndPoint + `/condition/delete/${queryId}`
    }).then(function (data) {
      return data
    })
  }

  /* 新发现 */
  // 根据moduleId, 查询所有规则列表
  static async listRuleByModuleId (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data.queryData,
      params: data.params,
      url: DiscoveryRulePoint + `/list/${data.moduleId}`
    }).then(function (data) {
      return data
    })
  }
// 新发现规则页模型
  static async ruleListModule () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/cmdb/discovery/module/list`
    }).then(function (data) {
      return data
    })
  }

  // 新增新发现规则
  static async addDiscoveryRule (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data.ruleData,
      url: DiscoveryRulePoint + `/insert/${data.moduleId}`
    }).then(function (data) {
      return data
    })
  }

  // 修改新发现规则
  static async updateRule (data) {
    return rbHttp.sendRequest({
      method: 'PUT',
      data: data.ruleData,
      url: DiscoveryRulePoint + `/update/${data.moduleId}/${data.ruleId}`
    }).then(function (data) {
      return data
    })
  }

  // 删除新发现规则
  static async deleteRule (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data.ruleIds,
      url: DiscoveryRulePoint + `/delete/${data.moduleId}/`
    }).then(function (data) {
      return data
    })
  }

  // 导出新发现规则
  static async exportRule (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data.exportData,
      binary: true,
      url: DiscoveryRulePoint + `/export/${data.moduleId}`
    }).then(function (data) {
      return data
    })
  }

 /* 新发现数据管理 */
  // 获取新发现数据列表
  static async listDiscoveryLogs (moduleId, data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data.queryData,
      params: data.param,
      url: DiscoveryLogPoint + `/list/${moduleId}`
    }).then(function (data) {
      return data
    })
  }

  // 屏蔽新发现数据
  static async shieldDiscoveryIp (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: DiscoveryLogPoint + `/shield`
    }).then(function (data) {
      return data
    })
  }
  // 绑定新发现数据
  static async bindInstance (data, instanceId) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: DiscoveryLogPoint + `/bind/${instanceId}`
    }).then(function (data) {
      return data
    })
  }
// 绑定新发现数据
  static async exportDiscoveryLogs (moduleId, data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      binary: true,
      url: DiscoveryLogPoint + `/export/${moduleId}`
    }).then(function (data) {
      return data
    })
  }
  // 屏蔽新发现数据
  static async listInstanceByModuleId (moduleId) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: DiscoveryLogPoint + `/listInstance/${moduleId}`
    }).then(function (data) {
      return data
    })
  }
  // 屏蔽新发现数据
  static async updateDiscoveryLog (id, status) {
    return rbHttp.sendRequest({
      method: 'PUT',
      params: status,
      url: DiscoveryLogPoint + `/update/${id}`
    }).then(function (data) {
      return data
    })
  }

 /* IP分配 */
  // 查询IP分配管理配置列表
  static async getAllocateIpConfigData (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: data,
      url: AllocateIpConfig + `/list`
    }).then(function (data) {
      return data
    })
  }
  // 添加IP分配管理配置
  static async insertAllocateIpConfig (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: AllocateIpConfig + `/add`
    }).then(function (data) {
      return data
    })
  }
  // 删除IP分配管理配置
  static async deleteAllocateIpConfigById (data) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      params: {
        'ids': data
      },
      url: AllocateIpConfig + `/delete`
    }).then(function (data) {
      return data
    })
  }
  // 导出IP分配管理配置
  static async exportAllocateIpConfig (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      binary: true,
      url: AllocateIpConfig + `/export`
    }).then(function (data) {
      return data
    })
  }
  // 获取域名
  static async getVpnData () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: AllocateIpConfig + `/getVpnData`
    }).then(function (data) {
      return data
    })
  }
  // 获取网段
  static async getNetworkById (id) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: {
        'id': id
      },
      url: AllocateIpConfig + `/getNetworkById`
    }).then(function (data) {
      return data
    })
  }

  // 获取需求收集表头
  static async getDemandTableHeader () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: DemandPoint + `/list/header`
    }).then(function (data) {
      return data
    })
  }

  // 获取需求收集表头
  static async getDemandManager (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      params: data,
      url: DemandPoint + `/list/`
    }).then(function (data) {
      return data
    })
  }
  // 下载excel导入模板
  static async downloadImportTemplate (templateName, downloadFileName) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/cmdb/static/excel/${templateName}`,
      binary: true
    }).then(function (data) {
      let blob = new Blob([data], { type: 'application/msword' })
      // 创建下载链接
      let objectUrl = URL.createObjectURL(blob)
      let downLoadElement = document.createElement('a')
      downLoadElement.href = objectUrl
      downLoadElement.download = downloadFileName ? downloadFileName : templateName
      document.body.appendChild(downLoadElement)
      downLoadElement.click()
      document.body.removeChild(downLoadElement)
      URL.revokeObjectURL(objectUrl)
      return data
    })
  }

  // bpm
  // 获取变更信息
  static async getBpmToken (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      Authorization: data.token,
      url: BpmEndpoint + `/runtime/instance/v1/findInstListByDeviceId`
    }).then(function (data) {
      return data
    })
  }

  // 获取变更信息
  static async findInstListByDeviceId (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: InstanceBpmEndpoint + `/findInstListByDeviceId`
    }).then(function (data) {
      return data
    })
  }

  // 获取所有工单类型
  static async getAllFlowDefList() {
    return rbHttp.sendRequest({
      method: 'GET',
      url: InstanceBpmEndpoint + `/getAllFlowDefList`
    }).then(function (data) {
      return data
    })
  }

  // portRelation
  // 获取关联设备端口列表
  static async getInstnacePortRelationList(data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: InstancePortRelationEndpoint + `/list`
    }).then(function (data) {
      return data
    })
  }

  // 删除关联设备端口
  static async deleteInstnacePortRelation(data) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      params: data,
      url: InstancePortRelationEndpoint + `/delete`
    }).then(function (data) {
      return data
    })
  }

  // 新增关联设备端口
  static async insertInstnacePortRelation(data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: InstancePortRelationEndpoint + `/insert`
    }).then(function (data) {
      return data
    })
  }
  // 校验关联关系唯一
  static async validRelationUnique(data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: InstancePortRelationEndpoint + `/selectByPortAndId`
    }).then(function (data) {
      return data
    })
  }

  // 新增关联设备端口
  static async getInstanceIpByPool(data) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: data,
      timeout: 800000,
      url: InstancePortRelationEndpoint + `/getInstanceIpByPool`
    }).then(function (data) {
      return data
    })
  }

  // 新增网卡信息
  static async insertNetworkCard(data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: NetworkCardEndPoint + `/save`
    }).then(function (data) {
      return data
    })
  }

  // 查询网卡信息列表，依据instanceId
  static async getNetworkCardByInstanceId(data) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: data,
      url: NetworkCardEndPoint + `/getByInstanceId`
    }).then(function (data) {
      return data
    })
  }

  // 查询网卡信息，依据name,检查是否已有重复名称
  static async getNetworkCardByName(data) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: data,
      url: NetworkCardEndPoint + `/getByName`
    }).then(function (data) {
      return data
    })
  }

  // 逻辑删除网卡信息
  static async deleteNetworkCardByLogic(data) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      params: data,
      url: NetworkCardEndPoint + `/delete`
    }).then(function (data) {
      return data
    })
  }

  // 修改网卡信息
  static async updateNetworkCard(data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: NetworkCardEndPoint + `/update`
    }).then(function (data) {
      return data
    })
  }

  // approval
  // 根据筛选条件获取变更列表
  static async getApprovalList(data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: ApprovalEndPoint + `/list`
    }).then(function (data) {
      return data
    })
  }

  static async updateApporval(data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: ApprovalEndPoint + `/update`
    }).then(function (data) {
      return data
    })
  }

  static async getApprovalProcess (processId) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: ProcessEndPoint + '/approval/' + processId
    }).then(function (data) {
      return data
    })
  }

  static async stopApprovalProcess (processId) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      url: ProcessEndPoint + '/remove/approval/' + processId
    }).then(function (data) {
      return data
    })
  }

  static async downloadApprovalErrorRecord (processId) {
    return rbHttp.sendRequest({
      method: 'POST',
      binary: true,
      url: ProcessEndPoint + `/approval/export/error/${processId}`
    }).then(function (data) {
      return data
    })
  }

  // collectUnknown
  static async getCollectUnknownList (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: CollectUnknownEndPoint + `/list`
    }).then(function (data) {
      return data
    })
  }

  static async updateCollectUnknown (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: CollectUnknownEndPoint + `/update`
    }).then(function (data) {
      return data
    })
  }

  static async exportCollectUnknown (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      binary: true,
      url: CollectUnknownEndPoint + `/export`
    }).then(function (data) {
      return data
    })
  }
}
