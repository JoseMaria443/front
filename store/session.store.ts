import { create } from 'zustand';
import type { Empleado } from '../models/empleado.schema';

interface SessionState {
    user: Empleado | null;
    isAuthenticated: boolean;
    login: (userData: Empleado) => void;
    logout: () => void;
}
// daot mockeado para ya tener usuario en la card cuando se configure o mergee
const mockUser: Empleado = {
    idEmpleado: "11111111-1111-1111-1111-111111111111",
    nombre: "Dr. Martínez Reyes",
    email: "m.martinez@universidad.edu.mx",
    idArea: "22222222-2222-2222-2222-222222222222",
    activo: true,
    cargos: [
        { idCargo: "33333333-3333-3333-3333-333333333333", nombre: "Coordinador" }
    ]
};

export const useSessionStore = create<SessionState>((set) => ({
    user: mockUser,
    isAuthenticated: true,
    login: (userData) => set({ user: userData, isAuthenticated: true }),
    logout: () => set({ user: null, isAuthenticated: false }),
}));