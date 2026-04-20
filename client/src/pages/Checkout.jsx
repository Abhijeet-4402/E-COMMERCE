import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

const Checkout = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        shippingAddress: ''
    });
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Fetch cart items on component mount
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await api.get('/user/cart');
                setCartItems(res.data.data || []);
                setLoading(false);
            } catch (err) {
                setError('Failed to load cart items');
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (!formData.shippingAddress.trim()) {
                throw new Error('Shipping address is required');
            }

            const response = await api.post('/orders', {
                shippingAddress: formData.shippingAddress.trim()
            });

            setSuccess(true);
            
            // Redirect to order confirmation
            setTimeout(() => {
                navigate(`/order-confirmation/${response.data.data.orderId}`);
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to place order');
            setLoading(false);
        }
    };

    // Calculate total price from cart items
    const totalPrice = cartItems.reduce((acc, item) => acc + (item.product?.price * item.quantity), 0);

    if (loading) return <Spinner />;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Checkout</h1>

                {error && <Alert type="danger" message={error} />}
                {success && <Alert type="success" message="Order placed successfully!" />}

                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8">
                    {/* Shipping Information */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold mb-6">Shipping Address</h2>
                        
                        <div className="mb-4">
                            <label htmlFor="shippingAddress" className="block text-gray-700 font-bold mb-2">
                                Full Address *
                            </label>
                            <textarea
                                id="shippingAddress"
                                name="shippingAddress"
                                value={formData.shippingAddress}
                                onChange={handleChange}
                                placeholder="Enter your complete shipping address (Street, City, State, Postal Code)"
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold mb-6">Payment Method</h2>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-lg font-semibold text-blue-900">💳 Cash on Delivery</p>
                            <p className="text-gray-700 mt-2">Pay when you receive your order</p>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="mb-8 bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                        <div className="flex justify-between items-center text-lg">
                            <span className="font-semibold">Subtotal:</span>
                            <span className="text-gray-700">₹{totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg mt-2 pt-2 border-t border-gray-200">
                            <span className="font-bold text-xl">Total:</span>
                            <span className="font-bold text-xl text-blue-600">₹{totalPrice.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/cart')}
                            className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 font-bold rounded-lg hover:bg-gray-400 transition"
                        >
                            Back to Cart
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                        >
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
