
const express = require('express');
const router = express.Router();
const { validateReview, isLoggedIn } = require('../middleware');
const reviewController = require('../controllers/review');

router.post('/products/:id/review', isLoggedIn, validateReview, reviewController.createReview);

module.exports = router;
