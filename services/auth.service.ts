import { Empleado } from '../models/empleado.schema';

export interface LoginResponse {
    user: Empleado;
    token: string;
}

export const authService = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        // mock de conexion como servicio de autenticacion
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email === "m.martinez@universidad.edu.mx" && password === "123456") {
                    resolve({
                        user: {
                            idEmpleado: "11111111-1111-1111-1111-111111111111",
                            nombre: "Dr. Martínez Reyes",
                            email: "m.martinez@universidad.edu.mx",
                            idArea: "22222222-2222-2222-2222-222222222222",
                            activo: true,
                            cargos: [{ idCargo: "33333333-3333-3333-3333-333333333333", nombre: "Coordinador" }]
                        },
                        token: "mock-jwt-token-value"
                    });
                } else {
                    reject(new Error("Credenciales inválidas"));
                }
            }, 800);     // puro retraso de red aunqu hay que bajarle los ms como quiera el serv ira mas rapido supongo

        });
    }
};