import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            {/* Routes publiques */}
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />

            {/* Routes protégées */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

            {/* Exemple routes par rôle (à décommenter quand nécessaire) */}
            {/* <Route path="/admin/*" element={<ProtectedRoute allowedRoles={['admin']}><AdminPanel /></ProtectedRoute>} /> */}
            {/* <Route path="/trajets" element={<ProtectedRoute allowedRoles={['chauffeur']}><Trajets /></ProtectedRoute>} /> */}

            {/* Redirection racine */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Page 404 pour les routes non définies */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
