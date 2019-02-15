const serialize = require('serialize-javascript');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {
    createUser,
    getUsers,
    deleteUser,
    findUserByEmail
} = require('../api/models/user');

const getAllUsers = async (ctx, _next) => {
    const users = await getUsers();

    ctx.type = 'application/json';
    ctx.body = serialize(users, { space: 4 });
};

const signupUser = async (ctx, _next) => {
    const { email, password } = ctx.request.body;

    const salt = crypto.randomBytes(16).toString('hex');
    const iterations = 1000;
    const hash = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex');

    const user = createUser(email, { salt, hash, iterations });

    try {
        const res = await user.save();
        ctx.body = res;
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = err.message;
    }
};

// eslint-disable-next-line
const loginUser = async (ctx, next) => {
    const { email, password } = ctx.request.body;

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            ctx.status = 401;
            ctx.type = 'application/json';
            ctx.body = serialize({
                message: 'Auth failed'
            });
            return next();
        }

        const { salt, iterations, hash } = user.password;

        const attemptedHash = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex');

        if (hash === attemptedHash) {
            const token = jwt.sign({
                email: user.email,
                userId: user._id
            },
            process.env.JWT_KEY,
            {
                expiresIn: '1h'
            });

            ctx.status = 200;
            ctx.cookies.set(
                'token',
                token, 
                {
                    httpOnly: false
                }
            );

            ctx.token = token;

            ctx.type = 'application/json';
            ctx.body = serialize({
                message: 'Auth successfull',
                token
            });
        } else {
            ctx.status = 401;
            ctx.type = 'application/json';
            ctx.body = serialize({
                message: 'Auth failed'
            });
        }
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = err.message;
    }
};

const removeUser = async (ctx, _next) => {
    const { userId } = ctx.params;

    try {
        const res = await deleteUser(userId);

        ctx.body = res;
    } catch (err) {
        ctx.body = err._message;
    }
};

module.exports = {
    getAllUsers,
    signupUser,
    loginUser,
    removeUser
};
