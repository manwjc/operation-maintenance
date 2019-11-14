'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  PORT: 8080,
  API_SERVER_URL: 'http://10.12.70.39:5566', // 测试
  // API_SERVER_URL: 'http://10.5.3.95:9114', // 本地
  PRODUCT_ADDRESS: 'http://10.181.12.146:2122',
  BIZ_LOG_URL: 'http://10.181.12.121:30056',
  REALM: 'demo_realm',
  CMDB_SERVER_URL: 'http://10.12.70.39:2222',
  // CMDB_SERVER_URL: 'http://localhost:2222',
  FTP_SERVER_URL: 'http://10.12.12.139:59090',
  // AUTH_SERVER_URL: 'http://10.12.70.38:8180/auth',
  AUTH_SERVER_URL: 'https://10.12.70.40:28180/auth',
  // AUTH_SERVER_URL: 'http://10.1.5.104:8180/auth',
  // AUTH_SERVER_URL: 'http://10.1.5.104:8080/auth',
  BPMX_SERVER_URL: 'http://10.12.8.194:8085/front/home',
  X7_SERVER_URL: 'http://10.12.8.194:8085',
  GRAFANA_SERVER_URL: 'http://10.12.70.41:3000',
  DEVELOP_HELP_SERVER_URL: 'http://10.12.9.232:4044',
  RESOURCE_SERVER_URL: 'http://localhost:2223',
  SSL_REQUIRED: 'external',
  RESOURCE: 'prod_vue',
  PUBLIC_CLIENT: true,
  OPERATE_SERVER_URL: 'http://117.132.183.206:8075',

  // ��Դ���Ӹ澯���ӣ��������
  ALERT_INFO_SERVER_URL: 'http://10.12.70.39:28130'
})

