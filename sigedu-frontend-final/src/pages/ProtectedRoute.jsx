import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const ProtectedRoute = () => {
    const { isAuthenticated, token } = useAuth();
    const location = useLocation();

    if (!isAuthenticated && !token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return (
        <Layout>
            <Outlet />
        </Layout>
    );
};

export default ProtectedRoute;
