// import rbProjectDataServiceFactory from 'src/services/resource/rb-resource-services.factory.js'
import rbProjectDataServiceFactory2 from 'src/services/template/rb-template-services.factory.js'
export const tableHead = [
  {
    prop: 'resource_pool',
    label: '资源池',
    width: '160',
    sortable: true
  },
  {
    prop: 'vm_model1',
    label: '16核、128G、200G系统',
    width: '210',
    sortable: true
  },
  {
    prop: 'vm_model2',
    label: '8核、64G、200G系统',
    width: '210',
    sortable: true
  },
  {
    prop: 'vm_model3',
    label: '8核、32G、200G系统',
    width: '210',
    sortable: true
  },
  {
    prop: 'vm_model4',
    label: '8核、16G、200G系统',
    width: '210',
    sortable: true
  },
  {
    prop: 'vm_model5',
    label: '4核、32G、200G系统',
    width: '210',
    sortable: true
  },
  {
    prop: 'vm_model6',
    label: '4核、16G、200G系统',
    width: '210',
    sortable: true
  },
  {
    prop: 'vm_model7',
    label: '4核、8G、200G系统',
    width: '210',
    sortable: true
  },
  {
    prop: 'vm_model8',
    label: '2核、4G、200G系统',
    width: '210',
    sortable: true
  },
  {
    prop: 'pm_low_app_server',
    label: '虚拟机宿主机低端应用服务',
    width: '220',
    sortable: true
  },
  {
    prop: 'pm_analytical_server',
    label: '分析型服务器(MPP服务器)(台)',
    width: '240',
    sortable: true
  },
  {
    prop: 'pm_distributed_server',
    label: '分布式服务器(Hadoo)',
    width: '210',
    sortable: true
  },
  {
    prop: 'pm_cache_server',
    label: '缓存型服务器(台)',
    width: '210',
    sortable: true
  },
  {
    prop: 'pm_high_app_server',
    label: '高端应用服务器(台)',
    width: '210',
    sortable: true
  },
  {
    prop: 'storage_distributd_file_capacity',
    label: '分布式文件存储(TB)',
    width: '210',
    sortable: true
  },
  {
    prop: 'storage_distributd_block_performance',
    label: '分布式块存储(TB)',
    width: '210',
    sortable: true
  },
  {
    prop: 'storage_object_capacity',
    label: '对象存储(TB)',
    width: '210',
    sortable: true
  },
  {
    prop: 'storage_fc_san_capacity',
    label: 'FC-SAN存储(TB)',
    width: '210',
    sortable: true
  },
  {
    prop: 'storage_ip_san_capacity',
    label: 'IP-SAN存储(TB)',
    width: '210',
    sortable: true
  },
  {
    prop: 'storage_fc_san_naked',
    label: 'FC-SAN裸盘(TB)',
    width: '210',
    sortable: true
  },
  {
    prop: 'storage_ip_san_naked',
    label: 'IP-SAN裸盘(TB)',
    width: '210',
    sortable: true
  },
  {
    prop: 'storage_back_up',
    label: '备份存储(TB)',
    width: '210',
    sortable: true
  },
  {
    prop: 'cmnet_address',
    label: 'CMNET地址需求(个)',
    width: '210',
    sortable: true
  },
  {
    prop: 'bandwidth_gbps_cmnet',
    label: '至CMNET带宽(Gbps)',
    width: '210',
    sortable: true
  },
  {
    prop: 'ip_address',
    label: 'IP地址需求(个)',
    width: '210',
    sortable: true
  },
  {
    prop: 'bandwidth_gbps_ip',
    label: '至IP专网带宽(Gbps)',
    width: '210',
    sortable: true
  },
  {
    prop: 'create_time',
    label: '创建时间',
    width: '210',
    sortable: true
  },
  {
    prop: 'create_id',
    label: '创建人',
    width: '210',
    sortable: true
  },
  {
    prop: 'update_time',
    label: '最后更新时间',
    width: '210',
    sortable: true
  },
  {
    prop: 'update_id',
    label: '更新人',
    width: '210',
    sortable: true
  },
  {
    prop: 'status',
    label: '状态',
    width: '210',
    sortable: true
  },
  {
    prop: 'remark',
    label: '备注',
    width: '210',
    sortable: true
  }
]

export const tableHead1 = [
  {
    prop: 'primary_department',
    label: '一级部门',
    width: '110',
    sortable: true
  },
  {
    prop: 'secondary_department',
    label: '二级部门',
    width: '110',
    sortable: true
  },
  {
    prop: 'app_system',
    label: '业务系统',
    width: '110',
    sortable: true
  },
  {
    prop: 'is_project',
    label: '是否立项',
    width: '110',
    sortable: true
  },
  {
    prop: 'project_time',
    label: '立项时间',
    width: '110',
    sortable: true
  },
  {
    prop: 'resource_put_date',
    label: '资源提出时间',
    width: '130',
    sortable: true
  },
  {
    prop: 'resource_produce_date',
    label: '资源预期投资时间',
    width: '160',
    sortable: true
  },
  {
    prop: 'system_description',
    label: '系统描述',
    width: '110',
    sortable: true
  },
  {
    prop: 'vm_model1',
    label: '16核、128G、200G系统',
    width: '210',
    sortable: true
  },
  {
    prop: 'vm_model2',
    label: '8核、64G、200G系统',
    width: '210',
    sortable: true
  },
  {
    prop: 'vm_model3',
    label: '8核、32G、200G系统',
    width: '210',
    sortable: true
  },
  {
    prop: 'vm_model4',
    label: '8核、16G、200G系统',
    width: '210',
    sortable: true
  },
  {
    prop: 'vm_model5',
    label: '4核、32G、200G系统',
    width: '210',
    sortable: true
  },
  {
    prop: 'vm_model6',
    label: '4核、16G、200G系统',
    width: '210',
    sortable: true
  },
  {
    prop: 'vm_model7',
    label: '4核、8G、200G系统',
    width: '210',
    sortable: true
  },
  {
    prop: 'vm_model8',
    label: '2核、4G、200G系统',
    width: '210',
    sortable: true
  },
  {
    prop: 'pm_low_app_server',
    label: '虚拟机宿主机低端应用服务',
    width: '220',
    sortable: true
  },
  {
    prop: 'pm_analytical_server',
    label: '分析型服务器(MPP服务器)(台)',
    width: '240',
    sortable: true
  },
  {
    prop: 'pm_distributed_server',
    label: '分布式服务器(Hadoo)',
    width: '210',
    sortable: true
  },
  {
    prop: 'pm_cache_server',
    label: '缓存型服务器(台)',
    width: '210',
    sortable: true
  },
  {
    prop: 'pm_high_app_server',
    label: '高端应用服务器(台)',
    width: '210',
    sortable: true
  },
  {
    prop: 'storage_distributd_file_capacity',
    label: '分布式文件存储(TB)',
    width: '210',
    sortable: true
  },
  {
    prop: 'storage_distributd_block_performance',
    label: '分布式块存储(TB)',
    width: '210',
    sortable: true
  },
  {
    prop: 'storage_object_capacity',
    label: '对象存储(TB)',
    width: '210',
    sortable: true
  },
  {
    prop: 'storage_fc_san_capacity',
    label: 'FC-SAN存储(TB)',
    width: '210',
    sortable: true
  },
  {
    prop: 'storage_ip_san_capacity',
    label: 'IP-SAN存储(TB)',
    width: '210',
    sortable: true
  },
  {
    prop: 'storage_fc_san_naked',
    label: 'FC-SAN裸盘(TB)',
    width: '210',
    sortable: true
  },
  {
    prop: 'storage_ip_san_naked',
    label: 'IP-SAN裸盘(TB)',
    width: '210',
    sortable: true
  },
  {
    prop: 'storage_back_up',
    label: '备份存储(TB)',
    width: '210',
    sortable: true
  },
  {
    prop: 'cmnet_address',
    label: 'CMNET地址需求(个)',
    width: '210',
    sortable: true
  },
  {
    prop: 'bandwidth_gbps_cmnet',
    label: '至CMNET带宽(Gbps)',
    width: '210',
    sortable: true
  },
  {
    prop: 'ip_address',
    label: 'IP地址需求(个)',
    width: '210',
    sortable: true
  },
  {
    prop: 'bandwidth_gbps_ip',
    label: '至IP专网带宽(Gbps)',
    width: '210',
    sortable: true
  },
  {
    prop: 'create_time',
    label: '创建时间',
    width: '210',
    sortable: true
  },
  {
    prop: 'remark',
    label: '备注',
    width: '210',
    sortable: true
  }
]

export const tableForm = [
  {
    prop: 'vm_model1',
    label: '16核、128G、200G系统',
    width: '210',
    sortable: true
  },
  {
    prop: 'vm_model2',
    label: '8核、64G、200G系统',
    width: '210',
    sortable: true
  },
  {
    prop: 'vm_model3',
    label: '8核、32G、200G系统',
    width: '210',
    sortable: true
  },
  {
    prop: 'vm_model4',
    label: '8核、16G、200G系统',
    width: '210',
    sortable: true
  },
  {
    prop: 'vm_model5',
    label: '4核、32G、200G系统',
    width: '210',
    sortable: true
  },
  {
    prop: 'vm_model6',
    label: '4核、16G、200G系统',
    width: '210',
    sortable: true
  },
  {
    prop: 'vm_model7',
    label: '4核、8G、200G系统',
    width: '210',
    sortable: true
  },
  {
    prop: 'vm_model8',
    label: '2核、4G、200G系统',
    width: '210',
    sortable: true
  },
  {
    prop: 'pm_low_app_server',
    label: '虚拟机宿主机低端应用服务',
    width: '220',
    sortable: true
  },
  {
    prop: 'pm_analytical_server',
    label: '分析型服务器(MPP服务器)(台)',
    width: '240',
    sortable: true
  },
  {
    prop: 'pm_distributed_server',
    label: '分布式服务器(Hadoo)',
    width: '210',
    sortable: true
  },
  {
    prop: 'pm_cache_server',
    label: '缓存型服务器(台)',
    width: '210',
    sortable: true
  },
  {
    prop: 'pm_high_app_server',
    label: '高端应用服务器(台)',
    width: '210',
    sortable: true
  },
  {
    prop: 'storage_distributd_file_capacity',
    label: '分布式文件存储(TB)',
    width: '210',
    sortable: true
  },
  {
    prop: 'storage_distributd_block_performance',
    label: '分布式块存储(TB)',
    width: '210',
    sortable: true
  },
  {
    prop: 'storage_object_capacity',
    label: '对象存储(TB)',
    width: '210',
    sortable: true
  },
  {
    prop: 'storage_fc_san_capacity',
    label: 'FC-SAN存储(TB)',
    width: '210',
    sortable: true
  },
  {
    prop: 'storage_ip_san_capacity',
    label: 'IP-SAN存储(TB)',
    width: '210',
    sortable: true
  },
  {
    prop: 'storage_fc_san_naked',
    label: 'FC-SAN裸盘(TB)',
    width: '210',
    sortable: true
  },
  {
    prop: 'storage_ip_san_naked',
    label: 'IP-SAN裸盘(TB)',
    width: '210',
    sortable: true
  },
  {
    prop: 'storage_back_up',
    label: '备份存储(TB)',
    width: '210',
    sortable: true
  },
  {
    prop: 'cmnet_address',
    label: 'CMNET地址需求(个)',
    width: '210',
    sortable: true
  },
  {
    prop: 'bandwidth_gbps_cmnet',
    label: '至CMNET带宽(Gbps)',
    width: '210',
    sortable: true
  },
  {
    prop: 'ip_address',
    label: 'IP地址需求(个)',
    width: '210',
    sortable: true
  },
  {
    prop: 'bandwidth_gbps_ip',
    label: '至IP专网带宽(Gbps)',
    width: '210',
    sortable: true
  },
  {
    prop: 'remark',
    label: '备注：',
    width: '210',
    sortable: true
  }
]

export const stateList = [
  {
    label: '已预估',
    value: '1'
  },
  {
    label: '建设中',
    value: '2'
  },
  {
    label: '已关闭',
    value: '0'
  }
]

const sysList2 = []
/* const sysList1 = []
rbProjectDataServiceFactory.getResourcePool().then((res) => {
  res.formOptions.forEach(item => {
    sysList1.push(item)
  })
}) */
let obj = {
  'type': 'idcType',
  'pid': ''
}
rbProjectDataServiceFactory2.getConfigDictByType(obj).then((res) => {
  res.forEach(item => {
    sysList2.push(item)
  })
})
export const sysList = sysList2
