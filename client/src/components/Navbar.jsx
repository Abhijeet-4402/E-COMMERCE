import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow px-6 py-4 sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-primary tracking-tight">ShopEasy</Link>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-gray-600 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link to="/" className="text-gray-600 hover:text-primary transition font-medium">Products</Link>
                    {user && (
                        <Link to="/cart" className="text-gray-600 hover:text-primary transition relative font-medium">
                            Cart
                            {user.cart && user.cart.length > 0 && (
                                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{user.cart.length}</span>
                            )}
                        </Link>
                    )}

                    {user ? (
                        <div className="flex items-center space-x-4">
                            {user.role === 'seller' && (
                                <Link to="/seller/dashboard" className="text-gray-600 hover:text-primary transition font-medium">Dashboard</Link>
                            )}
                            <span className="font-semibold text-gray-700">{user.username}</span>
                            <button onClick={handleLogout} className="text-red-500 hover:text-red-700 font-medium text-sm border border-red-500 px-3 py-1 rounded hover:bg-red-50 transition">Logout</button>
                        </div>
                    ) : (
                        <div className="space-x-4">
                            <Link to="/login" className="text-gray-600 hover:text-primary transition font-medium">Login</Link>
                            <Link to="/register" className="bg-primary text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition shadow-md font-medium">Register</Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden mt-4 space-y-2 pb-4 border-t pt-4">
                    <Link to="/" className="block text-gray-600 hover:text-primary py-2" onClick={() => setIsOpen(false)}>Products</Link>
                    {user && (
                        <Link to="/cart" className="block text-gray-600 hover:text-primary py-2" onClick={() => setIsOpen(false)}>
                            Cart ({user.cart?.length || 0})
                        </Link>
                    )}
                    {user ? (
                        <>
                            {user.role === 'seller' && (
                                <Link to="/seller/dashboard" className="block text-gray-600 hover:text-primary py-2" onClick={() => setIsOpen(false)}>Dashboard</Link>
                            )}
                            <div className="py-2 text-gray-700 font-medium">Hi, {user.username}</div>
                            <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left text-red-500 py-2">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="block text-gray-600 hover:text-primary py-2" onClick={() => setIsOpen(false)}>Login</Link>
                            <Link to="/register" className="block text-primary font-medium py-2" onClick={() => setIsOpen(false)}>Register</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
