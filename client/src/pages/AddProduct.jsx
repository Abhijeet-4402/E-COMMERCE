import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/Layout';

const AddProduct = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        img: '',
        price: '',
        desc: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/products', formData);
            if (res.data.success) {
                navigate('/seller/dashboard');
            }
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to add product');
        }
    };

    return (
        <Layout>
// Header change is implied in the block replacement if I did full block, but let's do targeted.
            // Wait, I can't do multiple targeted across the file easily in one chunk if they are far apart.
            // Start line 35, End line 54 covers the form.

            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">List New Product</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Product Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" required />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Image URL</label>
                        <input type="text" name="img" value={formData.img} onChange={handleChange} className="input-field" required />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Price</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} className="input-field" required min="0" />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Description</label>
                        <textarea name="desc" value={formData.desc} onChange={handleChange} className="input-field h-32" required></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary w-full">List Product</button>
                </form>
            </div>

        </Layout>
    );
};

export default AddProduct;
