import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/Layout';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', img: '', price: '', desc: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                const p = res.data.data;
                setFormData({ name: p.name, img: p.img, price: p.price, desc: p.desc });
            } catch (e) {
                setError('Failed to fetch product details.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`/products/${id}`, formData);
            navigate('/seller/dashboard');
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to update product');
        }
    };

    if (loading) return <Layout><Spinner /></Layout>;

    return (
        <Layout>
            <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow">
                <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
                {error && <Alert message={error} />}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Product Name</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input-field" required />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Image URL</label>
                        <input type="text" value={formData.img} onChange={e => setFormData({ ...formData, img: e.target.value })} className="input-field" required />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Price</label>
                        <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="input-field" required />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Description</label>
                        <textarea value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} className="input-field" rows="4" required></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary w-full">Update Product</button>
                </form>
            </div>
        </Layout>
    );
};

export default EditProduct;
