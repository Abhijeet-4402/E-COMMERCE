


import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [msg, setMsg] = useState({ type: '', text: '' });

    const fetchProduct = async () => {
        try {
            const res = await api.get(`/products/${id}`);
            setProduct(res.data.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!user) return navigate('/login');
        try {
            await api.post(`/user/${id}/add`); // Backend route: router.post('/user/:productId/add', ...);
            setMsg({ type: 'success', text: 'Added to cart!' });
        } catch (e) {
            setMsg({ type: 'error', text: 'Failed to add to cart' });
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/products/${id}/review`, { rating, comment });
            setMsg({ type: 'success', text: 'Review submitted!' });
            setComment('');
            fetchProduct(); // Refresh reviews
        } catch (e) {
            setMsg({ type: 'error', text: e.response?.data?.message || 'Failed to submit review' });
        }
    };

    const handleBuyNow = async () => {
        if (!user) return navigate('/login');
        try {
            await api.post(`/user/${id}/add`);
            navigate('/cart');
        } catch (e) {
            setMsg({ type: 'error', text: 'Failed to process request' });
        }
    };

    if (loading) return <Layout><Spinner /></Layout>;
    if (!product) return <Layout><div className="text-center mt-10">Product not found.</div></Layout>;

    return (
        <Layout>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row mb-10">
                <div className="md:w-1/2 p-4">
                    <img src={product.img} alt={product.name} className="w-full h-96 object-cover rounded-lg" />
                </div>
                <div className="md:w-1/2 p-8 flex flex-col justify-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                    <p className="text-gray-600 mb-6 text-lg">{product.desc}</p>
                    <div className="flex items-center mb-6">
                        <span className="text-4xl font-bold text-primary">${product.price}</span>
                    </div>
                    {msg.text && <Alert type={msg.type === 'error' ? 'error' : 'success'} message={msg.text} />}
                    <div className="flex space-x-4">
                        <button onClick={handleBuyNow} className="btn bg-green-600 hover:bg-green-700 text-white flex-1 py-3 text-lg transition shadow-md">Buy Now</button>
                        <button onClick={handleAddToCart} className="btn btn-primary flex-1 py-3 text-lg shadow-md">Add to Cart</button>
                    </div>
                    <Link to="/" className="mt-6 text-center text-gray-500 hover:text-gray-700 block">Back to Products</Link>
                </div>
            </div>


            {/* Reviews Section */}
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 border-b pb-2">Reviews</h2>

                {/* Review List */}
                <div className="space-y-4 mb-10">
                    {product.reviews && product.reviews.length > 0 ? (
                        product.reviews.map(review => (
                            <div key={review._id} className="bg-white p-4 rounded shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                                            <span className="text-sm font-bold text-gray-600">U</span>
                                        </div>
                                        <span className="font-semibold text-yellow-500">{'★'.repeat(review.rating)}<span className="text-gray-300">{'★'.repeat(5 - review.rating)}</span></span>
                                    </div>
                                    <span className="text-gray-400 text-sm">Verified Buyer</span>
                                </div>
                                <p className="text-gray-700">{review.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
                    )}
                </div>

                {/* Add Review Form */}
                {user ? (
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-bold mb-4">Leave a Review</h3>
                        <form onSubmit={handleSubmitReview}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Rating</label>
                                <div className="flex space-x-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className={`text-2xl focus:outline-none ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Comment</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="input-field"
                                    rows="3"
                                    required
                                    placeholder="Share your thoughts..."
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-secondary">Submit Review</button>
                        </form>
                    </div>
                ) : (
                    <div className="text-center p-6 bg-gray-50 rounded">
                        <Link to="/login" className="text-primary hover:underline font-semibold">Login</Link> to leave a review.
                    </div>
                )}
            </div>
        </Layout>
    );
};


export default ProductDetail;
