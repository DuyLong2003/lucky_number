import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated, getUserRoleName } from '../services/api';

interface ProtectedRouteProps {
    requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireAdmin = false }) => {
    if (!isAuthenticated()) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin) {
        const currentRole = getUserRoleName();

        // Chỉ nhận role là super-admin, còn lại (bao gồm user/Tenant) bị đá về dashboard
        if (currentRole !== 'super-admin') {
            return <Navigate to="/dashboard" replace />;
        }
    }

    // Render child routes if authenticated
    return <Outlet />;
};
