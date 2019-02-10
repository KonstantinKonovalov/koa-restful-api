const serialize = require('serialize-javascript');
const {
    createProduct,
    getProducts,
    getProductById,
    deleteProduct,
    patchProduct
} = require('../api/models/products');

const addProduct = async (ctx, _next) => {
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
};

const getAllProducts = async (ctx, _next) => {
    const products = await getProducts();
    const res = {
        items: products,
        amount: products.length
    };

    ctx.type = 'application/json';
    ctx.body = serialize(res, { space: 4 });
};

const getProduct = async (ctx, _next) => {
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
};

const removeProduct = async (ctx, _next) => {
    const { productId } = ctx.params;

    try {
        const res = await deleteProduct(productId);

        ctx.body = res;
    } catch (err) {
        ctx.body = err._message;
    }
};

const editProduct = async (ctx, _next) => {
    const { productId } = ctx.params;

    try {
        const res = await patchProduct(productId, ctx.request.body);

        ctx.body = res;
    } catch (err) {
        ctx.body = err._message;
    }
};

module.exports = {
    addProduct,
    getAllProducts,
    getProduct,
    removeProduct,
    editProduct
};
