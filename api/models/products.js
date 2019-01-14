const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    name: {
        type: String,
        required: [true, 'Product name is required']
    },
    description: {
        type: String,
        required: [true, 'Product description is required']
    },
    productImage: {
        type: String,
        default: ''
    }
});

const Product = mongoose.model('Products', productSchema, 'products');

const getProducts = () => Product.find().select('_id name description productImage');

const patchProduct = (id, data) => Product.findByIdAndUpdate(
    {
        _id: id
    },
    {
        $set: data
    }
).select('_id name description productImage');

const deleteProduct = id => Product.findByIdAndDelete(
    {
        _id: id
    }
);

const getProductById = id => Product.findById(id).select('_id name description productImage');

const createProduct = (name, description, imagePath) => new Product({
    name,
    description,
    path: imagePath
});

module.exports.getProducts = getProducts;
module.exports.patchProduct = patchProduct;
module.exports.deleteProduct = deleteProduct;
module.exports.getProductById = getProductById;
module.exports.createProduct = createProduct;
