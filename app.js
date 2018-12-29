const Koa = require('koa');
const morgan = require('koa-morgan');
const serialize = require('serialize-javascript');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

const { router } = require('./api/routes/todos');
const { rootRouter } = require('./api/routes');

const app = new Koa();

app.use(morgan('dev'));
app.use(bodyParser());
app.use(cors());

app.use(rootRouter.routes());
app.use(router.routes());

app.use(async (ctx, next) => {
    if (parseInt(ctx.status) === 404) {
        ctx.status = 404;
        ctx.body = {
            error: {
                message: 'Not found'
            }
        };
    }
});

module.exports.app = app;
