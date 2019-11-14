/**
 * Created by moyumin on 2018/1/23.
 */
const opn = require('opn')
const path = require('path')
const webpack = require('webpack')
const proxyMiddleware = require('http-proxy-middleware')
const webpackConfig = require('../build/webpack.dev.conf')
const express = require('express')

const compiler = webpack(webpackConfig)

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})
const config = require('../config')
// 是否自动打开浏览器
const autoOpenBrowser = !!config.dev.autoOpenBrowsern
// if (!process.env.NODE_ENV) {
process.env.NODE_ENV = process.argv[2]
// }

const app = express()
// handle fallback for HTML5 history API
// 一定要放在app.use(devMiddleware)前面
app.use(require('connect-history-api-fallback')())

if (process.env.NODE_ENV === 'development') {
  app.use(hotMiddleware)
  // serve webpack bundle outputS
  app.use(devMiddleware)
  process.env.BIZ_LOG_URL = config.dev.env.BIZ_LOG_URL
  process.env.PORT = config.dev.env.PORT
  process.env.API_SERVER_URL = config.dev.env.API_SERVER_URL
  process.env.CMDB_SERVER_URL = config.dev.env.CMDB_SERVER_URL
  process.env.BPMX_SERVER_URL = config.dev.env.BPMX_SERVER_URL
  process.env.OPERATE_SERVER_URL = config.dev.env.OPERATE_SERVER_URL
  process.env.X7_SERVER_URL = config.dev.env.X7_SERVER_URL
  process.env.GRAFANA_SERVER_URL = config.dev.env.GRAFANA_SERVER_URL
  process.env.FTP_SERVER_URL = config.dev.env.FTP_SERVER_URL
  process.env.DEVELOP_HELP_SERVER_URL = config.dev.env.DEVELOP_HELP_SERVER_URL
  process.env.PRODUCT_ADDRESS = config.dev.env.PRODUCT_ADDRESS
  process.env.REALM = config.dev.env.REALM
  process.env.AUTH_SERVER_URL = config.dev.env.AUTH_SERVER_URL
  process.env.SSL_REQUIRED = config.dev.env.SSL_REQUIRED
  process.env.RESOURCE = config.dev.env.RESOURCE
  process.env.PUBLIC_CLIENT = config.dev.env.PUBLIC_CLIENT
  process.env.HYSTRIX_DASHBOARD = config.dev.env.HYSTRIX_DASHBOARD
  process.env.REDIS_STAT = config.dev.env.REDIS_STAT
  process.env.KAFKA_MANAGER = config.dev.env.KAFKA_MANAGER
  process.env.ZIPKIN = config.dev.env.ZIPKIN
  process.env.EUREKA = config.dev.env.EUREKA
  process.env.RESOURCE_SERVER_URL = config.dev.env.RESOURCE_SERVER_URL

  // 提供纯静态资产
  const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
  app.use(staticPath, express.static('./static'))
} else {
  // 提供纯静态资产
  app.use('/', express.static(path.join(__dirname, '../dist')))
}
// 监听端口
console.log('process.env.PORT :' + process.env.PORT)
console.log('config.dev.port:' + config.dev.port)
const port = process.env.PORT || config.dev.port


// api代理地址
const API_SERVER_URL = process.env.API_SERVER_URL
const RESOURCE_SERVER_URL = process.env.RESOURCE_SERVER_URL
const CMDB_SERVER_URL = process.env.CMDB_SERVER_URL
const FTP_SERVER_URL = process.env.FTP_SERVER_URL
const DEVELOP_HELP_SERVER_URL = process.env.DEVELOP_HELP_SERVER_URL
// 配置代理
const proxyTable = {
  '/v1': {
    target: API_SERVER_URL,
    changeOrigin: true,
    timeout: 600000,
    proxyTimeout: 600000,
    pathRewrite: {
      '^/v1': '/v1'
    }
  },
  '/v2': {
    target: API_SERVER_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/v2': '/v2'
    }
  },
  '/zuul': {
    target: API_SERVER_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/zuul': '/zuul'
    }
  },
  '/cmdb/static': {
    target: CMDB_SERVER_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/cmdb/static': '/cmdb/static'
    },
  },
  // '/cmdb/repertryInstance/getExcelData': {
  //   target: CMDB_SERVER_URL,
  //   changeOrigin: true,
  //   pathRewrite: {
  //     '^/cmdb/repertryInstance/getExcelData': '/cmdb/repertryInstance/getExcelData'
  //   }
  // },
  // '/cmdb/repertryInstance/exportExcel': {
  //   target: CMDB_SERVER_URL,
  //   changeOrigin: true,
  //   pathRewrite: {
  //     '^/cmdb/repertryInstance/exportExcel': '/cmdb/repertryInstance/exportExcel'
  //   }
  // },
  // '/cmdb/repertryInstance/updateByBatch': {
  //   target: CMDB_SERVER_URL,
  //   changeOrigin: true,
  //   pathRewrite: {
  //     '^/cmdb/repertryInstance/updateByBatch': '/cmdb/repertryInstance/updateByBatch'
  //   }
  // },
  // '/cmdb/form/getForms': {
  //   target: CMDB_SERVER_URL,
  //   changeOrigin: true,
  //   pathRewrite: {
  //     '^/cmdb/form/getForms': '/cmdb/form/getForms'
  //   }
  // },
  '/cmdb': {
    target: CMDB_SERVER_URL,
    changeOrigin: true,
    timeout: 600000,
    proxyTimeout: 600000,
    pathRewrite: {
      '^/cmdb': '/cmdb'
    }
  },
  '/download': {
    target: FTP_SERVER_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/download': '/download'
    }
  },
  '/resource': {
    target: RESOURCE_SERVER_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/resource': '/resource'
    }
  },
  '/develophelp': {
    target: DEVELOP_HELP_SERVER_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/develophelp': '/develophelp'
    }
  }
}
Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = {
      target: options
    }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// 注册api接口
var api = require('./routes/api')
app.use('/api', api)

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({
//   extended: false
// }))

var _resolve
var _reject
var readyPromise = new Promise((resolve, reject) => {
  _resolve = resolve
  _reject = reject
})

var server
var portfinder = require('portfinder')
portfinder.basePort = port

// 获取本机IP地址
function getIPAdress() {
  var interfaces = require('os').networkInterfaces()
  for (var devName in interfaces) {
    var iface = interfaces[devName]
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i]
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address
      }
    }
  }
}

if (process.env.NODE_ENV === 'development') {
  console.log('> Starting dev server...')
  devMiddleware.waitUntilValid(() => {
    // portfinder.getPort((err, port) => {
    //   if (err) {
    //     _reject(err)
    //   }
    //   var uri = 'http://localhost:' + port
    //   console.log('> Listening at ' + uri + '\n')
    //   // when env is testing, don't need open it
    //   if (autoOpenBrowser) {
    //     opn(uri)
    //   }
    //   server = app.listen(port)
    //   _resolve()
    // })
    var uri = 'http://localhost:' + port
    console.log('> Listening at ' + uri + '\n')
    // when env is testing, don't need open it
    if (autoOpenBrowser) {
      opn(uri)
    }
    _resolve()
  })
} else {
  console.log('> Starting prod server...')
  var uri = getIPAdress() + ':' + port
  console.log('> Listening at ' + uri + '\n')
  server = app.listen(port)
  _resolve()
  // portfinder.getPort((err, port) => {
  //   if (err) {
  //     _reject(err)
  //   }
  //   // process.env.PORT = port
  //   var uri = getIPAdress() + ':' + port
  //   console.log('> Listening at ' + uri + '\n')
  //   server = app.listen(port)
  //   _resolve()
  // })
}

var server = app.listen(port)
module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
