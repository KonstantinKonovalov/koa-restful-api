const Router = require('koa-router');
const serialize = require('serialize-javascript');
const bodyParser = require('koa-body');
const { checkAuth } = require('../../middleware/check-auth');
const ProductsController = require('../../controllers/ProductsController');

const router = new Router({
    prefix: '/api/v1'
});

router.post('/upload', checkAuth, bodyParser({
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

router.get('/products', ProductsController.getAllProducts);

router.get('/products/:productId', ProductsController.getProduct);

router.patch('/products/:productId', checkAuth, ProductsController.editProduct);

router.del('/products/:productId', checkAuth, ProductsController.removeProduct);

router.post('/products', checkAuth, bodyParser({
    formidable: {
        uploadDir: 'uploads/',
        keepExtensions: true
    },
    multipart: false,
    strict: false,
    urlencoded: true
}), ProductsController.addProduct);

module.exports.productsRouter = router;
