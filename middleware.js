


const Product = require('./models/Product');
const { productSchema, reviewSchema } = require('./schema.js');


// Middleware for validating product
const validateProduct = (req, res, next) => {
    const { name, img, price, desc } = req.body;
    const { error } = productSchema.validate({ name, img, price, desc });
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }
    next();
};

// Middleware for validating review
const validateReview = (req, res, next) => {
    const { rating, comment } = req.body;
    const { error } = reviewSchema.validate({ rating, comment });
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }
    next();
};

// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'Please login first!' });
    }
    next();
};

// Middleware to check if user is a seller
const isSeller = (req, res, next) => {
    if (!req.user || req.user.role !== 'seller') {
        return res.status(403).json({ success: false, message: 'You do not have permission to do that' });
    }
    next();
};

// Middleware to check if user is the author of the product
const isProductAuthor = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        if (!product.author.equals(req.user._id)) {
            return res.status(403).json({ success: false, message: 'You do not have permission to do that' });
        }
        next();
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};

module.exports = { isProductAuthor, isSeller, isLoggedIn, validateReview, validateProduct };


