
const express = require('express');
const router = express.Router();
const { validateProduct, isLoggedIn, isSeller, isProductAuthor } = require('../middleware');
const productController = require('../controllers/product');

// Get all products
router.get('/products', productController.getAllProducts);

// Create a new product
router.post('/products', isLoggedIn, isSeller, validateProduct, productController.createProduct);

// Get a single product
router.get('/products/:id', productController.getProduct);

// Update a product
router.patch('/products/:id', isLoggedIn, isProductAuthor, validateProduct, productController.updateProduct);

// Delete a product
router.delete('/products/:id', isLoggedIn, isProductAuthor, productController.deleteProduct);

module.exports = router;


