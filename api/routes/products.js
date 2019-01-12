const Router = require('koa-router');
const serialize = require('serialize-javascript');
const bodyParser = require('koa-body');
const {
    getProducts,
    patchProduct,
    deleteProduct,
    getProductById,
    createProduct
} = require('../models/products');


const router = new Router({
    prefix: '/api/v1'
});

router.post('/upload', bodyParser({
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

router.get('/products', async (ctx, _next) => {
    const products = await getProducts();
    const res = {
        items: products,
        amount: products.length
    };

    ctx.body = serialize(res, { space: 4 });
});

router.get('/products/:productId', async (ctx, _next) => {
    const { productId } = ctx.params;

    try {
        const product = await getProductById(productId);

        if (product) {
            ctx.body = serialize(product, { space: 4 });
        } else {
            ctx.status = 404;
            ctx.body = serialize({
                message: 'No Product found for provided ID'
            });
        }
    } catch (err) {
        ctx.body = `Some error happend... ${err}`;
    }
});

router.patch('/products/:productId', async (ctx, _next) => {
    const { productId } = ctx.params;

    try {
        const res = await patchProduct(productId, ctx.request.body);

        ctx.body = res;
    } catch (err) {
        ctx.body = err._message;
    }
});

router.del('/products/:productId', async (ctx, _next) => {
    const { productId } = ctx.params;

    try {
        const res = await deleteProduct(productId);

        ctx.body = res;
    } catch (err) {
        ctx.body = err._message;
    }
});

router.post('/products', bodyParser({
    formidable: {
        uploadDir: 'uploads/',
        keepExtensions: true
    },
    multipart: false,
    strict: false,
    urlencoded: true
}), async (ctx, _next) => {
    const { name, description } = ctx.request.body;
    const product = createProduct(
        name,
        description,
        ctx.request.files && ctx.request.files.todoImage.path
    );

    try {
        const res = await product.save();
        ctx.body = res;
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = err.message;
    }
});

module.exports.router = router;
