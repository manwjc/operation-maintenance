/**
 * Created by moyumin on 2018/1/20.
 */
'use strict'
require('./check-versions')()

const proxyMiddleware = require('http-proxy-middleware')
const opn = require('opn')
const path = require('path')
const express = require('express')


// 监听端口
const port = process.env.PORT

// 配置代理
const proxyTable = {
      '/v1': {
                target: process.env.API_SERVER_URL,
                changeOrigin: true,
                pathRewrite: {
                    '^/v1': '/v1'
                }
            },
      '/v2': {
                target: process.env.API_SERVER_URL,
                changeOrigin: true,
                pathRewrite: {
                    '^/v2': '/v2'
                }
            }
    }

const app = express()

Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())


// 提供纯静态资产
// const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use('/',express.static(path.join(__dirname, '../dist')));
// app.use('/', express.static('../dist/static'))

app.get('/express', function (req, res) {
  res.json({a:'a',b:'b'})
})

var _resolve
var _reject
var readyPromise = new Promise((resolve, reject) => {
  _resolve = resolve
  _reject = reject
})

var server
var portfinder = require('portfinder')
portfinder.basePort = port

console.log('> Starting prod server...')
// 获取本机IP地址
function getIPAdress () {
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
portfinder.getPort((err, port) => {
  if (err) {
    _reject(err)
  }
  // process.env.PORT = port
  var uri = getIPAdress() + ':' + port
  console.log('> Listening at ' + uri + '\n')
  server = app.listen(port)
  _resolve()
})


module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
