// import dataService from 'src/services/spider/spider_deploy/rb-spider-deploy-services.factory.js'
import store from 'src/store/index'
export const DIC_KEY = {
  // 部门类型
  DEPARTMENT: 'dept_type',
  // 人员类型
  PERSON: 'user_type',
  // 人员性别
  SEX: 'sex'
}
export const dictionaryService = class dictionaryService {
  static getDictionary (key) {
    let obj = store.state.homeStore.dictObj
    let param = key.split(',')
    let result = {}
    for (var item of param) {
      let itemArr = []
      for (var prop in obj[item]) {
        itemArr.push({'dictCode': prop, 'dictNote': obj[item][prop].name})
      }
      result[item] = itemArr
    }
    return result
  }
}
