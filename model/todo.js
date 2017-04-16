const fs = require('fs')

const todoFilePath = 'data/todo.json'

// 这是一个用来存储 todo 数据的对象
const ModelTodo = function(form) {
    this.name = form.name || ''
    this.task = form.task || ''
    this.status = form.status || ''
    // 生成一个 unix 时间
    this.created_time = Math.floor(new Date() / 1000)
}

const loadTodos = function() {
    var content = fs.readFileSync(todoFilePath, 'utf8')
    var todos = JSON.parse(content)
    return todos
}

// 用 t 的 data 属性获取全部 todos 的数据
const t = {
    data: loadTodos()
}

// 获取全部符合条件的 todo 内容
t.all = function(name) {
    var todos = this.data
    var l = []
    for (var i = 0; i < todos.length; i++){
        var todo = todos[i]
        if (todo.name == name){
            l.push(todo)
        }
    }
    return l
}

// 添加一个 todo 内容
t.add = function(form) {
    var m = new ModelTodo(form)
    // 设置新数据的 id
    var d = this.data[this.data.length-1]
    if (d == undefined) {
        m.id = 1
    } else {
        m.id = d.id + 1
    }
    // 把 数据 加入 this.data 数组
    this.data.push(m)
    // 把 最新数据 保存到文件中
    this.save()
    // 返回新建的数据
    return m
}

// 更新一个 todo 内容
t.update = function(form) {
    var todos = this.data
    for (var i = 0; i < todos.length; i++){
        var todo = todos[i]
        if (todo.id == form.id){
            todo.task = form.task
            this.save()
            return todo
        }
    }
    return null
}

// 更新一个 todo 的状态
t.status = function(form) {
    var todos = this.data
    for (var i = 0; i < todos.length; i++){
        var todo = todos[i]
        if (todo.id == form.id){
            todo.status = form.status
            this.save()
            return todo
        }
    }
    return null
}

// 删除一个 todo 内容
t.delete = function(id) {
    var todos = this.data
    var found = false
    for (var i = 0; i < todos.length; i++) {
        var todo = todos[i]
        if (todo.id == id) {
            found = true
            todos.splice(i, 1)
            break
        }
    }
    // 返回删除的结果
    return found
}

// 保存 todo 的数据
t.save = function() {
    var s = JSON.stringify(this.data, null, 2)
    fs.writeFile(todoFilePath, s, (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log('保存成功')
        }
    })
}

module.exports = t
