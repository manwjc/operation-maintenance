export const alert_email_col = [{
  name: '当前监控值',
  code: 'cur_moni_value'
}, {
  name: '资源池',
  code: 'idc_type'
}, {
  name: '业务系统',
  code: 'biz_sys'
}, {
  name: '设备类型',
  code: 'device_class'
}, {
  name: '机房',
  code: 'source_room'
}, {
  name: '告警类型',
  code: 'object_type'
}]

export const alert_level = [
  // {
  //   label: '提示',
  //   value: '1'
  // },
  {
    label: '低',
    value: '2'
  }, {
    label: '中',
    value: '3'
  }, {
    label: '高',
    value: '4'
  }, {
    label: '重大',
    value: '5'
  }
]

export const alert_level_obj = {
  // '1': '提示',
  '2': '低',
  '3': '中',
  '4': '高',
  '5': '重大'
}

export const order_status = [
  {
    label: '未派单',
    value: '1'
  }, {
    label: '处理中',
    value: '2'
  }, {
    label: '已完成',
    value: '3'
  }
]

export const alert_type = [{
  label: '设备',
  value: '1'
}, {
  label: '业务系统',
  value: '2'
}]

export const relation = [{
  label: '包含',
  value: 'include'
}, {
  label: '不包含',
  value: 'exclude'
}]

export const alert_notice_types = [{
  label: '全部',
  value: '2'
}, {
  label: '邮件',
  value: '1'
}, {
  label: '短信',
  value: '0'
}]

export const alert_from = [{
  label: 'ZABBIX',
  value: 'ZABBIX'
}, {
  label: 'prometheus',
  value: 'prometheus'
}, {
  label: '内部告警',
  value: '内部告警'
}, {
  label: 'inside',
  value: 'inside'
}, {
  label: 'HTTP_MONITOR',
  value: 'HTTP_MONITOR'
}, {
  label: 'sysLog',
  value: 'sysLog'
}]

export const operateType = {
  '大于': '>',
  '小于': '<',
  '等于': '=',
  '不等于': '!=',
  '大于等于': '>=',
  '小于等于': '<=',
  '包含': 'in',
  '不包含': 'not in',
  '模糊匹配': 'like'
}
