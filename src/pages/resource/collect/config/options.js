export const tableHead = [
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
    prop: 'special_requirement',
    label: '与前期上报需求有无变化,如有,请说明原因',
    width: '290',
    sortable: false
  },
  {
    prop: 'address_requirement',
    label: '物理局址要求',
    width: '130',
    sortable: false
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
    width: '160',
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
    width: '130',
    sortable: true
  },
  {
    prop: 'image_go',
    label: '镜像go',
    width: '110',
    sortable: true
  },
  {
    prop: 'image_nodejs',
    label: '镜像nodejs',
    width: '120',
    sortable: true
  },
  {
    prop: 'image_ruby',
    label: '镜像ruby',
    width: '110',
    sortable: true
  },
  {
    prop: 'image_net',
    label: '镜像net',
    width: '110',
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
    width: '130',
    sortable: true
  },
  {
    prop: 'department_head',
    label: '部门负责人',
    width: '120',
    sortable: true
  },
  {
    prop: 'inter_contact',
    label: '接口联系人',
    width: '120',
    sortable: true
  },
  {
    prop: 'phone',
    label: '电话',
    width: '110',
    sortable: true
  },
  {
    prop: 'email',
    label: '邮箱',
    width: '110',
    sortable: true
  },
  {
    prop: 'create_time',
    label: '创建时间',
    width: '160',
    sortable: true
  }
]

export const tableHeadFile = [
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
    prop: 'special_requirement',
    label: '与前期上报需求有无变化,如有,请说明原因',
    width: '290',
    sortable: false
  },
  {
    prop: 'address_requirement',
    label: '物理局址要求',
    width: '130',
    sortable: false
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
  },
  {
    prop: 'department_head',
    label: '部门负责人',
    width: '210',
    sortable: true
  },
  {
    prop: 'inter_contact',
    label: '接口联系人',
    width: '210',
    sortable: true
  },
  {
    prop: 'phone',
    label: '电话',
    width: '110',
    sortable: true
  },
  {
    prop: 'email',
    label: '邮箱',
    width: '110',
    sortable: true
  }
]
