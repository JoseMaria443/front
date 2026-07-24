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
        
        let cargosNombres: string[] = [];
        let cargosIds: any[] = [];

        try {
            const base64Url = access_token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            const decodedToken = JSON.parse(jsonPayload);
            console.log("Payload decodificado en Login:", decodedToken);
            
            cargosNombres = decodedToken.cargos_nombres || [];
            const rawCargos = decodedToken.cargos || [];
            cargosIds = rawCargos.map((id: string, index: number) => ({
                idCargo: id,
                nombre: cargosNombres[index] || "Asignado"
            }));
        } catch (e) {
            console.error("Error decoding token in login:", e);
        }
        
        return {
            user: {
                idEmpleado: empleado.id,
                nombre: empleado.nombre,
                email: empleado.email,
                activo: empleado.activo,
                idArea: empleado.idArea || "11111111-1111-1111-1111-111111111111",
                cargos: cargosIds,
                cargos_nombres: cargosNombres
            },
            token: access_token
        };
    }
};
