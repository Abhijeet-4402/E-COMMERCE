const express = require('express');
const router = express.Router();
const { isLoggedIn, isSeller, validateOrder } = require('../middleware');
const orderController = require('../controllers/order');

// Create a new order (buyer)
router.post('/orders', isLoggedIn, validateOrder, orderController.createOrder);

// Get single order
router.get('/orders/:orderId', isLoggedIn, orderController.getOrder);

// Get buyer's orders
router.get('/user/orders', isLoggedIn, orderController.buyerOrders);

// Get seller's orders (orders containing seller's products)
router.get('/seller/orders', isLoggedIn, isSeller, orderController.sellerOrders);

// Update order status (seller)
router.patch('/orders/:orderId/status', isLoggedIn, isSeller, orderController.updateOrderStatus);

module.exports = router;
