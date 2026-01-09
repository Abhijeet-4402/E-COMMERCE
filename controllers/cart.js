const User = require('../models/User');
const Product = require('../models/Product');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');


const getUserCart = catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id).populate('cart');

    const validCart = user.cart.filter(item => item !== null);

    if (validCart.length < user.cart.length) {
        user.cart = validCart;
        await user.save();
    }

    res.status(200).json({
        success: true,
        data: validCart
    });
});


const addToCart = catchAsync(async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;
    const product = await Product.findById(productId);

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    const user = await User.findById(userId);
    user.cart.push(product._id);
    await user.save();
    res.status(200).json({
        success: true,
        message: 'Product added to cart successfully'
    });
});



const removeFromCart = catchAsync(async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);

    // Find index of the first occurrence of the product
    // We convert ObjectId to string for comparison
    const itemIndex = user.cart.findIndex(item => item.toString() === productId);

    if (itemIndex > -1) {
        user.cart.splice(itemIndex, 1);
        await user.save();
    }

    res.status(200).json({
        success: true,
        message: 'Product removed from cart successfully'
    });
});


module.exports = {
    getUserCart,
    addToCart,
    removeFromCart
};

