const User = require('../models/User');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const register = catchAsync(async (req, res, next) => {
    const { email, username, password, role } = req.body;
    if (!['buyer', 'seller'].includes(role)) {
        throw new AppError('Invalid role. Must be buyer or seller.', 400);
    }
    const user = new User({ email, username, role });
    const newUser = await User.register(user, password);

    req.login(newUser, function (err) {
        if (err) {
            return next(err);
        }
        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: newUser
        });
    });
});

const login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            // Manually creating standard error for auth failure
            return res.status(401).json({
                success: false,
                message: info.message || 'Authentication failed'
            });
        }
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.status(200).json({
                success: true,
                message: 'Login successful',
                data: user
            });
        });
    })(req, res, next);
};

const logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(new AppError('Logout failed', 500));
        }
        res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    });
};



const currentUser = catchAsync(async (req, res) => {
    if (req.isAuthenticated()) {
        const user = await User.findById(req.user._id);

        // Fetch all products that are currently in the cart to check if they still exist
        const Product = require('../models/Product');
        const cartProductIds = user.cart.map(item => item.product);
        const validProducts = await Product.find({ _id: { $in: cartProductIds } });
        const validProductIds = validProducts.map(p => p._id.toString());

        // If any products were deleted, remove them from cart
        if (validProducts.length !== user.cart.length) {
            user.cart = user.cart.filter(item => validProductIds.includes(item.product.toString()));
            await user.save();
        }

        // Populate cart products before sending response
        await user.populate('cart.product');

        res.status(200).json({
            success: true,
            data: user
        });
    } else {
        res.status(200).json({
            success: true,
            data: null
        });
    }
});



module.exports = {
    register,
    login,
    logout,
    currentUser
};
