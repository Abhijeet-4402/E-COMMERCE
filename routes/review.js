const express = require('express');
const Review = require('../models/Review');
const Product = require('../models/Product');
const { validateReview } = require('../middleware');

const router = express.Router()  // mini instance

// to post a review
router.post('/products/:id/review', validateReview, async (req, res) => {
    try {
        let { rating, comment } = req.body;
        let { id } = req.params;
        const foundProduct = await Product.findById(id);
        const review = new Review({ rating, comment });
        foundProduct.reviews.push(review._id);
        await review.save();
        await foundProduct.save();
        req.flash('success', 'Review Added Successfully');        // used flash here
        res.redirect(`/products/${id}`);
    }
    catch (e) {
        res.status(500).render('error', { err: e.message })
    }
})


module.exports = router;