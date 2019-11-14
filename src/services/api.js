/** 接口文档 **/
import http from 'assets/js/utility/rb-http.factory'
let api = {};

//查询资源池
api.queryPool = (params = {}) => {
  return http.sendRequest({
    method: 'GET',
    url: `/v1/cmdb/configDict/getDictsByType`,
    params: params
  }).then((data) => {
    return data;
  });
};
//查询业务系统
api.queryBizSys = (params = {}) => {
  let subElement = function (item) {
    let element = {
      id: item.name,
      label: item.name,
      children: []
    }
    if (item.subList && item.subList.length > 0) {
      item.subList.forEach(subItem => {
        element.children.push(subElement(subItem))
      })
    } else {
      element.children = null
    }
    return element
  }
  return http.sendRequest({
    method: 'GET',
    url: '/v1/cmdb/orgManager/loadTreeDepBiz?namespace=alauda',
    // params: params
  }).then((data) => {
    let biz_tree = []
    let root = {
      id: '',
      label: '所有',
      children: []
    }
    data.forEach(item => {
      root.children.push(subElement(item))
    })
    biz_tree.push(root)
    return biz_tree
  });
};

//创建首页模块
api.addModuleInfo = (params = {}) => {
  return http.sendRequest({
    method: 'POST',
    url: `/v1/moduleInfo/insert`,
    params: params
  }).then((data) => {
    return data;
  });
};

//查询首页模块
api.queryModuleInfo = (params = {}) => {
  return http.sendRequest({
    method: 'GET',
    url: `/v1/moduleInfo/getModuleInfoByCode`,
    params: params
  }).then((data) => {
    return data;
  });
};

//查询待解决告警和已解决告警
api.queryAlertStatus = (params = {}) => {
  return http.sendRequest({
    method: 'GET',
    url: `/v1/alerts/indexPage/summary`,
    params: params
  }).then((data) => {
    return data;
  });
};
//查询告警级别分布
api.queryAlertLevel = (params = {}) => {
  return http.sendRequest({
    method: 'GET',
    url: `/v1/alerts/indexPage/level-span`,
    params: params
  }).then((data) => {
    return data;
  });
};
//查询设备分类
api.queryDeviceClass = (params = {}) => {
  return http.sendRequest({
    method: 'GET',
    url: `/v1/alerts/indexPage/classify-span`,
    params: params
  }).then((data) => {
    return data;
  });
};

//查询告警趋势
api.queryAlertTrend = (params = {}) => {
  return http.sendRequest({
    method: 'GET',
    url: `/v1/alerts/indexPage/trend`,
    params: params
  }).then((data) => {
    return data;
  });
};

//告警设备相关top10
api.queryAlertDevice = (params = {}) => {
  return http.sendRequest({
    method: 'GET',
    url: `/v1/alerts/indexPage/alertDeviceTop10`,
    params: params
  }).then((data) => {
    return data;
  });
};

//告警内容相关top10
api.queryAlertContent = (params = {}) => {
  return http.sendRequest({
    method: 'GET',
    url: `/v1/alerts/indexPage/alertContentTop10`,
    params: params
  }).then((data) => {
    return data;
  });
};

//资源池-资源利用率分布
api.queryPoolRate = (params = {}) => {
  return http.sendRequest({
    method: 'POST',
    url: `/v1/alerts/indexPage/idcTypeDeviceUsedRate`,
    params: params
  }).then((data) => {
    return data;
  });
};

//租户资源利用率分布
api.queryUserRate = (params = {}) => {
  return http.sendRequest({
    method: 'POST',
    url: `/v1/alerts/indexPage/bizSystemDeviceUsedRate`,
    params: params
  }).then((data) => {
    return data;
  });
};

//资源利用率趋势图
api.queryPoolTrend = (params = {}) => {
  return http.sendRequest({
    method: 'POST',
    url: `/v1/alerts/indexPage/deviceUsedRateTrends`,
    params: params
  }).then((data) => {
    return data;
  });
};

//租户-top5最低的排序
api.queryUserTop5 = (params = {}) => {
  return http.sendRequest({
    method: 'POST',
    url: `/v1/alerts/indexPage/bizSystemDeviceUsedRateLow`,
    params: params
  }).then((data) => {
    return data;
  });
};


export {
  api
};
