const Router = require('koa-router');
const serialize = require('serialize-javascript');
const bodyParser = require('koa-body');
const crypto = require('crypto');
const {
    createUser,
    getUsers,
    deleteUser
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

    const salt = crypto.randomBytes(16).toString('hex');
    const hashPswd = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

    const user = createUser(email, hashPswd);

    try {
        const res = await user.save();
        ctx.body = res;
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = err.message;
    }
});

router.del('/users/:userId', async (ctx, _next) => {
    const { userId } = ctx.params;

    try {
        const res = await deleteUser(userId);

        ctx.body = res;
    } catch (err) {
        ctx.body = err._message;
    }
});

module.exports.userRouter = router;
