import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'

let bizSysList1 = []
const equipType1 = []
const room1 = []

/* rbProjectDataServiceFactory.getRoomList().then((res) => {
  if (res) {
    room1.splice(0, 0, ...res)
  }
}) */
rbProjectDataServiceFactory.getConfigDictByType({'type': 'roomId', 'pid': ''}).then((res) => {
  if (res) {
    room1.splice(0, 0, ...res)
  }
})

rbProjectDataServiceFactory.getModuleTree().then((res) => {
  res.forEach((obj) => {
    let arr = []
    obj.item.forEach((item) => {
      let obj2 = {
        value: item.id,
        label: item.name
      }
      arr.push(obj2)
    })
    let obj1 = {
      value: obj.id,
      label: obj.name,
      children: arr
    }
    equipType1.push(obj1)
  })
})

rbProjectDataServiceFactory.getBizSysList().then((res) => {
  if (res) {
    bizSysList1.splice(0, 0, ...res)
  }
})

export const typeOptions = ['硬件', '网络', '主机操作系统', '应用']

export const bizSysList = bizSysList1

export const equipType = equipType1

export const room = room1

export const funTypeOptions = [{
  label: '监控指标项',
  value: '1'
}, {
  label: '巡检指标项',
  value: '2'
}]

export const monTypeOptions = [{
  label: '系统',
  value: '1'
}, {
  label: '业务',
  value: '2'
}]

export const dimOptions = {
  fieldComparor: [{
    value: '0',
    label: '>'
  }, {
    value: '1',
    label: '<'
  }, {
    value: '2',
    label: '='
  }, {
    value: '3',
    label: '包含'
  }],
  DimDateOption: [{
    value: '0',
    label: '>'
  }, {
    value: '1',
    label: '<'
  }, {
    value: '2',
    label: '='
  }],
  dateTypeOpiton: [{
    value: '0',
    label: '指标计算当前时间'
  }, {
    value: '1',
    label: '指标计算当日开始'
  }, {
    value: '2',
    label: '指标计算当日结束'
  }],
  numTypeOption: [{
    value: '0',
    label: '+'
  }, {
    value: '1',
    label: '-'
  }],
  timeOptions: [{
    label: '分',
    value: '2'
  }, {
    label: '小时',
    value: '1'
  }, {
    label: '天',
    value: '0'
  }],
  timeOptions1: [{
    label: '分',
    value: '1'
  }, {
    label: '小时',
    value: '2'
  }, {
    label: '天',
    value: '3'
  }]
}

export const triggerOptions = {
  trigger_level: [
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
  ],
  expressionList: [
    {
      value: '=',
      label: '='
    }, {
      value: '<',
      label: '<'
    }, {
      value: '>',
      label: '>'
    }, {
      value: '!=',
      label: '!='
    }, {
      value: 'In',
      label: 'In'
    }
  ]
}

export const sysTypeOptions = [{
  label: 'ZABBIX',
  value: 'ZABBIX'
}, {
  label: '普罗米修斯',
  value: 'PROMETHEUS'
}, {
  label: '主题',
  value: 'THEME'
}, {
  label: 'MIRROR',
  value: 'MIRROR'
}, {
  label: '主题计算',
  value: 'THEME_CALC'
}]
