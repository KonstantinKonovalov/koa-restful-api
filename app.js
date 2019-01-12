const Koa = require('koa');
const morgan = require('koa-morgan');
const cors = require('@koa/cors');

const mongoose = require('mongoose');

const { router } = require('./api/routes/products');
const { rootRouter } = require('./api/routes');

const app = new Koa();

mongoose.connect(`mongodb+srv://konstantin_konovalov:${process.env.DB_PASS}@mongodbcluster-vasux.mongodb.net/test?retryWrites=true`, {
    useNewUrlParser: true,
    dbName: 'TodosDB'
});

app.use(morgan('dev'));
app.use(cors());

app.use(rootRouter.routes());
app.use(router.routes());

app.use(async (ctx, _next) => {
    if (parseInt(ctx.status, 10) === 404) {
        ctx.status = 404;
        ctx.body = {
            error: {
                message: 'Not found'
            }
        };
    }
});

module.exports.app = app;
