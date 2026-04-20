const User = require('../models/User');
const Product = require('../models/Product');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');


const getUserCart = catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id).populate('cart.product');

    // Check if any cart items have null products (deleted products)
    const validCart = user.cart.filter(item => item.product !== null);

    // If cart changed, save it
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
    const { quantity = 1 } = req.body;
    const userId = req.user._id;
    const product = await Product.findById(productId);

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    const user = await User.findById(userId);
    
    // Check if product already exists in cart
    const existingItem = user.cart.find(item => item.product.toString() === productId);
    
    if (existingItem) {
        // Increment quantity if already in cart
        existingItem.quantity += quantity;
    } else {
        // Add new item if not in cart
        user.cart.push({ product: productId, quantity });
    }
    
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

    // Find and remove entire cart item by product ID
    const itemIndex = user.cart.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
        user.cart.splice(itemIndex, 1);
        await user.save();
    }

    res.status(200).json({
        success: true,
        message: 'Product removed from cart successfully'
    });
});

const updateCartQuantity = catchAsync(async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id;

    if (!quantity || quantity < 1) {
        throw new AppError('Quantity must be at least 1', 400);
    }

    const user = await User.findById(userId);
    const cartItem = user.cart.find(item => item.product.toString() === productId);

    if (!cartItem) {
        throw new AppError('Product not found in cart', 404);
    }

    cartItem.quantity = quantity;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Cart quantity updated successfully',
        data: cartItem
    });
});

module.exports = {
    getUserCart,
    addToCart,
    removeFromCart,
    updateCartQuantity
};

