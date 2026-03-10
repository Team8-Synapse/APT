import axios from 'axios';

// Create a central axios instance for the entire application
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5005/api',
});

// Automatically attach the Authorization header if a token exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
