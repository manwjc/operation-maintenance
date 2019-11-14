/**
 * Created by moyumin on 2018/1/24.
 */
var express = require('express')
var router = express.Router()

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

router.get('/env', function (req, res) {
  let env = {}
  env.API_SERVER_URL = process.env.API_SERVER_URL
  env.PRODUCT_ADDRESS = process.env.PRODUCT_ADDRESS
  env.BIZ_LOG_URL = process.env.BIZ_LOG_URL
  env.REALM = process.env.REALM
  env.AUTH_SERVER_URL = process.env.AUTH_SERVER_URL
  env.BPMX_SERVER_URL = process.env.BPMX_SERVER_URL
  env.OPERATE_SERVER_URL = process.env.OPERATE_SERVER_URL
  env.X7_SERVER_URL = process.env.X7_SERVER_URL
  env.GRAFANA_SERVER_URL = process.env.GRAFANA_SERVER_URL
  env.SSL_REQUIRED = process.env.SSL_REQUIRED
  env.RESOURCE = process.env.RESOURCE
  env.PUBLIC_CLIENT = process.env.PUBLIC_CLIENT
  env.HYSTRIX_DASHBOARD = process.env.HYSTRIX_DASHBOARD
  env.REDIS_STAT = process.env.REDIS_STAT
  env.KAFKA_MANAGER = process.env.KAFKA_MANAGER
  env.ZIPKIN = process.env.ZIPKIN
  env.EUREKA = process.env.EUREKA
  res.json(env)
})
module.exports = router
