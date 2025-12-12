import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (email: string, password: string) =>
        api.post('/user/login', { email, password }),
    
    register: (userData: any) =>
        api.post('/user/register', userData),
};

// API Admin
export const adminAPI = {
    getChauffeurs: () =>
        api.get('/user/chauffeurs'),
    
    toggleChauffeurStatus: (id: string) =>
        api.patch(`/user/chauffeurs/${id}/toggle`),
};

// API Camions
export const camionAPI = {
    getAll: () => api.get('/camion'),
    getById: (id: string) => api.get(`/camion/${id}`),
    create: (data: any) => api.post('/camion', data),
    update: (id: string, data: any) => api.put(`/camion/${id}`, data),
    delete: (id: string) => api.delete(`/camion/${id}`),
};

// API Remorques
export const remorqueAPI = {
    getAll: () => api.get('/remorque'),
    getById: (id: string) => api.get(`/remorque/${id}`),
    create: (data: any) => api.post('/remorque', data),
    update: (id: string, data: any) => api.put(`/remorque/${id}`, data),
    delete: (id: string) => api.delete(`/remorque/${id}`),
};

export default api;