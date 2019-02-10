const Router = require('koa-router');
const bodyParser = require('koa-body');
const UserController = require('../../controllers/UserController');
const { checkAuth } = require('../../middleware/check-auth');


const router = new Router({
    prefix: '/api/v1'
});

router.get('/users', UserController.getAllUsers);

router.post('/signup', bodyParser(), UserController.signupUser);

router.post('/login', bodyParser(), UserController.loginUser);

router.del('/users/:userId', checkAuth, UserController.removeUser);

module.exports.userRouter = router;
