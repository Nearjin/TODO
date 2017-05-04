//辅助函数
var log = function() {
    console.log.apply(console, arguments)
}

var e = function(selector) {
    return document.querySelector(selector)
}

var appendHtml = function(element, html) {
	element.insertAdjacentHTML('beforeend', html)
}

//定义 toggleClass 函数
var toggleClass = function(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}

// removeClassAll() 删除所有的class
var removeClassAll = function(className) {
    var selector = '.' + className
    var elements = document.querySelectorAll(selector)
    for (var i = 0; i < elements.length; i++) {
        var e = elements[i]
        e.classList.remove(className)
    }
}



//功能函数
// ajax函数
var ajax = function(method, path, data, reseponseCallback) {
    var r = new XMLHttpRequest()
    // 设置请求方法和请求地址
    r.open(method, path, true)
    // 设置发送的数据的格式
    r.setRequestHeader('Content-Type', 'application/json')
    // 注册响应函数
    r.onreadystatechange = function() {
        if(r.readyState === 4) {
            var t = JSON.parse(r.response)
            reseponseCallback(t)
        }
    }
    // 发送请求
    r.send(data)
}

class ApiTodo {
    constructor() {
        this.baseUrl = '/todo'
    }
    get(path, callback) {
        var url = this.baseUrl + path
        ajax('GET', url, '', function(r) {
            callback(r)
        })
    }
    post(path, data, callback) {
        var url = this.baseUrl + path
        ajax('POST', url, data, function(r) {
            callback(r)
        })

    }
    all(name, callback) {
        var path = '/all/' + name
        this.get(path, callback)
    }

    add(form, callback) {
        // 发送 ajax 来创建 todo
        var path = '/add'
        var data = JSON.stringify(form)
        this.post(path, data, callback)
    }

    delete(todo_id, callback) {
        var path = '/delete/' + todo_id
        // 发送 ajax 请求来删除 todo
        this.get(path, callback)
    }

    update(form, callback) {
        // 发送 ajax
        var path = '/update'
        var data = JSON.stringify(form)
        this.post(path, data, callback)
    }

    status(form, callback) {
        // 发送 ajax
        var path = '/status'
        var data = JSON.stringify(form)
        this.post(path, data, callback)
    }
}

var apiTodo = new ApiTodo()
//定义 生成要插入的 html 的函数
var todoTemplate = function(data) {
    var id = data.id
    var task = data.task
    var status = data.status
    var describe = '未完成'
    //如果 status 为 done，则说明这条 todo 是已完成状态
    if (status) {
        //把描述改成'完成'
        describe = '完成'
    }
    var t = `
            <div class="todo_cell ${status}" data-id=${id}>
                <span class="todo_content">${task}</span>
                <span class="state">${describe}</span>
                <div class="control_buttons">
                    <button class="button_status" type="button">完成</button>
                    <button class="button_delete" type="button">删除</button>
                    <button class="button_edit" type="button">编辑</button>
                </div>
            </div>
        `
        return t
}

// 插入一个 todo
var insertTodo = function(data) {
    var container = e('.container')
    var t = todoTemplate(data)
    appendHtml(container, t)
}

// 显示所有的 todo
var insertTodos = function(todos) {
    var container = e('.container')
    for (var i = 0; i < todos.length; i++) {
        var data = todos[i]
        var t = todoTemplate(data)
        appendHtml(container, t)
    }
}

// 初始化页面
var loadTodos = function(name) {
    //得到 localStorage 中 todo
    var name = localStorage.todoName
    if (name === undefined) {
        return
    }
    var nameInput = e('.name_todo_input')
    apiTodo.all(name, function(r){
        nameInput.value = name
        insertTodos(r)
    })
}

//绑定事件
//给 add 按钮绑定事件，添加 todo 项目
var bindEventAdd = function() {
    var addButton = e('.button_addtodo')
    addButton.addEventListener('click', function() {
        var nameValue = e('.name_todo_input').value
        var inputNew = e('.new_todo_input')
        if (nameValue === '') {
            alert('请输入QQ或手机号码')
            return
        }
        var task = inputNew.value
        if (task == '') {
            return 
        }
        var form = {
            name : nameValue,
            task : task,
            status: '',
        }
        apiTodo.add(form, function (r) {
            log(r)
            localStorage.todoName = nameValue
            inputNew.value = ''
            insertTodo(r)
        })
    })
}

//给获取按钮绑定事件，添加 todo 项目
var bindEventGet = function() {
    var getButton = e('.button_gettodo')
    var container = e('.container')
    getButton.addEventListener('click', function() {
        var name = e('.name_todo_input').value
        apiTodo.all(name, function(r){
            container.innerHTML = ''
            if (r.length === 0) {
                alert('不好意思，没找到！')
            } else {
                insertTodos(r)
            }
        })
    })
}

 // 给删除按钮绑定事件
var bindEventDelete = function(){
    var container = e('.container')
    container.addEventListener('click', function(event){
        var self = event.target
        if (self.classList.contains('button_delete')) {
            var todoCell = self.closest('.todo_cell')
            var id = todoCell.dataset.id
            apiTodo.delete(id, function(r){
                todoCell.remove()
            })
        }
    })
}

// 绑定编辑按钮的事件
var bindEventEdit = function(){
    var container = e('.container')
    container.addEventListener('click', function(event){
        var self = event.target
        if (self.classList.contains('button_edit')) {
            var todoCell = self.closest('.todo_cell')
            var span = todoCell.querySelector('.todo_content')
            span.contentEditable = true
        }
    })
}

// 绑定编辑时按下 enter 的事件
var bindEventEditInput = function(){
    var container = e('.container')
    // keydown 是按键被按下的状态
    container.addEventListener('keydown', function(event){
        var self = event.target
        if (self.classList.contains('todo_content')) {
            // 判断按键是否是回车
            if (event.key == 'Enter') {
                // 按的是回车, 发送 update ajax 来更新 todo
                self.contentEditable = false
                var todoCell = self.closest('.todo_cell')
                var id = todoCell.dataset.id
                var task = self.innerHTML
                var form = {
                    id : id,
                    task : task,
                }
                apiTodo.update(form, function(todo){
                    // log('更新成功')
                })
            }
        }
    })
}

// 给完成按钮绑定事件
var bindEventStatus = function(){
    var container = e('.container')
    container.addEventListener('click', function(event){
        var self = event.target
        if (self.classList.contains('button_status')) {
            var todoCell = self.closest('.todo_cell')
            var id = todoCell.dataset.id
            var state = todoCell.querySelector('.state')
            if(todoCell.classList.contains('done')){
                var status = ''
                state.innerHTML = '未完成'
            } else{
                var status = 'done'
                state.innerHTML = '完成'
            }
            var form = {
                id : id,
                status: status,
            }
            apiTodo.status(form, function (r) {
                toggleClass(todoCell, 'done')
            })
        }
    })
}





//绑定所有事件集合
var bindAll = function() {
    bindEventAdd()
    bindEventGet()
    bindEventDelete()
    bindEventEdit()
    bindEventEditInput()
    bindEventStatus()
}




//主函数
var __main = function() {
    loadTodos()
    bindAll()
}




//程序入口
__main()
