import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

const OrderHistory = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/user/orders?page=${page}&limit=10`);
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

    if (loading && orders.length === 0) return <Spinner />;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">My Orders</h1>

            {error && <Alert type="danger" message={error} />}

            {orders.length === 0 ? (
                <div className="bg-white shadow-md rounded-lg p-12 text-center">
                    <p className="text-gray-600 text-xl mb-4">No orders yet</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
                    >
                        Start Shopping
                    </button>
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
                                        <th className="px-6 py-4 text-left font-bold">Date</th>
                                        <th className="px-6 py-4 text-left font-bold">Items</th>
                                        <th className="px-6 py-4 text-right font-bold">Total</th>
                                        <th className="px-6 py-4 text-left font-bold">Status</th>
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
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
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
                                                <button
                                                    onClick={() => navigate(`/order-confirmation/${order._id}`)}
                                                    className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded hover:bg-blue-700 transition"
                                                >
                                                    View Details
                                                </button>
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

export default OrderHistory;
