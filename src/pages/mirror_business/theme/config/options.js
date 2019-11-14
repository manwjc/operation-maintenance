import store from 'src/store/index'

let obj = store.state.homeStore.dictObj
var arr = []
arr[0] = obj.theme_access_url.in.name
arr[1] = obj.theme_access_url.out.name
var grok = obj.theme_grok_pattern
var grok1 = []
for (let attr in grok) {
  let obj = {}
  obj.label = grok[attr].name
  obj.value = attr
  grok1.push(obj)
}

export const dimOptions = [
  {
    value: '1',
    label: '数字'
  }, {
    value: '2',
    label: '字符串'
  }, {
    value: '3',
    label: '日期'
  }
]

export const dataTypeOptions = grok1

export const upInterfaceObj = arr
