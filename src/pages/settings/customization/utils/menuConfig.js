// 定制页菜单配置(目前是静态配置)
export default {
  // 综合首页
  'home': [{
      name: '工单', // tab菜单名称
      thumb: [{
        url: require('../components/img/home4.png'), // 缩略图地址
        name: '新增工单', // 缩略图名称
        componentName: 'TodayNewOrder' // 可拖拽的组件名称（暂时与组件文件名称一致）
      }, {
        url: require('../components/img/home2.png'),
        name: '工单分布',
        componentName: 'orderDistribution'
      }, {
        url: require('../components/img/home3.png'),
        name: '工单趋势',
        componentName: 'orderTrend'
      }, {
        url: require('../components/img/home1.png'),
        name: '工单统计',
        componentName: 'orderStatistics'
      }]
    },
    {
      name: '告警',
      thumb: [{
        url: require('../components/img/home5.png'),
        name: '告警状态',
        componentName: 'ToBeConfirmedAlert'
      }]
    },
    {
      name: '设备',
      thumb: [{
        url: require('../components/img/home6.png'),
        name: '设备告警',
        componentName: 'deviceAlert'
      }, {
        url: require('../components/img/home7.png'),
        name: '设备利用率',
        componentName: 'deviceUseRate'
      }]
    }

  ],
  // 监控
  'monitor': {
    name: '监控', // tab菜单名称
    thumb: [{
      url: require('../components/img/monitor1.png'), // 缩略图地址
      name: '资源池资源利用率分布', // 缩略图名称
      componentName: 'monitor-chart-pool' // 可拖拽的组件名称（暂时与组件文件名称一致）
    }, {
      url: require('../components/img/monitor2.png'),
      name: '租户资源利用率分布',
      componentName: 'monitor-chart-user'
    }, {
      url: require('../components/img/monitor3.png'),
      name: '资源利用率趋势',
      componentName: 'monitor-chart-trend'
    }, {
      url: require('../components/img/monitor4.png'),
      name: '租户月度资源利用率最低Top5',
      componentName: 'monitor-chart-top5'
    }, {
      url: require('../components/img/monitor5.png'),
      name: '资源池网络宽带资源',
      componentName: 'monitor-chart-network'
    }]
  },
  // 告警
  'alert': {
    name: '告警',
    thumb: [{
      url: require('../components/img/alert1.png'),
      name: '待解决告警',
      componentName: 'alert-order-wait'
    }, {
      url: require('../components/img/alert2.png'),
      name: '已解决告警',
      componentName: 'alert-order-finish'
    }, {
      url: require('../components/img/alert3.png'),
      name: '告警级别',
      componentName: 'alert-chart-level'
    }, {
      url: require('../components/img/alert4.png'),
      name: '设备分类',
      componentName: 'alert-chart-class'
    }, {
      url: require('../components/img/alert5.png'),
      name: '新增告警趋势',
      componentName: 'alert-chart-trend'
    }, {
      url: require('../components/img/alert6.png'),
      name: '告警设备相关Top10',
      componentName: 'alert-chart-device'
    }, {
      url: require('../components/img/alert7.png'),
      name: '告警内容告警数量Top10',
      componentName: 'alert-chart-number'
    }]
  },
  // 流程
  'flow': {
    name: '流程',
    thumb: []
  },
  // 资源
  'resource': {
    name: '资源',
    thumb: [{
      url: require('../components/img/resource1.png'),
      name: '资源池',
      componentName: 'resource-order-pool'
    }, {
      url: require('../components/img/resource2.png'),
      name: '设备量',
      componentName: 'resource-order-device'
    }, {
      url: require('../components/img/resource3.png'),
      name: '资源池设备量分布',
      componentName: 'resource-chart-device'
    }, {
      url: require('../components/img/resource3.png'),
      name: '资源池设备分类分布',
      componentName: 'resource-chart-device-two'
    }, {
      url: require('../components/img/resource3.png'),
      name: '工期分布',
      componentName: 'resource-chart-device-three'
    }, {
      url: require('../components/img/resource4.png'),
      name: '资源池租户分布',
      componentName: 'resource-chart-user'
    }, {
      url: require('../components/img/resource4.png'),
      name: '二级租户业务系统分布',
      componentName: 'resource-chart-user-two'
    }, {
      url: require('../components/img/resource5.png'),
      name: '新增设备量趋势分布',
      componentName: 'resource-chart-device-add'
    }, {
      url: require('../components/img/resource6.png'),
      name: '租户设备分类分布TOP5',
      componentName: 'resource-chart-user-top5'
    }, {
      url: require('../components/img/resource7.png'),
      name: '新增设备量趋势分布TOP5',
      componentName: 'resource-chart-device-top5'
    }, {
      url: require('../components/img/resource8.png'),
      name: '设备子类型分布',
      componentName: 'resource-chart-device-sub'
    }]
  },
  // 安全
  'safety': {
    name: '安全',
    thumb: []
  }

}
