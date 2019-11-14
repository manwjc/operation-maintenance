// Items:
const NAV_ITEM_WORKBENCH = {
  name: '工作台',
  icon: '#icongongdan',
  children: [{
      name: '综合首页',
      base: '/',
      routers: [{
          path: 'home/mapindex',
          name: '首页',
          component: 'index.vue'
        },
        {
          path: 'views',
          name: '首页定制',
          component: 'index.vue'
        },
      ]
    },
    {
      name: '总览视图',
      base: '/',
      children: [{
        name: '告警总览',
        base: 'mirror_alert',
        routers: [{
          name: '告警首页',
          path: '/main',
          component: 'alert.vue'
        }]
      }]
    },
    {
      name: '我的告警',
      base: '/mirror_alert',
      children: [{
        name: '我的告警',
        base: '/main_alert',
        routers: [{
          name: '我的告警',
          path: '/list',
          component: 'mirror-main-alert-list.vue'
        }]
      }]
      // routers: [{
      //   path: '/main_alert/list',
      //   name: '我的告警',
      //   component: 'mirror-main-alert-list.vue'
      // }]
    },
    // {
    //   name: '我的工单',
    //   base: '/bpmx',
    //   routers: [{
    //     path: '/alert',
    //     name: '工单',
    //     component: 'mirror-alert-list.vue'
    //   }
    //   ]
    // },
    // {
    //   name: '我的告警',
    //   base: '/mirror_alert/alert_his',
    //   routers: [{
    //     path: '/alert',
    //     name: '告警管理',
    //     component: 'mirror-alert-list.vue'
    //   },
    //   {
    //     path: '/detail',
    //     name: '告警详情',
    //     component: 'mirror-alert-detail.vue'
    //   }
    //   ]
    // },
    {
      name: '我的资源',
      base: '/cmdb/maintain',
      routers: [{
        path: '/main',
        name: '维护圈主页',
        component: 'maintain.vue'
      }, {
        path: '/edit',
        name: '维护圈编辑',
        component: 'editMaintain.vue'
      }, {
        path: '/create',
        name: '维护圈创建',
        component: 'addMaintain.vue'
      }, {
        path: '/configure',
        name: '维护圈配置',
        component: 'enterMaintain.vue'
      }]
    }
  ]
}
// 告警
const NAV_ITEM_MONITOR = {
  name: '告警',
  icon: '#icongaojing',
  children: [{
    name: '告警看板管理',
    base: '/mirror_alert',
    children: [{
      name: '告警首页',
      base: '/alert',
      routers: [{
          path: '/mapindex',
          name: '告警首页',
          component: 'index.vue'
        },
        {
          path: '/detail',
          name: '告警详情',
          component: 'mirror-alert-detail.vue'
        }
      ]
    }, {
      name: '当前告警',
      base: '/alert',
      routers: [{
          path: '/manage',
          name: '告警管理',
          component: 'alert.vue'
        },
        {
          path: '/detail',
          name: '告警详情',
          component: 'mirror-alert-detail.vue'
        }
      ]
    }, {
      name: '历史告警',
      base: '/alert_his',
      routers: [{
          path: '/his_alert',
          name: '历史告警',
          component: 'mirror-his-alert-list.vue'
        },
        {
          path: '/his_detail',
          name: '历史告警详情',
          component: 'mirror-alert-his-detail.vue'
        }
      ]
    }]
  }, {
    name: '告警收敛看板',
    base: '/mirror_alert',
    children: [{
      name: '告警收敛看板',
      base: '/alert_intelligent',
      routers: [{
        path: '/list',
        name: '告警收敛看板',
        component: 'alert-intelligent-list.vue'
      }]
    }]
  }, {
    name: '告警策略管理',
    base: '/mirror_alert',
    children: [{
      name: '告警通知策略',
      base: '/alert_notify_config',
      routers: [{
        path: '/list',
        name: '告警通知配置',
        component: 'alert-notify-config-list.vue'
      }]
    }, {
      name: '告警筛选设置',
      base: '/filter',
      routers: [{
        path: '/list',
        name: '过滤器管理',
        component: 'mirror-filter-list.vue'
      }]
    }, {
      name: '告警筛选场景',
      base: '/filter/scene',
      routers: [{
          path: '/list',
          name: '场景管理',
          component: 'mirror-filterScene-list.vue'
        },
        {
          path: '/add',
          name: '筛选条件设置',
          component: 'scene-setting.vue'
        }
      ]
    }, {
      name: '邮件告警设置',
      base: '/emailInfo_receive',
      routers: [{
        path: '/list',
        name: '收邮箱管理',
        component: 'config-list.vue'
      }, {
        path: '/receiver-config/list',
        name: '收件人采集管理',
        component: 'receiver-list.vue'
      }, {
        path: '/receiver-config/collection',
        name: '采集记录',
        component: 'collection-list.vue'
      }]
    }, {
      name: '告警屏蔽管理',
      base: '/shield',
      routers: [{
        path: '/list',
        name: '屏蔽规则管理',
        component: 'list.vue'
      }, {
        path: '/details',
        name: '屏蔽规则详情',
        component: 'details.vue'
      }, {
        path: '/alert',
        name: '屏蔽日志查询',
        component: 'isolate-alert-list.vue'
      }]
    }, {
      name: '告警衍生管理',
      base: '/derive',
      routers: [{
        path: '/list',
        name: '衍生规则管理',
        component: 'list.vue'
      }, {
        path: '/details',
        name: '衍生规则详情',
        component: 'details.vue'
      }, {
        path: '/alert',
        name: '衍生日志查询',
        component: 'derive-alert-list.vue'
      }]
    }, {
      name: '主次告警管理',
      base: '/primary_secondary',
      routers: [{
        path: '/list',
        name: '主次规则管理',
        component: 'list.vue'
      }, {
        path: '/details',
        name: '主次规则详情',
        component: 'details.vue'
      }, {
        path: '/alert',
        name: '次要日志查询',
        component: 'secondary-alert-list.vue'
      }]
    }]
  }, {
    name: '日常管理',
    base: '/',
    children: [{
      name: '值班日志',
      base: 'mirror_alert',
      routers: [{
        path: '/logbook',
        name: '值班日志',
        component: 'logbook.vue'
      }]
    }, {
      name: '巡检日报',
      base: 'mirror_alert/operation_report',
      routers: [{
        path: '/inspection_daily',
        name: '巡检日报',
        component: 'inspection_daily.vue'
      }]
    }]
  }]
}
// 安全
const NAV_ITEM_SECURITY = {
  name: '安全',
  icon: '#iconyunying',
  children: [{
    name: '安全漏洞管理',
    base: '/mirror_alert',
    children: [{
      name: '文件扫描列表',
      base: '/leak_scan',
      routers: [{
        path: '/list',
        name: '文件扫描列表',
        component: 'list.vue'
      }, {
        path: '/detail',
        name: '文件扫描明细',
        component: 'detail.vue'
      }, {
        path: '/ip',
        name: '报告详情',
        component: 'ip-iframe.vue'
      }]
    }]
  }, ]
}
// 系统管理
// const NAV_ITEM_CONFIG_SYSTEM =
const NAV_ITEM_CONFIG_CMDB = {
  name: '资源',
  icon: '#iconziyuan',
  children: [{
      name: '资源总览视图',
      base: '/',
      children: [{
        name: '资源首页(新)',
        base: 'resource/iframe',
        routers: [{
          path: '/mapindex',
          name: '资源首页(新)',
          component: 'index.vue'
        }]
      }, {
        name: '资源首页',
        base: 'resource/iframe',
        routers: [{
          path: '/iframeHome',
          name: '资源首页',
          component: 'view.vue'
        }]
      }, {
        name: '租户统计视图',
        base: 'resource/iframe',
        routers: [{
          path: '/department',
          name: '租户统计视图',
          component: 'view.vue'
        }]
      }, {
        name: '类型统计视图',
        base: 'resource/iframe',
        routers: [{
          path: '/device',
          name: '类型统计视图',
          component: 'view.vue'
        }]
      }]
    },
    {
      name: '资源信息管理',
      base: '/',
      children: [{
        name: '业务视图',
        base: 'resource/iframe',
        routers: [{
          path: '/resourceManagement',
          name: '业务视图',
          component: 'view.vue'
        }, {
          path: '/list',
          name: '资源列表',
          component: 'view.vue'
        }, {
          path: '/add',
          name: '新增资源',
          component: 'instance-add.vue'
        }, {
          path: '/detail',
          name: '资源信息',
          component: 'main.vue'
        }]
      },{
        name: '品牌视图',
        base: 'resource/iframe',
        routers: [{
          path: '/produceView',
          name: '品牌视图',
          component: 'view.vue'
        }]
      }, {
        name: '资源分类视图',
        base: 'resource/iframe',
        routers: [{
          path: '/resourceClassification',
          name: '资源分类视图',
          component: 'view.vue'
        }]
      }, {
        name: '配置项变更统计',
        base: 'resource/deviceStatistic',
        routers: [{
          name: '配置项变更统计',
          path: '/configureChange',
          component: 'configureChangeList.vue'
        }]
      }, {
        name: '配置项变更审核',
        base: 'resource/configurationItem',
        routers: [{
          name: '配置项变更审核',
          path: '/audit',
          component: 'config_item_audit.vue'
        }]
      }, {
        name: '未知设备管理',
        base: 'resource/collectUnknown',
        routers: [{
          name: '未知设备管理',
          path: '/list',
          component: 'list.vue'
        }]
      }]
    },
    {
      name: '资源统计',
      base: '/',
      children: [{
        name: '业务系统设备统计',
        base: 'resource/deviceStatistic',
        routers: [{
          name: '业务系统设备统计',
          path: '/bizSystem',
          component: 'bizSystemList.vue'
        }]
      }, {
        name: '归属部门设备统计',
        base: 'resource/deviceStatistic',
        routers: [{
          name: '归属部门设备统计',
          path: '/department',
          component: 'departmentList.vue'
        }]
      }, {
        name: '类型设备统计',
        base: 'resource/deviceStatistic',
        routers: [{
          path: '/deviceType',
          name: '类型设备统计',
          component: 'deviceTypeList.vue'
        }]
      }, {
        name: '资源池类型设备统计',
        base: 'resource/deviceStatistic',
        routers: [{
          name: '资源池类型设备统计',
          path: '/idcTypeDeviceType',
          component: 'idcTypeDeviceTypeList.vue'
        }]
      }, {
        name: '资源池业务统计',
        base: 'resource/deviceStatistic',
        routers: [{
          name: '资源池业务统计',
          path: '/idcType',
          component: 'idcTypeStatistic.vue'
        }]
      }, {
        name: '类型品牌设备统计',
        base: 'resource/deviceStatistic',
        routers: [{
          name: '类型品牌设备统计',
          path: '/deviceTypeDeviceMfrs',
          component: 'deviceTypeDeviceMfrsList.vue'
        }]
      }]
    },
    {
      name: '维保管理',
      base: '/resource',
      children: [{
        name: '维保项目管理',
        base: '/maintenance',
        routers: [{
          path: '/project/list',
          name: '维保项目管理',
          component: 'list.vue'
        }]
      }, {
        name: '硬件维保查询',
        base: '/maintenance',
        routers: [{
          path: '/hardware',
          name: '硬件维保查询',
          component: 'list.vue'
        }]
      }, {
        name: '软件维保查询',
        base: '/maintenance',
        routers: [{
          path: '/software',
          name: '软件维保查询',
          component: 'maintensoftList.vue'
        }]
      }, {
        name: '硬件维保使用查询',
        base: '/maintenance',
        routers: [{
          path: '/hardware/useManage',
          name: '硬件维保使用查询',
          component: 'list.vue'
        }]
      }, {
        name: '软件维保使用查询',
        base: '/maintenance',
        routers: [{
          path: '/softwareRecord',
          name: '软件维保使用查询',
          component: 'list.vue'
        }]
      }, {
        name: '厂商信息管理',
        base: '/maintenance',
        routers: [{
          path: '/produceInfo',
          name: '厂商信息管理',
          component: 'list.vue'
        }, {
          path: '/produceDetail',
          name: '厂商详情',
          component: 'detail.vue'
        }]
      },{
        name: '维保到期预警',
        base: '/maintenance',
        routers: [{
          path: '/maintenView',
          name: '维保到期预警',
          component: 'list.vue'
        }]
      }]
    },
    {
      name: '资源申请管理',
      base: '/',
      children: [{
        name: '资源需求调研管理',
        base: 'cmdb',
        routers: [{
          path: '/demand/list',
          name: '资源需求调研管理',
          component: 'demand_manager_list.vue'
        }, {
          path: '/demand/add',
          name: '新增需求调研',
          component: 'add.vue'
        }, {
          path: '/demand/edit',
          name: '编辑需求调研',
          component: 'edit.vue'
        }, {
          path: '/demand/detail',
          name: '查看需求调研',
          component: 'detail.vue'
        }]
      }, {
        name: '资源建设管理',
        base: 'resource/construct',
        routers: [{
          path: '/list',
          name: '资源建设列表',
          component: 'list.vue'
        }]
      }, {
        name: '资源预估管理',
        base: 'resource/estimate',
        routers: [{
          path: '/list',
          name: '资源预估列表',
          component: 'list.vue'
        }]
      }, {
        name: '资源规划视图 ',
        base: 'resource/overview',
        routers: [{
          path: '/list',
          name: '规划视图',
          component: 'list.vue'
        }]
      }, {
        name: '资源预分配管理',
        base: 'resource/distribution',
        routers: [{
          path: '/list',
          name: '资源预分配',
          component: 'list.vue'
        }]
      }]
    },
    {
      name: '后评估管理',
      base: '/',
      children: [{
          name: 'IT设备信息表',
          base: 'resource',
          routers: [{
            path: '/itInput',
            name: 'IT设备信息录入',
            component: 'list.vue'
          }]
        },
        {
          name: 'IT设备信息审核管理',
          base: 'resource',
          routers: [{
            path: '/itCheck',
            name: 'IT设备信息审核',
            component: 'list.vue'
          }]
        },
        {
          name: '后评估厂商评分管理',
          base: 'resource',
          routers: [{
            path: '/serviceAssess',
            name: '后评估厂商评分表',
            component: 'list.vue'
          }]
        }
      ]
    },
    {
      name: '运维数据分析报表',
      base: '/',
      children: [{
        name: '业务系统分析报表',
        base: 'resource/report',
        routers: [{
          path: '/bizSystem_resourcePool',
          name: '业务系统分析报表',
          component: 'report.vue'
        }]
      }, {
        name: '归属部门分析报表',
        base: 'resource/report',
        routers: [{
          path: '/department_resourcePool',
          name: '归属部门分析报表',
          component: 'report.vue'
        }]
      }, {
        name: '业务资源分配分析报表',
        base: 'resource/report',
        routers: [{
          path: '/bizResource',
          name: '业务资源分配分析报表',
          component: 'report.vue'
        }]
      }, {
        name: '低效无效资源分析报表',
        base: 'resource/deviceStatistic',
        routers: [{
          name: '低效无效资源分析报表',
          path: '/invalidResource',
          component: 'invalidResourceList.vue'
        }]
      }, {
        name: '业务物理资源使用率分析报表',
        base: 'resource/report',
        routers: [{
          path: '/bizResource_physical',
          name: '业务物理资源使用率分析报表',
          component: 'report.vue'
        }]
      }, {
        name: '业务虚拟资源使用率分析',
        base: 'resource/report',
        routers: [{
          path: '/bizResource_vm',
          name: '业务虚拟资源使用率分析',
          component: 'report.vue'
        }]
      }]
    },
    {
      name: '运营数据分析报表',
      base: '/',
      children: [{
        name: '运营月报',
        base: 'iframe/report',
        routers: [{
          path: '/operational-report',
          name: '运营月报',
          component: 'view.vue'
        }]
      }]
    },
    {
      name: 'IP管理',
      base: '/resource',
      children: [{
        name: 'IP分配管理',
        base: '/ipmanage',
        routers: [{
          path: '/manage',
          name: 'IP分配管理',
          component: 'manage.vue'
        }]
      }, {
        name: 'IP分配查询',
        base: '/ipoperate',
        routers: [{
          path: '/operate',
          name: 'IP分配查询',
          component: 'list.vue'
        }]
      }]
    }
  ]
}

const NAV_ITEM_SYSTEM = {
  name: '配置',
  children: [
    // {
    //   name: '拓扑',
    //   base: '/',
    //   children: [{
    //     name: '拓扑管理',
    //     base: 'topo',
    //     routers: [{
    //       path: '/list',
    //       name: '拓扑列表',
    //       component: 'topoList.vue'
    //     }, {
    //       path: '/configuration',
    //       name: '拓扑编辑',
    //       component: 'index.vue'
    //     }, {
    //       path: '/view',
    //       name: '拓扑查看',
    //       component: 'site.vue'
    //     }]
    //   }]
    // },
    {
      name: '部门业务管理',
      base: '/',
      children: [{
        name: '部门管理',
        base: 'cmdb/orgManager',
        routers: [{
          name: '部门管理',
          path: '/list',
          component: 'orgManager.vue'
        }]
      }, {
        name: '业务系统管理',
        base: 'cmdb/bizSystem',
        routers: [{
          path: '/list',
          name: '业务系统管理',
          component: 'bizSystem.vue'
        }]
      }]
    },
    {
      name: '资源模型管理',
      base: '/',
      children: [{
          name: '数据字典管理',
          base: 'cmdb/configDict',
          routers: [{
            path: '/list',
            name: '数据字典管理',
            component: 'configDictList.vue'
          }]
        }, {
          name: '码表管理',
          base: 'cmdb/v2/code',
          routers: [{
            path: '/list',
            name: '码表查询',
            component: 'list.vue'
          }]
        },
        {
          name: '控件类型管理',
          base: 'cmdb/v2/control',
          routers: [{
            name: '控件查询',
            path: '/list',
            component: 'list.vue'
          }]
        },
        {
          name: '资源模型配置',
          base: 'cmdb/v2',
          routers: [{
            path: '/module',
            name: '模型配置',
            component: 'module-list.vue'
          }]
        }
        // {
        //   name: '自动发现配置',
        //   base: 'cmdb/newDiscover',
        //   routers: [{
        //     name: '规则管理',
        //     path: '/setRule',
        //     component: 'main.vue'
        //   }]
        // }
      ]
    },
    {
      name: '用户权限管理',
      base: '/',
      children: [{
          name: '角色管理',
          base: 'system_manage',
          routers: [{
            path: '/role',
            name: '功能角色管理',
            component: 'function-role.vue'
          }]
        },
        {
          name: '数据资源',
          base: 'system_manage',
          routers: [{
              path: '/resource',
              name: '资源管理',
              component: 'resource.vue'
            },
            {
              path: '/resource-add',
              name: '资源管理-新增资源',
              component: 'resource-add.vue'
            }
          ]
        },
        {
          name: '用户管理',
          base: 'system_manage',
          routers: [{
            path: '/person',
            name: '人员管理',
            component: 'person.vue'
          }]
        },
        {
          name: '账号管理',
          base: 'system_manage',
          routers: [{
            path: '/account',
            name: '账号管理',
            component: 'account.vue'
          }]
        }
        // {
        //   name: '账号',
        //   base: '/system',
        //   routers: [{
        //     path: '/account',
        //     name: '账号管理',
        //     component: 'account.vue'
        //   }]
        // }
      ]
    },
    {
      name: '定制化管理',
      base: '/',
      children: [{
        name: '首页定制',
        base: 'settings',
        routers: [{
          path: '/customization/edits',
          name: '定制页',
          component: 'index.vue'
        }]
      }]
    },
    // {
    //   name: '主题管理',
    //   base: '/',
    //   children: [{
    //     name: '主题配置',
    //     base: 'settings',
    //     routers: [{
    //       path: '/customization/edits',
    //       name: '定制页',
    //       component: 'index.vue'
    //     }]
    //   }]
    // },
    {
      name: '开发者工具',
      base: '/',
      children: [{
          name: '生成代码',
          base: 'help/javacode',
          routers: [{
            path: '/generator',
            name: '生成代码',
            component: 'code-generator.vue'
          }]
        },
        {
          name: 'SQL配置',
          base: 'generator',
          routers: [{
            path: '/generator',
            name: '资源管理',
            component: 'code-generator.vue'
          }]
        },
        {
          name: '前端模板',
          base: 'templates',
          routers: [{
            path: '/web',
            name: '前端模板',
            component: 'list.vue'
          }]
        }
      ]
    }
  ]
}

// 监控管理
const NAV_ITEM_CONFIG_JIANKONG = {
  name: '监控',
  icon: '#iconjiankong',
  children: [{
      name: '监控视图管理',
      base: '/',
      children: [{
          name: '监控首页',
          base: 'mirror_alert',
          routers: [{
            path: '/mapindex',
            name: '监控首页',
            component: 'index.vue'
          }]
        },
        {
          name: '监控dashboard',
          base: 'mirror_alert/report',
          routers: [{
            path: '/dashboardConfig',
            name: 'dashboard',
            component: 'report-config.vue'
          }]
        }, {
          name: 'grafana报表',
          url: `${sessionStorage.getItem('GRAFANA_SERVER_URL')}/d/NNztUz6mz/1-zhu-ji-xi-tong-jian-kong-tu-biao-cpu-nei-cun-ci-pan-wang-luo?orgId=1`,
          routers: []
        }
      ]
    }, {
      name: '监控大屏管理',
      base: '/iframe',
      children: [{
        name: '统一视图',
        base: '/report',
        routers: [{
          path: '/big-screen',
          name: '统一视图',
          component: 'view.vue'
        }]
      }, {
        name: '网络视图',
        base: '/report',
        routers: [{
          path: '/network',
          name: '网络视图',
          component: 'view.vue'
        }]
      }, {
        name: '主机视图',
        base: '/report',
        routers: [{
          path: '/host',
          name: '主机视图',
          component: 'view.vue'
        }]
      }, {
        name: '存储视图',
        base: '/report',
        routers: [{
          path: '/storage',
          name: '存储视图',
          component: 'view.vue'
        }]
      }]
    },
    {
      name: '网络监控管理',
      base: '/',
      children: [{
        name: '配置文件管理',
        base: 'netconfigs/net',
        routers: [{
          path: '/list',
          name: '配置文件列表',
          component: 'list.vue'
        }, {
          path: '/compare',
          name: '内容对比',
          component: 'compare.vue'
        }]
      }, {
        name: 'sys日志管理',
        base: 'logs/device',
        routers: [{
          path: '/list',
          name: '网络设备日志列表',
          component: 'list.vue'
        }]
      }, {
        name: 'sys日志告警管理',
        base: 'logs/alert',
        routers: [{
          path: '/list',
          name: '日志告警规则',
          component: 'syslog-alert-rule-list.vue'
        }]
      }, {
        name: '策略配置管理',
        base: 'mirror_alert/net_strategy',
        routers: [{
          path: '/list',
          name: '网络策略管理',
          component: 'list.vue'
        }]
      }, {
        name: '网络拓扑管理',
        base: 'topo',
        routers: [{
          path: '/list',
          name: '拓扑列表',
          component: 'topoList.vue'
        }, {
          path: '/configuration',
          name: '拓扑编辑',
          component: 'index.vue'
        }, {
          path: '/view',
          name: '拓扑查看',
          component: 'site.vue'
        }]
      }]
    }, {
      name: 'Http监控管理',
      base: '/',
      children: [{
        name: 'Http监控',
        base: 'mirror_alert',
        routers: [{
          path: '/http',
          name: 'Http监控',
          component: 'list.vue'
        }]
      }]
    },
    {
      name: '业务监控管理',
      base: '/',
      children: [{
        name: '主题定义管理',
        base: 'theme',
        routers: [{
          path: '/list',
          name: '主题管理',
          component: 'thematicData.vue'
        }, {
          path: '/add',
          name: '新增主题',
          component: 'addTheme.vue'
        }, {
          path: '/update',
          name: '修改主题',
          component: 'updateTheme.vue'
        }]
      }, {
        name: '指标定义管理',
        base: 'mirror_business/bizTem',
        routers: [{
          path: '/list',
          name: '业务模板列表',
          component: 'list.vue'
        }, {
          path: '/add',
          name: '业务模板新增',
          component: 'add.vue',
          keepAlive: true,
          children: [{
            name: '模板设置',
            base: '/add',
            routers: [{
              path: '/addevices',
              name: '设备管理',
              component: 'addevices.vue'
            }]
          }]
        }, {
          path: '/update',
          name: '业务模板修改',
          component: 'update.vue',
          keepAlive: true,
          children: [{
            name: '模板设置',
            base: '/update',
            routers: [{
              path: '/addevices',
              name: '设备管理',
              component: 'addevices.vue'
            }]
          }]
        }]
      }]
    }, {
      name: '监控巡检管理',
      base: '/',
      children: [{
        name: '巡检模板管理',
        base: 'mirror/template',
        routers: [{
          path: '/list',
          name: '模板列表',
          component: 'list.vue'
        }, {
          path: '/add',
          name: '模板设置',
          component: 'add.vue',
          keepAlive: true,
          children: [{
            name: '模板设置',
            base: '/add',
            routers: [{
              path: '/relateditems',
              name: '巡检项设置',
              component: 'relateditems.vue'
            }, {
              path: '/relateditemsBiz',
              name: '巡检项设置',
              component: 'relateditemsBiz.vue'
            }, {
              path: '/addevices',
              name: '巡检对象设置',
              component: 'addevices.vue'
            }]
          }]
        }, {
          path: '/update',
          name: '模板修改',
          component: 'update.vue',
          keepAlive: true,
          children: [{
            name: '模板修改',
            base: '/update',
            routers: [{
              path: '/relateditems',
              name: '巡检项设置',
              component: 'relateditems.vue'
            }, {
              path: '/relateditemsBiz',
              name: '巡检项设置',
              component: 'relateditemsBiz.vue'
            }, {
              path: '/addevices',
              name: '巡检对象设置',
              component: 'addevices.vue'
            }]
          }]
        }]
      }, {
        name: '巡检任务管理',
        base: 'mirror/task',
        routers: [{
          path: '/list',
          name: '任务列表',
          component: 'list.vue'
        }, {
          path: '/add',
          name: '任务设置',
          component: 'add.vue',
          keepAlive: true,
          children: [{
            name: '任务设置',
            base: '/add',
            routers: [{
              path: '/editTemplate',
              name: '模板设置',
              component: 'editTemplate.vue'
            }, {
              path: '/editDevices',
              name: '巡检对象设置',
              component: 'editDevices.vue'
            }]
          }]
        }, {
          path: '/update',
          name: '任务修改',
          component: 'update.vue',
          keepAlive: true,
          children: [{
            name: '任务修改',
            base: '/update',
            routers: [{
              path: '/editTemplate',
              name: '模板设置',
              component: 'editTemplate.vue'
            }, {
              path: '/editDevices',
              name: '巡检对象设置',
              component: 'editDevices.vue'
            }]
          }]
        }]
      }, {
        name: '任务巡检检索',
        base: 'mirror/exec',
        routers: [{
          path: '/taskExec',
          name: '任务运行管理',
          component: 'taskExec.vue'
        }]
      }, {
        name: '巡检报表管理',
        base: 'mirror/report',
        routers: [{
          path: '/report',
          name: '巡检任务报告',
          component: 'report.vue'
        }, {
          path: '/reportDetails',
          name: '报告详情',
          component: 'reportDetails.vue'
        }]
      }]
    },
  ]
}

// 监控管理
const NAV_ITEM_CONFIG_BPMX = {
  name: '流程(旧)',
  // url: 'BPMX_SERVER_URL',
  url: `${sessionStorage.getItem('BPMX_SERVER_URL')}`,
  children: []
}
// 监控管理
const NAV_ITEM_CONFIG_BPMX_NEW = {
  name: '流程(新)',
  url: `${sessionStorage.getItem('X7_SERVER_URL')}/front/home`,
  children: []
}

/**
 * 默认原始导航配置。
 */
const DEFAULT_NAV_CONFIG = {
  categories: [
    // NAV_CATEGORY_CONFIG_COMMON,
    // NAV_ITEM_CONFIG_OSA,
    NAV_ITEM_WORKBENCH,
    NAV_ITEM_CONFIG_JIANKONG,
    NAV_ITEM_MONITOR,
    NAV_ITEM_CONFIG_CMDB,
    NAV_ITEM_SECURITY,
    NAV_ITEM_CONFIG_BPMX,
    NAV_ITEM_CONFIG_BPMX_NEW,
    NAV_ITEM_SYSTEM
    // NAV_CATEGORY_CONFIG_OTHER,
    // NAV_ITEM_CONFIG_SYSTEM
  ],
  homeRouters: ''
}
export default DEFAULT_NAV_CONFIG
