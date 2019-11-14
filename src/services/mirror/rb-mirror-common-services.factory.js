import {
  MIRROR_TYPE_MAP,
  MIRROR_FUN_TYPE,
  TASK_TYPE_MAP,
  TASK_TYPE_MAP1,
  CYCLE_TYPE_MAP,
  TASK_STATUS,
  ZHOU,
  EXPRESSION,
  ZBXTYPE,
  ALERTLEVEL,
  ORDERSTATUS,
  OBJECTTYPE,
  MONTYPE,
  SYSTYPE,
  RESOURCESTATUS,
  REPORTTYPE,
  REPORTSTATUS,
  TRANSSTATUS,
  ORDERTYPE,
  OPERATION_TYPE
} from 'src/assets/js/constant/rb-mirror-mirror.constant.js'

export default class rbMirrorCommonService {
  // type为1则是取值2是取属性名
  static common (str, type, status) {
    if (status) {
      let obj = {}
      switch (str) {
        case ALERTLEVEL.name:
          obj = ALERTLEVEL
          break
        case ORDERSTATUS.name:
          obj = ORDERSTATUS
          break
        case OBJECTTYPE.name:
          obj = OBJECTTYPE
          break
        case MONTYPE.name:
          obj = MONTYPE
          break
        case SYSTYPE.name:
          obj = SYSTYPE
          break
        case RESOURCESTATUS.name:
          obj = RESOURCESTATUS
          break
        case REPORTTYPE.name:
          obj = REPORTTYPE
          break
        case REPORTSTATUS.name:
          obj = REPORTSTATUS
          break
        case TRANSSTATUS.name:
          obj = TRANSSTATUS
          break
        case ORDERTYPE.name:
          obj = ORDERTYPE
          break
        case OPERATION_TYPE.name:
          obj = OPERATION_TYPE
          break
        default:
          obj = {}
          break
      }
      if (type === '1') {
        if (obj[status] !== null) {
          return obj[status]
        } else {
          return status
        }
      } else {
        for (let i in obj) {
          if (obj[i] === status) {
            return i
          }
        }
      }
    }
  }

  static getType (status) {
    return MIRROR_TYPE_MAP[status]
  }

  static getDaoType (value) {
    for (let i in MIRROR_TYPE_MAP) {
      if (MIRROR_TYPE_MAP[i] === value) {
        return i
      }
    }
  }

  static getFunType (status) {
    return MIRROR_FUN_TYPE[status]
  }

  static getDaoFunType (value) {
    for (let i in MIRROR_FUN_TYPE) {
      if (MIRROR_FUN_TYPE[i] === value) {
        return i
      }
    }
  }

  static sliceSym (str) {
    if (str) {
      if (str.indexOf('In') >= 0) {
        return EXPRESSION['In']
      } else if (str.indexOf('!') >= 0) {
        return EXPRESSION['!=']
      } else {
        if (str.indexOf('>') >= 0) {
          return EXPRESSION['>']
        } else if (str.indexOf('<') >= 0) {
          return EXPRESSION['<']
        } else if (str.indexOf('=') >= 0) {
          return EXPRESSION['=']
        }
      }
    }
  }

  static getTaskType (status) {
    return TASK_TYPE_MAP[status]
  }

  static getDaoTaskType (value) {
    for (let i in TASK_TYPE_MAP) {
      if (TASK_TYPE_MAP[i] === value) {
        return i
      }
    }
  }

  static getTaskType1 (status) {
    return TASK_TYPE_MAP1[status]
  }

  static getDaoTaskType1 (value) {
    for (let i in TASK_TYPE_MAP1) {
      if (TASK_TYPE_MAP1[i] === value) {
        return i
      }
    }
  }

  static getCycleType (status) {
    return CYCLE_TYPE_MAP[status]
  }

  static getDaoCycleType (value) {
    for (let i in CYCLE_TYPE_MAP) {
      if (CYCLE_TYPE_MAP[i] === value) {
        return i
      }
    }
  }

  static getTaskStatus (status) {
    return TASK_STATUS[status]
  }

  static getDaoTaskStatus (value) {
    for (let i in TASK_STATUS) {
      if (TASK_STATUS[i] === value) {
        return i
      }
    }
  }

  static getZhou (status) {
    return ZHOU[status]
  }

  static getDaoZhou (value) {
    for (let i in ZHOU) {
      if (ZHOU[i] === value) {
        return i
      }
    }
  }

  static getListExecTime (type, str) {
    if (type === 'MIN') {
      return `每分钟第${str}秒执行`
    } else if (type === 'HOUR') {
      return `每小时第${str}分钟执行`
    } else if (type === 'MON') {
      let index = str.indexOf('+')
      let ri = str.slice(0, index)
      let time = str.slice(index + 1)
      return `每月${ri}号${time}执行`
    } else if (type === 'WEEK') {
      let index = str.indexOf('+')
      let ri = ZHOU[str.slice(0, index)]
      let time = str.slice(index + 1)
      return `每${ri}${time}执行`
    } else if (type === 'DAY') {
      return `每天${str}执行`
    } else if (type === 'DEFINE') {
      return str
    }
  }

  static getZbxType (status) {
    return ZBXTYPE[status]
  }

  static getDaoZbxType (value) {
    for (let i in ZBXTYPE) {
      if (ZBXTYPE[i] === value) {
        return i
      }
    }
  }
}
