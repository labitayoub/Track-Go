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
    
    getAvailableChauffeurs: () =>
        api.get('/user/chauffeurs/available'),
    
    toggleChauffeurStatus: (id: string) =>
        api.patch(`/user/chauffeurs/${id}/toggle`),
};

// API Camions
export const camionAPI = {
    getAll: () => api.get('/camion'),
    getAvailable: () => api.get('/camion/available'),
    getById: (id: string) => api.get(`/camion/${id}`),
    create: (data: any) => api.post('/camion', data),
    update: (id: string, data: any) => api.put(`/camion/${id}`, data),
    delete: (id: string) => api.delete(`/camion/${id}`),
};

// API Remorques
export const remorqueAPI = {
    getAll: () => api.get('/remorque'),
    getAvailable: () => api.get('/remorque/available'),
    getById: (id: string) => api.get(`/remorque/${id}`),
    create: (data: any) => api.post('/remorque', data),
    update: (id: string, data: any) => api.put(`/remorque/${id}`, data),
    delete: (id: string) => api.delete(`/remorque/${id}`),
};

// API Pneus
export const pneuAPI = {
    getAll: () => api.get('/pneu'),
    getById: (id: string) => api.get(`/pneu/${id}`),
    getByVehicule: (vehiculeType: string, vehiculeId: string) => 
        api.get(`/pneu/vehicule/${vehiculeType}/${vehiculeId}`),
    create: (data: any) => api.post('/pneu', data),
    update: (id: string, data: any) => api.put(`/pneu/${id}`, data),
    delete: (id: string) => api.delete(`/pneu/${id}`),
};

// API Trajets
export const trajetAPI = {
    getAll: () => api.get('/trajet'),
    getMyTrajets: () => api.get('/trajet/mes-trajets'),
    getById: (id: string) => api.get(`/trajet/${id}`),
    create: (data: any) => api.post('/trajet', data),
    update: (id: string, data: any) => api.put(`/trajet/${id}`, data),
    delete: (id: string) => api.delete(`/trajet/${id}`),
};

export default api;