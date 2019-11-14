import rbHttp from 'assets/js/utility/rb-http.factory'
const cmdbCodePoint = '/v1/cmdb/code'
const cmdbSchemaPoint = '/v1/cmdb/schema/'

export default class cmdbCodeService {
  // 验证控件编码或名称唯一
  static async validCodeControlByCodeOrName (filed, value) {
    let _v = await rbHttp.sendRequest({
      method: 'Get',
      url: cmdbCodePoint + '/control/valid' + '?filed=' + filed + '&value=' + value
    }).then(function (data) {
      return data
    })
    return _v
  }
  // 验证码表编码或名称唯一
  static async validCodeByCodeOrName (filed, value) {
    let _v = await rbHttp.sendRequest({
      method: 'Get',
      url: cmdbCodePoint + '/valid' + '?filed=' + filed + '&value=' + value
    }).then(function (data) {
      return data
    })
    return _v
  }
  // 查询码表分组列表
  static async queryCodeGroupList () {
    return rbHttp.sendRequest({
      method: 'Get',
      url: cmdbCodePoint + '/group/list'
    }).then(function (data) {
      return data
    })
  }

  // 保存码表信息
  static async saveCode (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      timeout: 600000,
      url: cmdbCodePoint + '/saveCode'
    }).then(function (data) {
      return data
    })
  }
  // 查询控件类型列表
  static async queryCodeList (queryObject) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: queryObject,
      url: cmdbCodePoint + '/list'
    }).then(function (data) {
      return data
    })
  }
  // 查询码表详细信息列表
  static async getCodeByCodeId (codeId) {
    return rbHttp.sendRequest({
      method: 'Get',
      url: cmdbCodePoint + '/get?codeId=' + codeId
    }).then(function (data) {
      return data
    })
  }
  // 查询码表详细信息列表
  static async deleteCode (codes) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      data: codes,
      url: cmdbCodePoint + '/deleteCode'
    }).then(function (data) {
      return data
    })
  }
  // 查询所有码表信息, 并按分组显示
  static async queryCodeListFormatByGroup () {
    return rbHttp.sendRequest({
      method: 'Get',
      url: cmdbCodePoint + '/list/formatGroup'
    }).then(function (data) {
      return data
    })
  }
  // 查询控件类型列表
  static async queryCodeControl (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: cmdbCodePoint + '/control/list'
    }).then(function (data) {
      return data
    })
  }
  // 获取控件信息
  static async getControlById (controlId) {
    return rbHttp.sendRequest({
      method: 'Get',
      url: cmdbCodePoint + '/control/get?controlId=' + controlId
    }).then(function (data) {
      return data
    })
  }

  // 保存控件类型
  static async saveCodeControl (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: cmdbCodePoint + '/control/saveControl'
    }).then(function (data) {
      return data
    })
  }
  // 删除控件类型
  static async deleteControl (data) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      data: data,
      url: cmdbCodePoint + '/control/deleteControl'
    }).then(function (data) {
      return data
    })
  }
  // 查询数据表列表
  static async getTableList () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: cmdbSchemaPoint + '/getTables'
    }).then(function (data) {
      return data
    })
  }
  // 查询数据表的列
  static async getColumnsByTableName (table_name) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: cmdbSchemaPoint + '/getColumns/' + table_name
    }).then(function (data) {
      return data
    })
  }
  static async checkSql (check_sql) {
    let _v = await rbHttp.sendRequest({
      method: 'POST',
      data: {sql: check_sql},
      url: cmdbSchemaPoint + '/checkSql'
    }).then(function (data) {
      _v = data
    }).catch((data) => {
      _v = {'flag': 'error', 'msg': '验证SQL失败'}
    })
    return _v
  }
}
