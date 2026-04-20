const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Create an order from user's cart
const createOrder = catchAsync(async (req, res) => {
    const { shippingAddress } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!shippingAddress) {
        throw new AppError('Shipping address is required', 400);
    }

    // Fetch user with populated cart
    const user = await User.findById(userId).populate('cart.product');

    // Check if cart is empty
    if (!user.cart || user.cart.length === 0) {
        throw new AppError('Cart is empty', 400);
    }

    // Validate all cart items exist and build order items
    const orderItems = [];
    let totalPrice = 0;

    for (const cartItem of user.cart) {
        if (!cartItem.product) {
            throw new AppError('One or more products in cart no longer exist', 400);
        }

        const orderItem = {
            product: cartItem.product._id,
            quantity: cartItem.quantity,
            priceAtPurchase: cartItem.product.price
        };

        orderItems.push(orderItem);
        totalPrice += cartItem.product.price * cartItem.quantity;
    }

    // Create order document (cash-on-delivery only)
    const order = new Order({
        buyer: userId,
        items: orderItems,
        totalPrice,
        shippingAddress,
        paymentMethod: 'cash-on-delivery',
        isPaid: false  // Will be marked as paid after delivery
    });

    // Save order
    await order.save();

    // Clear user's cart
    user.cart = [];
    await user.save();

    res.status(201).json({
        success: true,
        message: 'Order created successfully. Pay on delivery',
        data: {
            orderId: order._id,
            totalPrice: order.totalPrice,
            orderStatus: order.orderStatus,
            paymentMethod: order.paymentMethod,
            shippingAddress: order.shippingAddress
        }
    });
});

// Get single order by ID
const getOrder = catchAsync(async (req, res, next) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
        .populate('buyer', 'username email')
        .populate('items.product', 'name img price');

    if (!order) {
        throw new AppError('Order not found', 404);
    }

    // Verify user is either buyer or seller of a product in order
    const isBuyer = order.buyer._id.toString() === req.user._id.toString();
    if (!isBuyer) {
        // Check if user is seller of any product in order
        const userProducts = await Product.find({ author: req.user._id });
        const userProductIds = userProducts.map(p => p._id.toString());
        const isSeller = order.items.some(item => 
            userProductIds.includes(item.product._id.toString())
        );

        if (!isSeller) {
            throw new AppError('Unauthorized to view this order', 403);
        }
    }

    res.status(200).json({
        success: true,
        data: order
    });
});

// Get buyer's orders
const buyerOrders = catchAsync(async (req, res) => {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ buyer: userId })
        .populate('items.product', 'name img price')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

    const total = await Order.countDocuments({ buyer: userId });

    res.status(200).json({
        success: true,
        data: orders,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalOrders: total
        }
    });
});

// Get seller's orders (orders containing seller's products)
const sellerOrders = catchAsync(async (req, res) => {
    const sellerId = req.user._id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Find all products by seller
    const sellerProducts = await Product.find({ author: sellerId });
    const productIds = sellerProducts.map(p => p._id);

    // Find orders containing these products
    const orders = await Order.find({ 'items.product': { $in: productIds } })
        .populate('buyer', 'username email')
        .populate('items.product', 'name img price author')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

    const total = await Order.countDocuments({ 'items.product': { $in: productIds } });

    // Filter items to show only seller's products
    const filteredOrders = orders.map(order => {
        const filteredItems = order.items.filter(item => 
            productIds.some(id => id.toString() === item.product._id.toString())
        );
        return {
            ...order.toObject(),
            items: filteredItems
        };
    });

    res.status(200).json({
        success: true,
        data: filteredOrders,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalOrders: total
        }
    });
});

// Update order status (seller only)
const updateOrderStatus = catchAsync(async (req, res) => {
    const { orderId } = req.params;
    const { orderStatus } = req.body;
    const sellerId = req.user._id;

    // Validate orderStatus
    if (!['pending', 'shipped', 'delivered', 'cancelled'].includes(orderStatus)) {
        throw new AppError('Invalid order status', 400);
    }

    const order = await Order.findById(orderId).populate('items.product');

    if (!order) {
        throw new AppError('Order not found', 404);
    }

    // Verify seller owns at least one product in order
    const sellerProductIds = await Product.find({ author: sellerId }).distinct('_id');
    const isSellerOfOrder = order.items.some(item => 
        sellerProductIds.some(id => id.toString() === item.product._id.toString())
    );

    if (!isSellerOfOrder) {
        throw new AppError('Unauthorized to update this order', 403);
    }

    order.orderStatus = orderStatus;
    order.updatedAt = Date.now();
    await order.save();

    res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        data: order
    });
});

module.exports = {
    createOrder,
    getOrder,
    buyerOrders,
    sellerOrders,
    updateOrderStatus
};
