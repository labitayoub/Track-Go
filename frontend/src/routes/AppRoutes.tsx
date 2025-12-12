import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { DashboardLayout } from '../components/layout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Chauffeurs from '../pages/Chauffeurs';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            {/* Routes publiques */}
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />

            {/* Routes protégées avec Layout */}
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                {/* Pages CRUD - à implémenter */}
                <Route path="/camions" element={<Dashboard />} />
                <Route path="/remorques" element={<Dashboard />} />
                <Route path="/trajets" element={<Dashboard />} />
                <Route path="/pneus" element={<Dashboard />} />
                <Route path="/maintenance" element={<Dashboard />} />
                <Route path="/chauffeurs" element={<Chauffeurs />} />
            </Route>

            {/* Redirection racine */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Page 404 pour les routes non définies */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
