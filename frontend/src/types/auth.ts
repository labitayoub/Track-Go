export interface User {
    _id: string;
    nom: string;
    email: string;
    role: 'admin' | 'chauffeur';
    telephone: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
}