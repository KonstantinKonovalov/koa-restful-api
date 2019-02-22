const jwt = require('jsonwebtoken');
const serialize = require('serialize-javascript');

// eslint-disable-next-line consistent-return
module.exports.checkAuth = async (ctx, next) => {
    const token = ctx.cookies.get('token');

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        ctx.userData = decoded;
        await next();
    } catch (err) {
        ctx.status = 401;
        ctx.type = 'application/json';
        ctx.body = serialize({
            message: 'Auth failed'
        });
    }
};
