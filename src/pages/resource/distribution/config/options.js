import rbProjectDataServiceFactory from 'src/services/resource/rb-resource-services.factory.js'
import rbProjectDataServiceFactory2 from 'src/services/template/rb-template-services.factory.js'
const poolList1 = []
const brandList1 = []
const departmentList1 = []
const deviceClassList1 = []
const roomList1 = []
const stateList1 = []

// rbProjectDataServiceFactory.resourcePoolJsonDatas({
//   type: 'resourcePool'
// }).then((res) => {
//   poolList1.splice(0, 0, ...res)
// }).catch(() => {})
/* rbProjectDataServiceFactory.getResourcePool().then((res) => {
  res.formOptions.forEach(item => {
    poolList1.push(item)
  })
}) */
let obj_poolList = {
  'type': 'idcType',
  'pid': ''
}
rbProjectDataServiceFactory2.getConfigDictByType(obj_poolList).then((res) => {
  res.forEach(item => {
    poolList1.push(item)
  })
})

rbProjectDataServiceFactory.getBrand().then((res) => {
  brandList1.splice(0, 0, ...res)
}).catch(() => {})

rbProjectDataServiceFactory.jsonDatas({
  type: 'department'
}).then((res) => {
  departmentList1.splice(0, 0, ...res)
}).catch(() => {})

rbProjectDataServiceFactory.jsonDatas({
  type: 'deviceClass'
}).then((res) => {
  deviceClassList1.splice(0, 0, ...res)
}).catch(() => {})

rbProjectDataServiceFactory.jsonDatas({
  type: 'idcLocationType'
}).then((res) => {
  roomList1.splice(0, 0, ...res)
}).catch(() => {})

rbProjectDataServiceFactory.jsonDatas({
  type: 'assType'
}).then((res) => {
  stateList1.push({LABEL: '==全部==', VALUE: ''})
  res.forEach((item) => {
    if (item.VALUE !== '2') {
      stateList1.push(item)
    }
  })
}).catch(() => {})

export const poolList = poolList1

export const brandList = brandList1

export const departmentList = departmentList1

export const deviceClassList = deviceClassList1

export const roomList = roomList1

export const stateList = stateList1

export const tableHead = [
  {
    prop: 'resource_pool',
    label: '资源池',
    width: '160',
    sortable: true
  },
  {
    prop: 'company_name',
    label: '单位名称',
    width: '160',
    sortable: true
  },
  {
    prop: 'department',
    label: '部门',
    width: '160',
    sortable: true
  },
  {
    prop: 'business_name',
    label: '业务系统',
    width: '160',
    sortable: true
  },
  {
    prop: 'status',
    label: '状态',
    width: '160',
    sortable: true
  },
  {
    prop: 'vm_kernel_num',
    label: '虚拟机核数',
    width: '160',
    sortable: true
  },
  {
    prop: 'vm_momery',
    label: '虚拟机内存(G)',
    width: '160',
    sortable: true
  },
  {
    prop: 'vm_system_disk',
    label: '虚拟机硬盘(G)',
    width: '160',
    sortable: true
  },
  {
    prop: 'pm_analytical_server_b1',
    label: '分析型服务器(模型B1)(台)',
    width: '210',
    sortable: true
  },
  {
    prop: 'pm_distributed_server_b2',
    label: '分布式服务器(模型B2)(台)',
    width: '210',
    sortable: true
  },
  {
    prop: 'pm_distributed_server_b3',
    label: '分布式服务器(模型B3)(台)',
    width: '210',
    sortable: true
  },
  {
    prop: 'pm_node_server_b4',
    label: '管理节点服务器',
    width: '160',
    sortable: true
  },
  {
    prop: 'pm_cache_server_s1',
    label: '缓存型服务器',
    width: '160',
    sortable: true
  },
  {
    prop: 'pm_storage_server_s3',
    label: '存储型服务器',
    width: '160',
    sortable: true
  },
  {
    prop: 'pm_vedio_server_s4',
    label: '视频服务器(模型S4)(台)',
    width: '210',
    sortable: true
  },
  {
    prop: 'pm_virtual_server_c1',
    label: '虚拟化服务器(模型C1)',
    width: '210',
    sortable: true
  },
  {
    prop: 'pm_high_app_server_c3',
    label: '高端应用服务器(模型C3)',
    width: '210',
    sortable: true
  },
  {
    prop: 'pm_high_app_server_c4',
    label: '高端应用服务器(模型C4)',
    width: '210',
    sortable: true
  },
  {
    prop: 'pm_other_server',
    label: '其他服务器',
    width: '160',
    sortable: true
  },
  {
    prop: 'storage_distributd_file_capacity',
    label: '分布式文件存储(容量型)(TB)',
    width: '240',
    sortable: true
  },
  {
    prop: 'storage_distributd_file_performance',
    label: '分布式文件存储(性能型)(TB)',
    width: '240',
    sortable: true
  },
  {
    prop: 'storage_distributd_block_capacity',
    label: '分布式块存储(容量型)(TB)',
    width: '210',
    sortable: true
  },
  {
    prop: 'storage_distributd_block_performance',
    label: '分布式块存储(性能型)(TB)',
    width: '210',
    sortable: true
  },
  {
    prop: 'storage_object_capacity',
    label: '对象存储(TB)',
    width: '160',
    sortable: true
  },
  {
    prop: 'storage_fc_san_capacity',
    label: 'FC-SAN存储容量(TB)',
    width: '210',
    sortable: true
  },
  {
    prop: 'storage_fc_san_raid',
    label: 'FC-SAN存储RAID方式 ',
    width: '210',
    sortable: true
  },
  {
    prop: 'storage_back_up',
    label: '备份存储(TB)',
    width: '160',
    sortable: true
  },
  {
    prop: 'storage_nas',
    label: 'NAS存储(TB)',
    width: '160',
    sortable: true
  },
  {
    prop: 'load_balancer_low',
    label: '负载均衡(低端)(台)',
    width: '210',
    sortable: true
  },
  {
    prop: 'load_balancer_middle',
    label: '负载均衡(高端)(台)',
    width: '210',
    sortable: true
  },
  {
    prop: 'load_balancer_high',
    label: '负载均衡(高端)(台)',
    width: '210',
    sortable: true
  },
  {
    prop: 'firewall',
    label: '防火墙',
    width: '160',
    sortable: true
  },
  {
    prop: 'switch_infiniband_gateway',
    label: 'Infiniband交换机网关(台)',
    width: '210',
    sortable: true
  },
  {
    prop: 'switch_infiniband_conerge',
    label: 'Infiniband交换机汇聚(台)',
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
    prop: 'bandwidth_gbps_ip',
    label: '至IP专网带宽(Gbps)',
    width: '210',
    sortable: true
  },
  {
    prop: 'special_line',
    label: '专线带宽资源需求(Gbps)',
    width: '210',
    sortable: true
  },
  {
    prop: 'other_resource',
    label: '其他资源需求',
    width: '210',
    sortable: true
  },
  {
    prop: 'create_time',
    label: '创建时间',
    width: '160',
    sortable: true
  },
  {
    prop: 'remark',
    label: '备注',
    width: '160',
    sortable: true
  }
]

export const tableHead1 = [
  {
    prop: 'DEVICE_IP',
    label: '设备IP',
    width: '160',
    sortable: true
  },
  {
    prop: 'DEVICE_LOG_NAME',
    label: '服务器逻辑名',
    width: '160',
    sortable: true
  },
  {
    prop: 'DEVICE_TYPE',
    label: '服务器类型',
    width: '160',
    sortable: true
  },
  {
    prop: 'CONSOLE_IP',
    label: 'console IP',
    width: '160',
    sortable: true
  },
  {
    prop: 'BUSINESS_VLAN',
    label: '业务vlan',
    width: '160',
    sortable: true
  },
  {
    prop: 'NETWORK_AREA',
    label: '网络区域',
    width: '160',
    sortable: true
  },
  {
    prop: 'IDC_LABEL',
    label: '所属域',
    width: '160',
    sortable: true
  },
  {
    prop: 'business_department',
    label: '业务部门',
    width: '160',
    sortable: true
  },
  {
    prop: 'BUSINESS_LEVEL1',
    label: '业务系统',
    width: '160',
    sortable: true
  },
  {
    prop: 'OS_TYPE',
    label: 'OS类型',
    width: '160',
    sortable: true
  }
]

export const tableHeadFile = [
  {
    prop: 'resource_pool',
    label: '资源池',
    width: '110',
    sortable: true
  },
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
    prop: 'status',
    label: '状态',
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
    prop: 'db_mysql',
    label: 'mysql数据库',
    width: '210',
    sortable: true
  },
  {
    prop: 'db_mongodb',
    label: 'mongodb数据库',
    width: '210',
    sortable: true
  },
  {
    prop: 'db_postgresql',
    label: 'postgresql数据库',
    width: '210',
    sortable: true
  },
  {
    prop: 'db_memory',
    label: '内存数据库',
    width: '210',
    sortable: true
  },
  {
    prop: 'db_other',
    label: '其它数据库',
    width: '210',
    sortable: true
  },
  {
    prop: 'cache_redis',
    label: '分布式缓存redis',
    width: '210',
    sortable: true
  },
  {
    prop: 'cache_memcached',
    label: '分布式缓存Memcached',
    width: '210',
    sortable: true
  },
  {
    prop: 'info_middleware_activemq',
    label: '消息中间件activemq',
    width: '210',
    sortable: true
  },
  {
    prop: 'info_middleware_kafka',
    label: '消息中间件kafka',
    width: '210',
    sortable: true
  },
  {
    prop: 'info_middleware_rocketmq',
    label: '消息中间件rockermq',
    width: '210',
    sortable: true
  },
  {
    prop: 'app_middleware_apache',
    label: '应用中间件apache',
    width: '210',
    sortable: true
  },
  {
    prop: 'app_middleware_jboos',
    label: '应用中间件jboos',
    width: '210',
    sortable: true
  },
  {
    prop: 'app_middleware_tomcat',
    label: '应用中间件tomcat',
    width: '210',
    sortable: true
  },
  {
    prop: 'balancer_nginx',
    label: 'nginx',
    width: '110',
    sortable: true
  },
  {
    prop: 'balancer_haproxy',
    label: 'haproxy',
    width: '110',
    sortable: true
  },
  {
    prop: 'server_zookeeper',
    label: '分布式协调服务zookeeper',
    width: '220',
    sortable: true
  },
  {
    prop: 'server_etcd',
    label: '分布式协调服务etcd',
    width: '210',
    sortable: true
  },
  {
    prop: 'search_middleware_es',
    label: '搜索中间件ES',
    width: '210',
    sortable: true
  },
  {
    prop: 'server_docker_registry',
    label: '镜像仓库DockerRegistry',
    width: '210',
    sortable: true
  },
  {
    prop: 'stream_jbpm',
    label: '工作流JBPM',
    width: '210',
    sortable: true
  },
  {
    prop: 'stream_activity',
    label: '工作流activity',
    width: '210',
    sortable: true
  },
  {
    prop: 'image_openjdk',
    label: '镜像openjdk',
    width: '210',
    sortable: true
  },
  {
    prop: 'image_python',
    label: '镜像python',
    width: '210',
    sortable: true
  },
  {
    prop: 'image_go',
    label: '镜像go',
    width: '210',
    sortable: true
  },
  {
    prop: 'image_nodejs',
    label: '镜像nodejs',
    width: '210',
    sortable: true
  },
  {
    prop: 'image_ruby',
    label: '镜像ruby',
    width: '210',
    sortable: true
  },
  {
    prop: 'image_net',
    label: '镜像net',
    width: '210',
    sortable: true
  },
  {
    prop: 'cicd_jenkins',
    label: 'CICDjenkins',
    width: '210',
    sortable: true
  },
  {
    prop: 'framework_springcloud',
    label: '开发框架springcloud人',
    width: '210',
    sortable: true
  },
  {
    prop: 'framework_other',
    label: '其它开发框架',
    width: '210',
    sortable: true
  }
]
