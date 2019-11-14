export default {
  // 通用查询条件
  data() {
    return {
      // 分页
      currentPage: 1, // 当前页
      pageSize: 50, // 分页每页多少行数据
      isolate_status: [{
        label: '启用',
        value: '1'
      }, {
      label: '停用',
        value: '0'
    }]
    }
  }
}


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
  label: '业务',
  value: '2'
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

export const detail_gen = [{
  label: '上报时间',
  prop: 'cur_moni_time'
}, {
  label: '监控值',
  prop: 'cur_moni_value'
}, {
  label: '告警内容',
  prop: 'moni_index'
}]

export const detail_record = [{
  label: '操作类型',
  prop: 'operation_type'
}, {
  label: '操作人',
  prop: 'user_name'
}, {
  label: '操作时间',
  prop: 'operation_time'
}, {
  label: '操作状态',
  prop: 'operation_status'
}, {
  label: '操作内容',
  prop: 'content'
}]

export const detail_notify = [{
  label: '通知方式',
  prop: 'report_type'
}, {
  label: '通知对象',
  prop: 'name'
}, {
  label: '通知发送时间',
  prop: 'create_time'
}, {
  label: '通知状态',
  prop: 'status'
}]

export const detail_his= [{
  label: '告警编号',
  prop: 'alert_id'
}, {
  label: '告警开始时间',
  prop: 'alert_start_time'
}, {
  label: '当前告警时间',
  prop: 'cur_moni_time'
}, {
  label: '告警处理类型',
  prop: 'alert_operation_type'
}, {
  label: '告警处理时间',
  prop: 'alert_operation_time'
}]

export const period_option = ['0','1','2','3','4','5','6','7','8','9','10','11','12',
'13','14','15','16','17','18','19','20','21','22','23']

export const alert_voice_content= [{
  label: '告警当前时间',
  prop: 'curMoniTime'
}, {
  label: '设备IP',
  prop: 'deviceIp'
}, {
  label: '资源池',
  prop: 'idcType'
}, {
  label: '业务系统',
  prop: 'bizSys'
}, {
  label: '设备分类',
  prop: 'deviceClass'
}, {
  label: '设备类型',
  prop: 'deviceType'
}, {
  label: '告警等级',
  prop: 'alertLevel'
}, {
  label: '告警描述',
  prop: 'moniIndex'
}, {
  label: '告警值',
  prop: 'curMoniValue'
}, {
  label: '设备名称',
  prop: 'hostName'
}, {
  label: '设备描述',
  prop: 'deviceDescription'
}]

export const isolate_status = [
  {
    label: '启用',
    value: '1'
  }, {
    label: '停用',
    value: '0'
  }
]

export const bUnitTrans = {
    'BPS':[
      {
        name: 'KB',
        val: '1024_2',
        oper:'2'//相除
      },
      {
        name: 'MB',
        val: '1048576_2',
        oper:'2'
      },
      {
        name: 'GB',
        val: '1073741824_2',
        oper:'2'
      }
    ],
  'B':[
      {
        name: 'KB',
        val: '1024_2',
        oper:'2'
      },
      {
        name: 'MB',
        val: '1048576_2',
        oper:'2'
      },
      {
        name: 'GB',
        val: '1073741824_2',
        oper:'2'
      }
    ],
  'KB':[
      {
        name: 'B',
        val: '1024_1',
        oper:'1'//相乘
      },
      {
        name: 'MB',
        val: '1024_2',
        oper:'2'
      },
      {
        name: 'GB',
        val: '1048576_2',
        oper:'2'
      }
    ],
  'MB':[
      {
        name: 'B',
        val: '1048576_1',
        oper:'1'
      },
      {
        name: 'KB',
        val: '1024_1',
        oper:'1'
      },
      {
        name: 'GB',
        val: '1024_2',
        oper:'2'
      }
    ],
  'GB':[
      {
        name: 'B',
        val: '1073741824_1',
        oper:'1'
      },
      {
        name: 'KB',
        val: '1048576_1',
        oper:'1'
      },
      {
        name: 'MB',
        val: '1024_1',
        oper:'1'
      }
    ]
  }

export const hzUnitTrans = {
    'HZ':[
      {
        name: 'KHZ',
        val: '1000_2',
        oper:'2'
      },
      {
        name: 'MHZ',
        val: '1000000_2',
        oper:'2'
      },
      {
        name: 'GHZ',
        val: '1000000000_2',
        oper:'2'
      }
    ],
  'KHZ':[
      {
        name: 'HZ',
        val: '1000_1',
        oper:'1'
      },
      {
        name: 'MHZ',
        val: '1000_2',
        oper:'2'
      },
      {
        name: 'GHZ',
        val: '1000000_2',
        oper:'2'
      }
    ],
  'MHZ':[
      {
        name: 'HZ',
        val: '1000000_1',
        oper:'1'
      },
      {
        name: 'KHZ',
        val: '1000_1',
        oper:'1'
      },
      {
        name: 'GHZ',
        val: '1000_2',
        oper:'2'
      }
    ],
  'GHZ':[
      {
        name: 'HZ',
        val: '1000000000_1',
        oper:'1'
      },
      {
        name: 'KHZ',
        val: '1000000_1',
        oper:'1'
      },
      {
        name: 'MHZ',
        val: '1000_1',
        oper:'1'
      }
    ]
  }
