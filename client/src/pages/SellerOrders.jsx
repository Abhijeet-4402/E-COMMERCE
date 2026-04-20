import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [updatingOrder, setUpdatingOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/seller/orders?page=${page}&limit=10`);
                setOrders(response.data.data);
                setTotalPages(response.data.pagination?.totalPages || 1);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [page]);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            setUpdatingOrder(orderId);
            await api.patch(`/orders/${orderId}/status`, { orderStatus: newStatus });
            
            // Update local state
            setOrders(orders.map(order => 
                order._id === orderId 
                    ? { ...order, orderStatus: newStatus }
                    : order
            ));
            setUpdatingOrder(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update order status');
            setUpdatingOrder(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getNextStatus = (currentStatus) => {
        const statusFlow = ['pending', 'shipped', 'delivered'];
        const currentIndex = statusFlow.indexOf(currentStatus);
        return currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : null;
    };

    if (loading && orders.length === 0) return <Spinner />;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Order Management</h1>

            {error && <Alert type="danger" message={error} />}

            {orders.length === 0 ? (
                <div className="bg-white shadow-md rounded-lg p-12 text-center">
                    <p className="text-gray-600 text-xl">No orders yet</p>
                </div>
            ) : (
                <>
                    {/* Orders Table */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-bold">Order ID</th>
                                        <th className="px-6 py-4 text-left font-bold">Buyer</th>
                                        <th className="px-6 py-4 text-left font-bold">Product</th>
                                        <th className="px-6 py-4 text-center font-bold">Qty</th>
                                        <th className="px-6 py-4 text-right font-bold">Total</th>
                                        <th className="px-6 py-4 text-left font-bold">Current Status</th>
                                        <th className="px-6 py-4 text-center font-bold">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id} className="border-b hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 font-mono text-sm text-blue-600">
                                                {order._id.substring(0, 8)}...
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-semibold">{order.buyer?.username || 'Unknown'}</p>
                                                    <p className="text-sm text-gray-600">{order.buyer?.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {order.items && order.items.map((item, idx) => (
                                                    <p key={idx} className="text-sm">
                                                        {item.product?.name || 'Product'}
                                                    </p>
                                                ))}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {order.items && order.items.reduce((sum, item) => sum + item.quantity, 0)}
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold">
                                                ₹{order.totalPrice?.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(order.orderStatus)}`}>
                                                    {order.orderStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {getNextStatus(order.orderStatus) && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(order._id, getNextStatus(order.orderStatus))}
                                                        disabled={updatingOrder === order._id}
                                                        className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded hover:bg-green-700 transition disabled:bg-gray-400"
                                                    >
                                                        {updatingOrder === order._id ? 'Updating...' : `Mark as ${getNextStatus(order.orderStatus)}`}
                                                    </button>
                                                )}
                                                {!getNextStatus(order.orderStatus) && (
                                                    <span className="text-gray-600 text-sm">Completed</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2">
                            <button
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 bg-gray-300 text-gray-800 font-bold rounded disabled:opacity-50 hover:bg-gray-400 transition"
                            >
                                Previous
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setPage(i + 1)}
                                    className={`px-4 py-2 font-bold rounded transition ${
                                        page === i + 1
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage(Math.min(totalPages, page + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 bg-gray-300 text-gray-800 font-bold rounded disabled:opacity-50 hover:bg-gray-400 transition"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SellerOrders;
