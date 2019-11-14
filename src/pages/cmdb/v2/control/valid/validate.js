import cmdbCodeService from 'src/services/cmdb/rb-cmdb-code-services.factory'
export function uniqueControlCodeOrName (rule, value, callback, oldValue, flag) {
  let needCheck = true
  if (flag === 'update') {
    if (value === oldValue) {
      needCheck = false
    }
  }
  if (needCheck) {
    cmdbCodeService.validCodeControlByCodeOrName(rule.field, value).then((data) => {
      if (data.flag === 'true') {
        if (rule.field === 'controlCode') {
          return callback(new Error('控件编码[' + value + '] 已经存在'))
        }
        if (rule.field === 'controlName') {
          return callback(new Error('控件名称[' + value + '] 已经存在'))
        }
      }
      return callback()
    })
  } else {
    return callback()
  }
}
export function isEmptyOrInteger (rule, value, callback) {
  const pattern = /^[1-9]\d*|0$/
  if (value && (!pattern.test(value) || (value + '').indexOf('.') > 0)) {
    return callback(new Error('请输入整数'))
  }
  return callback()
}
