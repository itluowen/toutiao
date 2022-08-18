// app.js

// 导入 express 模块
const experss = require('express')
// 创建 express 的服务器实例
const app = experss()

// 2. 安装并配置网络传输压缩的中间件
//    注意：必须在托管静态资源配置此中间件
const compression = require('express-compression')
app.use(compression())

// 1. 将 dist 目录托管为静态资源服务器
app.use(experss.static('/dist'))

// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(3001, function () {
  console.log('Express server running at http://127.0.0.1:3001')
})
