import rbProjectDataServiceFactory from 'src/services/resource/rb-resource-services.factory.js'
import rbProjectDataServiceFactory2 from 'src/services/template/rb-template-services.factory.js'
const nameList1 = []
const poolList1 = []
const serviceList1 = []
const system1 = []

rbProjectDataServiceFactory.getComboboxData().then((res) => {
  nameList1.splice(0, 0, ...res.names)
  // poolList1.splice(0, 0, ...res.pools)
  // serviceList1.splice(0, 0, ...res.types)
}).catch(() => {})

let obj_serviceList = {
  'type': 'device_class',
  'pid': ''
}
rbProjectDataServiceFactory2.getConfigDictByType(obj_serviceList).then((res) => {
  res.forEach(item => {
    serviceList1.push(item)
  })
})

/* rbProjectDataServiceFactory.getResourcePool().then((res) => {
  res.formOptions.forEach(item => {
    poolList1.push(item)
  })
}) */
let obj = {
  'type': 'idcType',
  'pid': ''
}
rbProjectDataServiceFactory2.getConfigDictByType(obj).then((res) => {
  res.forEach(item => {
    poolList1.push(item)
  })
})

rbProjectDataServiceFactory.getResourceEstimate().then((res) => {
  system1.splice(0, 0, ...res)
}).catch(() => {})

export const nameList = nameList1

export const poolList = poolList1

export const serviceList = serviceList1

export const systemList = system1

export const tableForm = [
  {
    prop: 'buildName',
    label: '资源建设名称'
  },
  {
    prop: 'addserverType',
    label: '服务类型'
  },
  {
    prop: 'addserverName',
    label: '服务名称'
  },
  {
    prop: 'addcount',
    label: '数量'
  },
  {
    prop: 'addunit',
    label: '单位'
  }
]

export const tableForm1 = [
  {
    prop: 'buildName',
    label: '资源建设名称'
  },
  {
    prop: 'serverType',
    label: '服务类型'
  },
  {
    prop: 'serverName',
    label: '服务名称'
  },
  {
    prop: 'count',
    label: '数量'
  },
  {
    prop: 'addUnit',
    label: '单位'
  }
]

export const tableHeadFile = [
  {
    prop: 'device_ip',
    label: '主IP地址',
    width: '110',
    sortable: true
  },
  {
    prop: 'business_level1',
    label: '一级业务',
    width: '110',
    sortable: true
  },
  {
    prop: 'business_level2',
    label: '二级业务',
    width: '110',
    sortable: true
  },
  {
    prop: 'idc',
    label: 'IDC',
    width: '110',
    sortable: true
  },
  {
    prop: 'idc_label',
    label: '所属位置',
    width: '110',
    sortable: true
  },
  {
    prop: 'idc_location',
    label: '机房位置',
    width: '110',
    sortable: true
  },
  {
    prop: 'device_class',
    label: '设备分类',
    width: '110',
    sortable: true
  },
  {
    prop: 'device_type',
    label: '设备类型',
    width: '110',
    sortable: true
  },
  {
    prop: 'device_model',
    label: '设备型号',
    width: '110',
    sortable: true
  },
  {
    prop: 'device_os_type',
    label: '设备系统类型',
    width: '160',
    sortable: true
  },
  {
    prop: 'device_status',
    label: '设备状态',
    width: '110',
    sortable: true
  },
  {
    prop: 'block_size',
    label: '块存储(GB)',
    width: '160',
    sortable: true
  },
  {
    prop: 'dis_storage',
    label: '分布式存储(GB)',
    width: '160',
    sortable: true
  },
  {
    prop: 'managed_by_ansiblertable',
    label: '是否ansible管理',
    width: '210',
    sortable: true
  },
  {
    prop: 'mgd_by_pool',
    label: '是否是资源池管理设备',
    width: '210',
    sortable: true
  },
  {
    prop: 'device_maintenance',
    label: '维保型号',
    width: '110',
    sortable: true
  },
  {
    prop: 'device_maintenance_vender',
    label: '维保厂家',
    width: '110',
    sortable: true
  },
  {
    prop: 'other_ip',
    label: '其它IP地址',
    width: '160',
    sortable: true
  },
  {
    prop: 'device_log_name',
    label: '逻辑名',
    width: '110',
    sortable: true
  },
  {
    prop: 'host_backup',
    label: '主备关系',
    width: '110',
    sortable: true
  },
  {
    prop: 'device_cell',
    label: '机柜号',
    width: '110',
    sortable: true
  },
  {
    prop: 'box_num',
    label: '刀箱号',
    width: '110',
    sortable: true
  },
  {
    prop: 'slot_num',
    label: '槽位号',
    width: '110',
    sortable: true
  },
  {
    prop: 'box_mgd_ip',
    label: '刀箱管理IP',
    width: '160',
    sortable: true
  },
  {
    prop: 'exsi_ip',
    label: '所在宿主机IP',
    width: '160',
    sortable: true
  },
  {
    prop: 'vm_name',
    label: '承载虚拟机名称',
    width: '210',
    sortable: true
  },
  {
    prop: 'vm_ip',
    label: '承载虚拟机IP',
    width: '160',
    sortable: true
  },
  {
    prop: 'device_standard',
    label: '设备规格',
    width: '110',
    sortable: true
  },
  {
    prop: 'device_sn',
    label: '序列号',
    width: '110',
    sortable: true
  },
  {
    prop: 'b_card_sn',
    label: '板卡序列号',
    width: '160',
    sortable: true
  },
  {
    prop: 'asset_number',
    label: '资产标签号',
    width: '160',
    sortable: true
  },
  {
    prop: 'dis_st_dir',
    label: '分布式存储挂载目录',
    width: '310',
    sortable: true
  },
  {
    prop: 'maintenance_time',
    label: '维保时间',
    width: '110',
    sortable: true
  },
  {
    prop: 'online_time',
    label: '上线时间',
    width: '110',
    sortable: true
  },
  {
    prop: 'dis_st_type',
    label: '分布式存储类型',
    width: '160',
    sortable: true
  },
  {
    prop: 'resource_plan',
    label: '资源计划性',
    width: '160',
    sortable: true
  },
  {
    prop: 'blong_to',
    label: '项目归属',
    width: '110',
    sortable: true
  },
  {
    prop: 'console_ip',
    label: 'console IP',
    width: '160',
    sortable: true
  },
  {
    prop: 'console_vlan',
    label: 'console vlan',
    width: '160',
    sortable: true
  },
  {
    prop: 'console_mask',
    label: 'console 掩码',
    width: '160',
    sortable: true
  },
  {
    prop: 'console_gw',
    label: 'console 网关',
    width: '160',
    sortable: true
  },
  {
    prop: 'console_user',
    label: 'console 账号',
    width: '160',
    sortable: true
  },
  {
    prop: 'console_password',
    label: 'console 密码',
    width: '160',
    sortable: true
  },
  {
    prop: 'business_vlan',
    label: '业务 vlan',
    width: '110',
    sortable: true
  },
  {
    prop: 'local_disk',
    label: '本地磁盘大小',
    width: '160',
    sortable: true
  },
  {
    prop: 'mount_disk',
    label: '初始外挂磁盘',
    width: '210',
    sortable: true
  },
  {
    prop: 'network_area',
    label: '网络区域',
    width: '110',
    sortable: true
  },
  {
    prop: 'remark',
    label: '备注',
    width: '110',
    sortable: true
  },
  {
    prop: 'trans_cost',
    label: '转资成本',
    width: '110',
    sortable: true
  },
  {
    prop: 'unit_price',
    label: '单价',
    width: '110',
    sortable: true
  },
  {
    prop: 'prorate_date',
    label: '按比例分摊日期',
    width: '210',
    sortable: true
  },
  {
    prop: 'service_life',
    label: '使用年限',
    width: '110',
    sortable: true
  },
  {
    prop: 'is_assign',
    label: '是否分配',
    width: '110',
    sortable: true
  }
]
