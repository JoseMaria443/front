import axios from 'axios';
import { useSessionStore } from '../store/session.store';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de Request para adjuntar el JWT
api.interceptors.request.use(
    (config) => {
        const token = useSessionStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de Response para manejar errores globales (ej: 401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Limpiar la sesión en el store y cookies
            useSessionStore.getState().logout();
            
            // Redirigir al login si estamos en el cliente
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);
