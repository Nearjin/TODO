// 引入需要的模块
const express = require('express')
const bodyParse = require('body-parser')
const fs = require('fs')

const app = express()

// 把前端发过来的内容用 json.parse 解析
app.use(bodyParse.json())
// 配置静态文件目录
app.use(express.static('static'))

// 注册路由函数
const registerRoutes = function(app, routes) {
    for (var i = 0; i < routes.length; i++) {
        var route = routes[i]
        // 下面这段是重点
        app[route.method](route.path, route.func)
    }
}

// 导入 route/index.js 的所有路由数据
const routeIndex = require('./route/index')
registerRoutes(app, routeIndex.routes)

// 导入 route/todo.js 的所有路由数据
const routeBlog = require('./route/todo')
registerRoutes(app, routeBlog.routes)

// 监听端口
const server = app.listen(8000, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})
