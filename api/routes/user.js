const Router = require('koa-router');
const serialize = require('serialize-javascript');
const bodyParser = require('koa-body');
const {
    createUser,
    getUsers
} = require('../models/user');


const router = new Router({
    prefix: '/api/v1'
});

router.get('/users', async (ctx, _next) => {
    const users = await getUsers();

    ctx.type = 'application/json';
    ctx.body = serialize(users, { space: 4 });
});

router.post('/signup', bodyParser(), async (ctx, _next) => {
    const { email, password } = ctx.request.body;

    const user = createUser(email, password);

    try {
        const res = await user.save();
        ctx.body = res;
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = err.message;
    }
});

module.exports.userRouter = router;
