import { createContext, useContext, useState } from 'react';
import type { AuthState } from '../types/auth';
import { authAPI } from '../services/api';

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    // Récupérer user depuis localStorage au démarrage
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    const [state, setState] = useState<AuthState>({
        user: savedUser ? JSON.parse(savedUser) : null,
        token: savedToken,
        isAuthenticated: !!(savedToken && savedUser),
        loading: false
    });

    const login = async (email: string, password: string) => {
        setState(prev => ({ ...prev, loading: true }));
        try {
            const res = await authAPI.login(email, password);
            const { user, token } = res.data;
            
            // Sauvegarder dans localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            setState({
                user,
                token,
                isAuthenticated: true,
                loading: false
            });
        } catch (error: any) {
            setState(prev => ({ ...prev, loading: false }));
            throw new Error(error.response?.data?.message || 'Erreur de connexion');
        }
    };

    const register = async (userData: any) => {
        setState(prev => ({ ...prev, loading: true }));
        try {
            await authAPI.register(userData);
            setState(prev => ({ ...prev, loading: false }));
        } catch (error: any) {
            setState(prev => ({ ...prev, loading: false }));
            throw new Error(error.response?.data?.message || 'Erreur inscription');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setState({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false
        });
    };

    return (
        <AuthContext.Provider value={{ ...state, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};