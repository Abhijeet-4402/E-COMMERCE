
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

import Layout from '../components/Layout';
import Spinner from '../components/Spinner';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
                // Ensure we handle both structure types just in case, but standardized is res.data.data
                setProducts(res.data.data || res.data);
            } catch (e) {
                console.error("Failed to fetch products", e);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <Layout><Spinner /></Layout>;

    return (
        <Layout>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-8 mb-10 shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold mb-2">Welcome to ShopEasy</h1>
                    <p className="text-lg opacity-90">Discover the latest trends and best deals.</p>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-white opacity-10 transform skew-x-12"></div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-primary pl-3">Latest Products</h2>

            {products.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-lg">No products available at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products.map(product => (
                        <div key={product._id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col">
                            <div className="relative h-56 overflow-hidden bg-gray-100">
                                <img src={product.img} alt={product.name} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500" />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition duration-300"></div>
                            </div>
                            <div className="p-5 flex flex-col flex-grow">
                                <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-primary transition">{product.name}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">{product.desc}</p>

                                <div className="flex justify-between items-center mt-auto">
                                    <span className="text-xl font-bold text-gray-900">${product.price}</span>
                                    <Link to={`/products/${product._id}`} className="bg-gray-100 hover:bg-primary hover:text-white text-gray-800 px-3 py-1.5 rounded-lg text-sm font-medium transition duration-200">
                                        View
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    );
};

export default ProductList;
