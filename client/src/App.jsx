


import { Routes, Route } from 'react-router-dom';
import ProductList from './pages/ProductList';
import Login from './pages/Login';
import Register from './pages/Register';
import SellerDashboard from './pages/SellerDashboard';
import AddProduct from './pages/AddProduct';

import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import EditProduct from './pages/EditProduct';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<ProductList />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route path="/cart" element={
                    <ProtectedRoute>
                        <Cart />
                    </ProtectedRoute>
                } />

                {/* Seller Routes */}
                <Route path="/seller/dashboard" element={
                    <ProtectedRoute role="seller">
                        <SellerDashboard />
                    </ProtectedRoute>
                } />

                <Route path="/product/new" element={
                    <ProtectedRoute role="seller">
                        <AddProduct />
                    </ProtectedRoute>
                } />
                <Route path="/products/:id/edit" element={
                    <ProtectedRoute role="seller">
                        <EditProduct />
                    </ProtectedRoute>
                } />
                <Route path="/products/:id" element={<ProductDetail />} />
            </Routes>

        </>
    )
}

export default App



