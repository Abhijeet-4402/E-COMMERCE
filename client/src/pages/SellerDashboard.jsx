import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const SellerDashboard = () => {
    const [products, setProducts] = useState([]);
    const { user, loading: authLoading } = useAuth();


    useEffect(() => {
        const fetchMyProducts = async () => {
            try {
                const res = await api.get('/products');
                if (res.data.success) {
                    const myProducts = res.data.data.filter(p => p.author === user._id || (p.author && p.author._id === user._id) || p.author === user.id);
                    setProducts(myProducts);
                }
            } catch (e) {
                console.error(e);
            }
        };
        if (user) fetchMyProducts();
    }, [user]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to unlist this product?")) return;
        try {
            await api.delete(`/products/${id}`);
            setProducts(products.filter(p => p._id !== id));
        } catch (e) {
            alert('Failed to unlist product');
        }
    };


    if (authLoading) return <div>Loading...</div>;

    return (
        <Layout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Seller Dashboard</h1>
                <Link to="/product/new" className="btn btn-primary">+ List New Product</Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 object-cover rounded" src={product.img} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">${product.price}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">

                                    <Link to={`/products/${product._id}/edit`} className="text-indigo-600 hover:text-indigo-900 border border-indigo-200 px-3 py-1 rounded transition hover:bg-indigo-50">Edit</Link>
                                    <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900 border border-red-200 px-3 py-1 rounded transition hover:bg-red-50">Unlist</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
                {products.length === 0 && <p className="p-6 text-center text-gray-500">You haven't added any products yet.</p>}
            </div>
        </Layout>
    );
};


export default SellerDashboard;
