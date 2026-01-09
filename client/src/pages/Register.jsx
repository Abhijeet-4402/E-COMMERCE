import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const Register = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('buyer');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(email, username, password, role);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <Layout>
            <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-lg shadow">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Create Account</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Username</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="input-field" required />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" required />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Role</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)} className="input-field">
                            <option value="buyer">Buyer</option>
                            <option value="seller">Seller</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-secondary w-full text-lg">
                        Register
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default Register;
