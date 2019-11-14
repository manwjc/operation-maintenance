export const JOB_STATUS = {
  'BLOCKED': '被阻塞',
  'WAITING': '等待中',
  'ONGOING': '进行中',
  'STOPPED': '停止',
  'SUCCEEDED': '成功',
  'FAILED': '失败'
}

// UI -> API
export const DEVICE_TYPE_MAP = {
  '1': '设备',
  '2': '业务系统'
}

export const ALERT_LEVEL_CSS_MAP = {
  '5': 'serious',
  '4': 'high',
  '3': 'medium',
  '2': 'low',
  '1': 'tip',
  '0': 'normal'
}
export const ALERT_LEVEL_MAP = {
  '5': '重大',
  '4': '高',
  '3': '中',
  '2': '低'
  // '1': '提示'
}

export const JOB_STATUS_ICON_STATUS_MAP = {
  'BLOCKED': 'waiting',
  'WAITING': 'in-progress',
  'ONGOING': 'in-progress',
  'STOPPED': 'error',
  'FAILED': 'error',
  'SUCCEEDED': 'completed'
}
