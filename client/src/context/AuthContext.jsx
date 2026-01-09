import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in (persisted session)
        // We actually need an endpoint to check current user status.
        // The current backend doesn't have a specific 'me' endpoint, but we can try to fetch cart or something authenticated, or just rely on local state management for now. 
        // Ideally, we add a /current-user endpoint.
        // For now, let's assume valid session if we can fetch user data.
        // I will add a /current-user endpoint to auth controller.
        checkUser();
    }, []);



    const checkUser = async () => {
        try {
            const res = await api.get('/current-user');
            // res.data.data can be user object or null
            setUser(res.data.data);
        } catch (e) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };


    const login = async (username, password) => {
        const res = await api.post('/login', { username, password });
        setUser(res.data.data);
    };

    const register = async (email, username, password, role) => {
        const res = await api.post('/register', { email, username, password, role });
        setUser(res.data.data);
    };

    const logout = async () => {
        await api.get('/logout');
        setUser(null);
    };


    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
