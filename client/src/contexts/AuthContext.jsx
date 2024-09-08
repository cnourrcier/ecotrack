import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log('AuthProvider rendered');

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/check-auth', { withCredentials: true });
            console.log('checkAuth response:', response.data);
            setUser(response.data.user);
        } catch (error) {
            console.error('Authentication check failed', error);
            setUser(null);
            setError(error.response?.data?.message || 'Authentication check failed');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        setError(null);
        try {
            const response = await axios.post('/api/login', { email, password }, { withCredentials: true });
            setUser(response.data.user);
            return response.data;
        } catch (error) {
            console.error('Login failed', error);
            setError(error.response?.data?.message || 'Login failed');
            throw error;
        }
    };

    const register = async (username, email, password) => {
        setError(null);
        try {
            const response = await axios.post('/api/register', { username, email, password }, { withCredentials: true });
            setUser(response.data.user);
            return response.data;
        } catch (error) {
            console.error('Registration failed', error);
            setError(error.response?.data?.message || 'Registration failed');
            throw error;
        }
    };

    const logout = async () => {
        setError(null);
        try {
            await axios.post('/api/logout', {}, { withCredentials: true });
            setUser(null);
        } catch (error) {
            console.error('Logout failed', error);
            setError(error.response?.data?.message || 'Logout failed');
        }
    };

    const refreshToken = async () => {
        try {
            await axios.post('/api/refresh-token', {}, { withCredentials: true });
        } catch (error) {
            console.error('Token refresh failed', error);
            setUser(null);
            setError(error.response?.data?.message || 'Token refresh failed');
        }
    };

    const fetchDashboardData = useCallback(async () => {
        try {
            const response = await axios.get('/api/dashboard', { withCredentials: true });
            setDashboardData(response.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
            setError(error.response?.data?.message || 'Failed to fetch dashboard data');
        }
    }, []);

    const fetchProfileData = useCallback(async () => {
        try {
            const response = await axios.get('/api/profile', { withCredentials: true });
            setProfileData(response.data.user);
        } catch (error) {
            console.error('Failed to fetch profile data', error);
            setError(error.response?.data?.message || 'Failed to fetch profile data');
        }
    }, []);

    axios.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    await refreshToken();
                    return axios(originalRequest);
                } catch (refreshError) {
                    setUser(null);
                    setError(refreshError.response?.data?.message || 'Session expired. Please login again.');
                    return Promise.reject(refreshError);
                }
            }
            setError(error.response?.data?.message || 'An unexpected error occurred');
            return Promise.reject(error);
        }
    );

    return (
        <AuthContext.Provider value={{
            user,
            dashboardData,
            profileData,
            loading,
            error,
            login,
            register,
            logout,
            checkAuth,
            fetchDashboardData,
            fetchProfileData
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);