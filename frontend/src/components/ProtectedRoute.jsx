import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        let cleanRole = null;
        if (token.startsWith('mock.')) {
            const parts = token.split('.');
            if (parts[1]) {
                const parsed = JSON.parse(atob(parts[1]));
                cleanRole = (parsed.role || 'CUSTOMER').replace('ROLE_', '');
            }
        } else {
            const decoded = jwtDecode(token);
            const userRole = decoded.role || (decoded.roles && decoded.roles.length > 0 ? decoded.roles[0].authority : null);
            cleanRole = typeof userRole === 'string' ? userRole.replace('ROLE_', '') : null;
        }

        if (!cleanRole) {
            localStorage.removeItem('token');
            return <Navigate to="/login" replace />;
        }

        if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(cleanRole)) {
            if (cleanRole === 'ADMIN') return <Navigate to="/dashboard/admin" replace />;
            if (cleanRole === 'OWNER') return <Navigate to="/dashboard/owner" replace />;
            return <Navigate to="/dashboard/customer" replace />;
        }

        return <Outlet />;
    } catch {
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;
