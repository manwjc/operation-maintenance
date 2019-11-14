// export function isRequire (rule, value, callback) {
//   if (!value) {
//     return callback(new Error('字段信息不能为空'))
//   }
//   return callback()
// }
// export function isPhone (rule, value, callback) {
//   const pattern = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/
//   if (value && value !== '' && !pattern.test(value)) {
//     return callback(new Error('输入的手机号错误'))
//   }
//   return callback()
// }
// export function isNumber (rule, value, callback) {
//   if (value && value !== '' && !Number(value)) {
//     return callback(new Error('请输入数字'))
//   }
//   return callback()
// }
// export function isEmail (rule, value, callback) {
//   const reg = /^([a-zA-Z0-9]+[-_.]?)+@[a-zA-Z0-9]+\.[a-z]+$/
//   if (value && !reg.test(value)) {
//     return callback(new Error('请输入正确的邮箱地址'))
//   }
//   return callback()
// }
// export function isIp (rule, value, callback) {
//   const reg = /^((\d)|([1-9]\d)|(1\d{2})|((2[0-4]\d)|(25[0-5])))(\.((\d)|([1-9]\d)|(1\d{2})|((2[0-4]\d)|(25[0-5])))){3}$/
//   if (value && !reg.test(value)) {
//     return callback(new Error('请输入正确的IP地址'))
//   }
//   return callback()
// }
let isRequire = (rule, value, callback) => {
  if (!value) {
    callback(new Error('字段信息不能为空'))
  }
  callback()
}
let isPhone = (rule, value, callback) => {
  const pattern = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/
  if (value && value !== '' && !pattern.test(value)) {
    callback(new Error('输入的手机号错误'))
  }
  callback()
}
let isNumber = (rule, value, callback) => {
  if (value && value !== '' && !Number(value)) {
    callback(new Error('请输入数字'))
  }
  callback()
}
let isEmail = (rule, value, callback) => {
  const reg = /^([a-zA-Z0-9]+[-_.]?)+@[a-zA-Z0-9]+\.[a-z]+$/
  if (value && !reg.test(value)) {
    callback(new Error('请输入正确的邮箱地址'))
  }
  callback()
}
let isIp = (rule, value, callback) => {
  const reg = /^((\d)|([1-9]\d)|(1\d{2})|((2[0-4]\d)|(25[0-5])))(\.((\d)|([1-9]\d)|(1\d{2})|((2[0-4]\d)|(25[0-5])))){3}$/
  if (value && !reg.test(value)) {
    callback(new Error('请输入正确的IP地址'))
  }
  callback()
}

export default {isRequire, isPhone, isNumber, isEmail, isIp}
