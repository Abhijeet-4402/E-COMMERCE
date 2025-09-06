const express = require('express');
const Review = require('../models/Review');
const Product = require('../models/Product')

const router = express.Router()  // mini instance

// to post a review
router.post('/products/:id/review', async (req,res)=>{
    let {rating,comment} = req.body;
    let{id} = req.params;
    const foundProduct =  await Product.findById(id);
    const review = new Review({rating,comment});
    foundProduct.reviews.push(review._id);
    await review.save();
    await foundProduct.save();

    res.redirect(`/products/${id}`);
})


module.exports = router;