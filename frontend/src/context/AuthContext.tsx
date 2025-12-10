import { createContext, useContext, useState } from 'react';
import type { AuthState } from '../types/auth';

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        token: localStorage.getItem('token'),
        isAuthenticated: false,
        loading: false
    });

    const login = async (email: string, password: string) => {
        setState(prev => ({ ...prev, loading: true }));
        try {
            const response = await fetch('http://localhost:5000/api/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                setState({
                    user: data.user,
                    token: data.token,
                    isAuthenticated: true,
                    loading: false
                });
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            setState(prev => ({ ...prev, loading: false }));
            throw error;
        }
    };

    const register = async (userData: any) => {
        setState(prev => ({ ...prev, loading: true }));
        try {
            const response = await fetch('http://localhost:5000/api/user/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setState(prev => ({ ...prev, loading: false }));
        } catch (error) {
            setState(prev => ({ ...prev, loading: false }));
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
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