export interface Notificacion {
    id: string;
    titulo: string;
    mensaje: string;
    tipo: 'info' | 'success' | 'warning' | 'error';
    leida: boolean;
    fechaCreacion: string;
    fechaLeida?: string | null;
    idEmpleado: string;
}

// TODO: reemplazar con GET /notificaciones
export const getNotificaciones = async (): Promise<Notificacion[]> => {
    // Simulación de delay de red (500ms - 1200ms)
    const delay = Math.floor(Math.random() * 700) + 500;
    await new Promise(resolve => setTimeout(resolve, delay));

    return [
        {
            id: '1',
            titulo: 'Nuevo comunicado disponible',
            mensaje: 'El departamento de RRHH ha publicado un nuevo comunicado fechado el 15/11/2024.',
            tipo: 'info',
            leida: false,
            fechaCreacion: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            fechaLeida: null,
            idEmpleado: 'uuid-empleado-actual'
        },
        {
            id: '2',
            titulo: 'Tarea pendiente por vencer',
            mensaje: 'Tienes una tarea asignada que vence mañana: "Actualizar documentación SGC".',
            tipo: 'warning',
            leida: false,
            fechaCreacion: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            fechaLeida: null,
            idEmpleado: 'uuid-empleado-actual'
        },
        {
            id: '3',
            titulo: 'Cambio de contraseña exitoso',
            mensaje: 'Tu contraseña fue actualizada correctamente. Si no realizaste este cambio, contacta a soporte.',
            tipo: 'success',
            leida: true,
            fechaCreacion: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
            fechaLeida: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
            idEmpleado: 'uuid-empleado-actual'
        },
        {
            id: '4',
            titulo: 'Error al cargar archivo',
            mensaje: 'No se pudo subir la evidencia para la tarea "Capacitación 2024". Intenta nuevamente.',
            tipo: 'error',
            leida: false,
            fechaCreacion: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            fechaLeida: null,
            idEmpleado: 'uuid-empleado-actual'
        },
        {
            id: '5',
            titulo: 'Recordatorio: Firmar oficio',
            mensaje: 'El oficio FOLIO-2024-087 requiere tu firma digital antes del 20/11/2024.',
            tipo: 'info',
            leida: false,
            fechaCreacion: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
            fechaLeida: null,
            idEmpleado: 'uuid-empleado-actual'
        }
    ];
};