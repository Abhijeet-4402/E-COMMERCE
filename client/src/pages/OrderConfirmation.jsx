import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await api.get(`/orders/${orderId}`);
                setOrder(response.data.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch order details');
                setLoading(false);
            }
        };

        fetchOrder();

        // Auto-refresh order status every 1 minute
        const interval = setInterval(fetchOrder, 60000);

        return () => clearInterval(interval);
    }, [orderId]);

    if (loading) return <Spinner />;
    if (error) return <Alert type="danger" message={error} />;
    if (!order) return <Alert type="warning" message="Order not found" />;

    const estimatedDelivery = new Date(order.createdAt);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">✓</div>
                    <h1 className="text-4xl font-bold text-green-600">Order Confirmed!</h1>
                    <p className="text-gray-600 mt-2">Thank you for your purchase</p>
                </div>

                {/* Order ID */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded">
                    <p className="text-gray-600 text-sm">Order ID</p>
                    <p className="text-2xl font-bold text-blue-600">{order._id}</p>
                </div>

                {/* Order Status */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-6">Order Status</h2>
                    <div className="flex items-center justify-between mb-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                                ✓
                            </div>
                            <p className="font-semibold text-green-600">Order Placed</p>
                            <p className="text-xs text-gray-500">Today</p>
                        </div>
                        <div className={`flex-1 h-1 mx-4 ${['shipped', 'delivered'].includes(order.orderStatus) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className="text-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${['shipped', 'delivered'].includes(order.orderStatus) ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                                📦
                            </div>
                            <p className={`font-semibold ${['shipped', 'delivered'].includes(order.orderStatus) ? 'text-green-600' : 'text-gray-600'}`}>In Transit</p>
                            <p className="text-xs text-gray-500">~5 days</p>
                        </div>
                        <div className={`flex-1 h-1 mx-4 ${order.orderStatus === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className="text-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${order.orderStatus === 'delivered' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                                🚚
                            </div>
                            <p className={`font-semibold ${order.orderStatus === 'delivered' ? 'text-green-600' : 'text-gray-600'}`}>Delivered</p>
                            <p className="text-xs text-gray-500">Est: {estimatedDelivery.toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                        <p className="text-sm text-gray-700">
                            <strong>Current Status:</strong> <span className="text-blue-600 capitalize font-semibold">{order.orderStatus}</span>
                        </p>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>
                    <div className="bg-gray-50 p-4 rounded">
                        <p className="text-gray-700 whitespace-pre-wrap">{order.shippingAddress}</p>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-6">Order Items</h2>
                    <div className="space-y-4">
                        {order.items && order.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0">
                                <div className="flex-1">
                                    <p className="font-semibold text-lg">
                                        {item.product?.name || 'Product'}
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        Quantity: <span className="font-semibold">{item.quantity}</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-600 text-sm">Price:</p>
                                    <p className="font-bold text-lg">₹{item.priceAtPurchase}</p>
                                </div>
                                <div className="text-right ml-8 min-w-[100px]">
                                    <p className="text-gray-600 text-sm">Total:</p>
                                    <p className="font-bold text-lg">₹{(item.priceAtPurchase * item.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Total */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                    <div className="flex justify-between items-center text-xl mb-4 pb-4 border-b">
                        <span className="font-semibold">Subtotal:</span>
                        <span>₹{order.totalPrice?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xl mb-4 pb-4 border-b">
                        <span className="font-semibold">Shipping:</span>
                        <span className="text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between items-center text-2xl font-bold">
                        <span>Total Amount:</span>
                        <span className="text-blue-600">₹{order.totalPrice?.toFixed(2)}</span>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-lg font-semibold text-blue-900">💳 Cash on Delivery</p>
                        <p className="text-gray-700 mt-2">Please pay ₹{order.totalPrice?.toFixed(2)} when you receive the order</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => navigate('/order-history')}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
                    >
                        View All Orders
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="flex-1 px-6 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
