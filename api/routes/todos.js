const Koa = require('koa');
const Router = require('koa-router');
const serialize = require('serialize-javascript');

const router = new Router({
    prefix: '/api/v1'
});

router.get('/todos', (ctx, next) => {
    ctx.body = serialize({
        msg: 'GET todos'
    });
});

router.get('/todos/:todoId', (ctx, next) => {
    const { todoId } = ctx.params;

    ctx.body = todoId;
});

router.patch('/todos/:todoId', (ctx, next) => {
    const { todoId } = ctx.params;

    ctx.body = `PATCH todo ${todoId}`;
});

router.del('/todos/:todoId', (ctx, next) => {
    const { todoId } = ctx.params;

    ctx.body = `DELETE todo ${todoId}`;
});

router.post('/todos', (ctx, next) => {
    const todo = {
        name: ctx.request.body.name
    };

    ctx.body = {
        msg: 'POST todos',
        createdTodo: todo
    };
});

module.exports.router = router;
