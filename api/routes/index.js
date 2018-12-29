const Router = require('koa-router');

const rootRouter = new Router();

rootRouter.get('/', (ctx, next) => {
    ctx.body = {
        message: 'Success'
    };
});

module.exports.rootRouter = rootRouter;
