const Koa = require('koa');
const Router = require('koa-router');
const serialize = require('serialize-javascript');

const { Todo } = require('../models/todos');
const mongoose = require('mongoose');

const router = new Router({
    prefix: '/api/v1'
});

router.get('/todos', async (ctx, next) => {
    const todos = await Todo.find();
    ctx.body = serialize({
        msg: 'GET todos',
        todos
    });
});

router.get('/todos/:todoId', async (ctx, next) => {
    const { todoId } = ctx.params;

    try {
        const todo = await Todo.findById(todoId);

        if (todo) {
            ctx.body = serialize(todo);
        } else {
            ctx.status = 404;
            ctx.body = serialize({
                message: 'No Todo found for provided ID'
            });
        }
    } catch (err) {
        ctx.body = `Some error happend... ${err}`;
    }
});

router.patch('/todos/:todoId', async (ctx, next) => {
    const { todoId } = ctx.params;

    try {
        const res = await Todo.findByIdAndUpdate(
            {
            _id: todoId
            },
            {
                $set: ctx.request.body
            }
        );

        ctx.body = res;
    } catch (err) {
        ctx.body = err._message;
    }

    ctx.body = `PATCH todo ${todoId}`;
});

router.del('/todos/:todoId', async (ctx, next) => {
    const { todoId } = ctx.params;

    try {
        const res = await Todo.findByIdAndDelete({
            _id: todoId
        });

        ctx.body = res;
    } catch (err) {
        ctx.body = err._message;
    }
});

router.post('/todos', async (ctx, next) => {
    const todo = new Todo({
        _id: new mongoose.Types.ObjectId(),
        name: ctx.request.body.name,
        text: ctx.request.body.text
    });

    try {
        const res = await todo.save();
        ctx.body = {
            msg: 'successful POST todo',
            createdTodo: res
        };
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = {
            message: err._message
        };
    }
});

module.exports.router = router;
