const Product = require('../models/Product');
const Review = require('../models/Review');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const createReview = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const product = await Product.findById(id);
    if (!product) {
        throw new AppError('Product not found', 404);
    }

    // Prevent author from reviewing their own product
    if (product.author && product.author.equals(req.user._id)) {
        throw new AppError('You cannot review your own product', 400);
    }

    const review = new Review({ rating, comment, author: req.user._id });
    product.reviews.push(review);
    await review.save();
    await product.save();
    res.status(201).json({
        success: true,
        message: 'Review added successfully',
        data: review
    });
});

module.exports = {
    createReview
};
