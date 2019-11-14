export function isEmptyOrPhone (rule, value, callback) {
  const pattern = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/
  if (value && value !== '' && !pattern.test(value)) {
    return callback(new Error('输入的手机号错误'))
  }
  return callback()
}
export function isEmptyOrInteger (rule, value, callback) {
  const pattern = /^[1-9]\d*|0$/
  if (value && (!pattern.test(value) || value.indexOf('.') > 0)) {
    return callback(new Error('请输入整数'))
  }
  return callback()
}
export function isEmptyOrFloat (rule, value, callback) {
  if (value && value !== '' && !Number(value)) {
    return callback(new Error('请输入数字'))
  }
  return callback()
}
export function isEmptyOrEmail (rule, value, callback) {
  const reg = /^([a-zA-Z0-9]+[-_.]?)+@[a-zA-Z0-9]+\.[a-z]+$/
  if (value && !reg.test(value)) {
    return callback(new Error('请输入正确的邮箱地址'))
  }
  return callback()
}
