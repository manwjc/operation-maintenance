import rbHttp from 'assets/js/utility/rb-http.factory'


const MAITENPRODUCE_ENDPOINT = '/v1/cmdb/maintenProduce'


export default class maintenanceService {
// 厂商下联系人列表
  static async listProducePerson (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: data,
      url: MAITENPRODUCE_ENDPOINT + `/queryConcat`
    }).then(function (data) {
      return data
    })
  }

  // 厂商下联系人列表
  static async getProduceDetail (data) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: data,
      url: MAITENPRODUCE_ENDPOINT + `/getProduceById`
    }).then(function (data) {
      return data
    })
  }

  // 厂商下联系人列表
  static async saveProduce (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: MAITENPRODUCE_ENDPOINT + `/insertProduce`
    }).then(function (data) {
      return data
    })
  }

  // 新增联系人
  static async saveProduceConcat (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: MAITENPRODUCE_ENDPOINT + `/addConcat`
    }).then(function (data) {
      return data
    })
  }

  // 更新联系人
  static async updateProduceConcat (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: data,
      url: MAITENPRODUCE_ENDPOINT + `/updateConcat`
    }).then(function (data) {
      return data
    })
  }
  // 删除联系人
  static async deleteProduceConcat (data) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      params: data,
      url: MAITENPRODUCE_ENDPOINT + `/deleteConcat`
    }).then(function (data) {
      return data
    })
  }



}
