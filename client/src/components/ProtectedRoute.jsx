import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        // You can replace this with a loading spinner or component
        return <div>Loading...</div>;
    }

    return user ? <Outlet /> : <Navigate to='/login' replace />;
};

export default ProtectedRoute;
