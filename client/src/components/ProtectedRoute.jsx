import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import Spinner from './Spinner';

const ProtectedRoute = ({ role, children }) => {
    const { user, loading } = useAuth();

    if (loading) return <Layout><Spinner /></Layout>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
        // Redirect to home or show unauthorized page
        return <Navigate to="/" replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;
