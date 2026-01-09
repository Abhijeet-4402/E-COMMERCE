const Product = require('../models/Product');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const getAllProducts = catchAsync(async (req, res) => {
    const products = await Product.find({});
    res.status(200).json({
        success: true,
        data: products
    });
});

const createProduct = catchAsync(async (req, res) => {
    const { name, img, price, desc } = req.body;
    const newProduct = await Product.create({ name, img, price, desc, author: req.user._id });
    res.status(201).json({
        success: true,
        message: 'Product added successfully',
        data: newProduct
    });
});

const getProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate('reviews');
    if (!product) {
        throw new AppError('Product not found', 404);
    }
    res.status(200).json({
        success: true,
        data: product
    });
});

const updateProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { name, img, price, desc } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(id, { name, img, price, desc }, { new: true });
    if (!updatedProduct) {
        throw new AppError('Product not found', 404);
    }
    res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct
    });
});

const deleteProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
        throw new AppError('Product not found', 404);
    }
    res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
    });
});

module.exports = {
    getAllProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct
};
