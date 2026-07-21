import { api } from './api.config';
import type { Empleado } from '../models/empleado.schema';

export interface LoginResponse {
    user: Empleado;
    token: string;
}

export const authService = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/api/empleado/login', { email, password });
        return response.data;
    }
};
