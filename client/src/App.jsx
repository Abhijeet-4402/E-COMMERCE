


import { Routes, Route } from 'react-router-dom';
import ProductList from './pages/ProductList';
import Login from './pages/Login';
import Register from './pages/Register';
import SellerDashboard from './pages/SellerDashboard';
import AddProduct from './pages/AddProduct';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import EditProduct from './pages/EditProduct';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderHistory from './pages/OrderHistory';
import SellerOrders from './pages/SellerOrders';
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

                <Route path="/checkout" element={
                    <ProtectedRoute>
                        <Checkout />
                    </ProtectedRoute>
                } />

                <Route path="/order-confirmation/:orderId" element={
                    <ProtectedRoute>
                        <OrderConfirmation />
                    </ProtectedRoute>
                } />

                <Route path="/order-history" element={
                    <ProtectedRoute>
                        <OrderHistory />
                    </ProtectedRoute>
                } />

                <Route path="/orders" element={
                    <ProtectedRoute>
                        <OrderHistory />
                    </ProtectedRoute>
                } />

                {/* Seller Routes */}
                <Route path="/seller/dashboard" element={
                    <ProtectedRoute role="seller">
                        <SellerDashboard />
                    </ProtectedRoute>
                } />

                <Route path="/seller/orders" element={
                    <ProtectedRoute role="seller">
                        <SellerOrders />
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



