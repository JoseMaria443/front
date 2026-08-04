import axios from 'axios';
import { useSessionStore } from '../store/session.store';

const getSessionTokenFromCookie = (): string | null => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; session-token=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(';').shift() || '');
    return null;
};

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de Request para adjuntar el JWT
api.interceptors.request.use(
    (config) => {
        const token = getSessionTokenFromCookie() || useSessionStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('[API] Enviando token a', config.url, ':', token);
        } else {
            console.warn('[API] No hay token disponible para', config.url);
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
            console.warn('Token inválido o expirado (401) en', error.config?.url);
            console.warn('Response data:', error.response?.data);
        }
        return Promise.reject(error);
    }
);
