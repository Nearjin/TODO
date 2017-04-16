const todo = require('../model/todo')

var all = {
    path: '/todo/all/:name',
    method: 'get',
    func: function(request, response) {
        var name = request.params.name
        var t = todo.all(name)
        var r = JSON.stringify(t)
        response.send(r)
    }
}

var add = {
    path: '/todo/add',
    method: 'post',
    func: function(request, response) {
        var form = request.body
        var t = todo.add(form)
        var r = JSON.stringify(t)
        response.send(r)
    }
}

var update = {
    path: '/todo/update',
    method: 'post',
    func: function(request, response) {
        var form = request.body
        var t = todo.update(form)
        var r = JSON.stringify(t)
        response.send(r)
    }
}

var status = {
    path: '/todo/status',
    method: 'post',
    func: function(request, response) {
        var form = request.body
        var t = todo.status(form)
        var r = JSON.stringify(t)
        response.send(r)
    }
}

var deleteTodo = {
    path: '/todo/delete/:id',
    method: 'get',
    func: function(request, response) {
        var id = request.params.id
        var success = todo.delete(id)
        var result = {
            success: success,
        }
        var r = JSON.stringify(result)
        response.send(r)
    }
}

var routes = [
    all,
    add,
    update,
    status,
    deleteTodo,
]

module.exports.routes = routes
