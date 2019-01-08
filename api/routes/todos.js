const Router = require('koa-router');
const serialize = require('serialize-javascript');
const bodyParser = require('koa-body');
const { Todo } = require('../models/todos');


const router = new Router({
    prefix: '/api/v1'
});

router.post('/upload', bodyParser({
    formidable: {
        uploadDir: 'uploads/',
        keepExtensions: true
    },
    multipart: true,
    strict: false,
    urlencoded: true
}), async (ctx, _next) => {
    ctx.body = serialize(ctx.request.files.uploadedImage);
});

router.get('/todos', async (ctx, _next) => {
    const todos = await Todo.find()
        .select('_id name text todoImage isDone');
    const res = {
        items: todos,
        amount: todos.length
    };

    ctx.body = serialize(res, { space: 4 });
});

router.get('/todos/:todoId', async (ctx, _next) => {
    const { todoId } = ctx.params;

    try {
        const todo = await Todo.findById(todoId)
            .select('_id name text todoImage isDone');

        if (todo) {
            ctx.body = serialize(todo, { space: 4 });
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

router.patch('/todos/:todoId', async (ctx, _next) => {
    const { todoId } = ctx.params;

    try {
        const res = await Todo.findByIdAndUpdate(
            {
                _id: todoId
            },
            {
                $set: ctx.request.body
            }
        ).select('_id name text todoImage isDone');

        ctx.body = res;
    } catch (err) {
        ctx.body = err._message;
    }
});

router.del('/todos/:todoId', async (ctx, _next) => {
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

router.post('/todos', bodyParser({
    formidable: {
        uploadDir: 'uploads/',
        keepExtensions: true
    },
    multipart: true,
    strict: false,
    urlencoded: true
}), async (ctx, _next) => {
    const todo = new Todo({
        name: ctx.request.body.name,
        text: ctx.request.body.text,
        todoImage: ctx.request.files.todoImage.path
    });

    try {
        const res = await todo.save();
        ctx.body = res;
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = err.message;
    }
});

module.exports.router = router;
