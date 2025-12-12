import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { DashboardLayout } from '../components/layout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import DashboardPage from '../pages/DashboardPage';
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
                <Route path="/dashboard" element={<DashboardPage />} />
                {/* Pages CRUD - à implémenter */}
                <Route path="/camions" element={<DashboardPage />} />
                <Route path="/remorques" element={<DashboardPage />} />
                <Route path="/trajets" element={<DashboardPage />} />
                <Route path="/pneus" element={<DashboardPage />} />
                <Route path="/maintenance" element={<DashboardPage />} />
                <Route path="/chauffeurs" element={<DashboardPage />} />
            </Route>

            {/* Redirection racine */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Page 404 pour les routes non définies */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
