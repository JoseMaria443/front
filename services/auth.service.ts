import { api } from './api.config';
import type { Empleado } from '../models/empleado.schema';

interface BackendLoginResponse {
    access_token: string;
    token_type: string;
    empleado: {
        id: string;
        nombre: string;
        email: string;
        activo: boolean;
        idArea?: string;
        cargos?: any[];
    };
}

export interface LoginResponse {
    user: Empleado;
    token: string;
}

export const authService = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const response = await api.post<BackendLoginResponse>('/api/empleado/login', { email, password });
        const { access_token, empleado } = response.data;
        
        return {
            user: {
                idEmpleado: empleado.id,
                nombre: empleado.nombre,
                email: empleado.email,
                activo: empleado.activo,
                idArea: empleado.idArea || "11111111-1111-1111-1111-111111111111",
                cargos: empleado.cargos || []
            },
            token: access_token
        };
    }
};
