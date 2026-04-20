import { useEffect, useState } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await api.get('/user/cart');
                setCartItems(res.data.data || []);
            } catch (e) {
                console.error("Failed to fetch cart", e);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    const handleRemove = async (productId) => {
        try {
            await api.delete(`/user/${productId}/remove`);
            setCartItems(prev => {
                const index = prev.findIndex(item => item.product._id === productId);
                if (index > -1) {
                    const newCart = [...prev];
                    newCart.splice(index, 1);
                    return newCart;
                }
                return prev;
            });
        } catch (e) {
            console.error("Failed to remove item", e);
            alert('Failed to remove item');
        }
    };

    const handleUpdateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await api.patch(`/user/${productId}/update`, { quantity: newQuantity });
            setCartItems(prev => prev.map(item => 
                item.product._id === productId 
                    ? { ...item, quantity: newQuantity }
                    : item
            ));
        } catch (e) {
            console.error("Failed to update quantity", e);
            alert('Failed to update quantity');
        }
    };



    const totalPrice = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

    if (loading) return <Layout><Spinner /></Layout>;

    return (
        <Layout>
            <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="bg-gray-100 p-6 rounded-full mb-4">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    </div>
                    <p className="text-gray-600 text-xl font-medium mb-6">Your cart is currently empty.</p>
                    <Link to="/" className="btn btn-primary px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition">Start Shopping</Link>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-grow">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <ul className="divide-y divide-gray-100">
                                {cartItems.map((cartItem, index) => {
                                    const product = cartItem.product;
                                    return (
                                        <li key={index} className="p-6 flex flex-col sm:flex-row items-center hover:bg-gray-50 transition">
                                            <img src={product.img} alt={product.name} className="w-24 h-24 object-cover rounded-lg shadow-sm mb-4 sm:mb-0 sm:mr-6" />
                                            <div className="flex-grow text-center sm:text-left">
                                                <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                                                <p className="text-sm text-gray-500">{product.desc}</p>
                                            </div>
                                            <div className="flex flex-col items-end mt-4 sm:mt-0">
                                                <div className="text-xl font-bold text-primary mb-2">${product.price}</div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(product._id, cartItem.quantity - 1)}
                                                        className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 text-gray-600"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="px-3 py-1 border border-gray-300 rounded">{cartItem.quantity}</span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(product._id, cartItem.quantity + 1)}
                                                        className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 text-gray-600"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => handleRemove(product._id)}
                                                    className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center transition"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    Remove
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    <div className="w-full lg:w-96 h-fit bg-white rounded-xl shadow-sm border border-gray-100 p-8 sticky top-24">
                        <h2 className="text-xl font-bold mb-6 text-gray-800">Order Summary</h2>
                        <div className="space-y-3 mb-8">
                            <div className="flex justify-between text-gray-600">
                                <span>Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax (0%)</span>
                                <span>$0.00</span>
                            </div>
                            <div className="border-t pt-4 flex justify-between font-bold text-xl text-gray-900">
                                <span>Total</span>
                                <span>${totalPrice}</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => navigate('/checkout')}
                            className="btn btn-primary w-full py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition transform active:scale-95">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Cart;
