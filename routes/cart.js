
const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const cartController = require('../controllers/cart');

router.get('/user/cart', isLoggedIn, cartController.getUserCart);
router.post('/user/:productId/add', isLoggedIn, cartController.addToCart);
router.delete('/user/:productId/remove', isLoggedIn, cartController.removeFromCart);


module.exports = router;
