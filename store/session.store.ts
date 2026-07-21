import { create } from 'zustand';
import type { Empleado } from '../models/empleado.schema';

interface SessionState {
    user: Empleado | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (userData: Empleado, token: string) => void;
    logout: () => void;
    initialize: () => void;
}

const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(';').shift() || '');
    return null;
};

const setCookie = (name: string, value: string, days = 7) => {
    if (typeof document === 'undefined') return;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax; Secure`;
};

const deleteCookie = (name: string) => {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const useSessionStore = create<SessionState>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    login: (userData, token) => {
        setCookie('session-token', token);
        setCookie('session-user', JSON.stringify(userData));
        set({ user: userData, token, isAuthenticated: true });
    },
    logout: () => {
        deleteCookie('session-token');
        deleteCookie('session-user');
        set({ user: null, token: null, isAuthenticated: false });
    },
    initialize: () => {
        const token = getCookie('session-token');
        const userStr = getCookie('session-user');
        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                set({ user, token, isAuthenticated: true });
            } catch (e) {
                deleteCookie('session-token');
                deleteCookie('session-user');
            }
        }
    }
}));