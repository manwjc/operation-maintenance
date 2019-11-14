export const MIRROR_TYPE_MAP = {
  '1': '硬件',
  '2': '网络',
  '3': '主机操作系统',
  '4': '应用'
}

export const MIRROR_FUN_TYPE = {
  '1': '监控指标项',
  '2': '巡检指标项'
}

export const TASK_TYPE_MAP = {
  '0': '全部',
  '1': '手动',
  '2': '自动'
}

export const TASK_TYPE_MAP1 = {
  '1': '手动',
  '2': '自动'
}

export const CYCLE_TYPE_MAP = {
  'MIN': '分钟',
  'HOUR': '小时',
  'MON': '月',
  'WEEK': '周',
  'DAY': '日',
  'DEFINE': '自定义'
}

export const TASK_STATUS = {
  'RUNNING': '运行中',
  'FINNISHED': '已完成'
}

export const ZHOU = {
  '1': '周日',
  '2': '周一',
  '3': '周二',
  '4': '周三',
  '5': '周四',
  '6': '周五',
  '7': '周六'
}

export const EXPRESSION = {
  '=': 0,
  '>': 0,
  '<': 0,
  '!=': 1,
  'In': 1
}

export const ZBXTYPE = {
  '0': '浮点数',
  '1': '字符串',
  '2': '日志',
  '3': '整数',
  '4': '文本'
}

// 告警
export const ALERTLEVEL = {
  'name': 'ALERTLEVEL',
  // '1': '提示',
  '2': '低',
  '3': '中',
  '4': '高',
  '5': '重大'
}

export const ORDERSTATUS = {
  'name': 'ORDERSTATUS',
  '1': '未派单',
  '2': '处理中',
  '3': '已完成'
}

export const OBJECTTYPE = {
  'name': 'OBJECTTYPE',
  '1': '设备',
  '2': '业务系统'
}

export const MONTYPE = {
  'name': 'MONTYPE',
  '1': '系统',
  '2': '业务'
}

export const SYSTYPE = {
  'name': 'SYSTYPE',
  'ZABBIX': 'ZABBIX',
  '普罗米修斯': 'PROMETHEUS',
  '主题': 'THEME',
  'MIRROR': 'MIRROR'
}

// 资源管理
export const RESOURCESTATUS = {
  'name': 'RESOURCESTATUS',
  '-1': '全部',
  '0': '已关闭',
  '1': '已预估',
  '2': '建设中'
}
// 通知方式
export const REPORTTYPE = {
  'name': 'REPORTTYPE',
  '0': '短信',
  '1': '邮件',
  '2': '全部'
}

// 通知发送状态
export const REPORTSTATUS = {
  'name': 'REPORTSTATUS',
  '0': '失败',
  '1': '成功'
}

// 转派状态
export const TRANSSTATUS = {
  'name': 'TRANSSTATUS',
  '0': '失败',
  '1': '成功'
}

// 操作类型 0-转派, 1-确认,2-派发工单, 3-清除, 4-通知, 5-过滤, 6-工程, 7-维护模式'
export const OPERATION_TYPE = {
  'name': 'OPERATION_TYPE',
  '0': '转派',
  '1': '确认',
  '2': '派发工单',
  '3': '清除',
  '4': '通知',
  '5': '过滤',
  '6': '工程',
  '7': '维护模式'
}

// 工单类型
export const ORDERTYPE = {
  'name': 'ORDERTYPE',
  '1': '告警工单',
  '2': '故障工单',
  '3': '维保工单'
}

export const ISOLATE_STATUS = {
  'name': 'ISOLATE_STATUS',
  '1': '启用',
  '0': '停用'
}
