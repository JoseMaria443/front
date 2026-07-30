export interface Notificacion {
    id: string;
    titulo: string;
    mensaje: string;
    tipo: "info" | "success" | "warning" | "error";
    leida: boolean;
    fechaCreacion: string;
    fechaLeida?: string | null;
    idEmpleado: string;
    idReferencia?: string | null;
}

export interface NotificacionAPI {
    id: string;
    idEmpleadoDestino: string;
    tipo: string;
    mensaje: string;
    idReferencia: string | null;
    leida: boolean;
    fechaCreacion: string | null;
}

import { api } from "./api.config";

const toUI = (item: NotificacionAPI): Notificacion => ({
    id: item.id,
    titulo: item.mensaje,
    mensaje: item.mensaje,
    tipo: item.tipo as Notificacion["tipo"],
    leida: item.leida,
    fechaCreacion: item.fechaCreacion ?? new Date().toISOString(),
    fechaLeida: null,
    idEmpleado: item.idEmpleadoDestino,
    idReferencia: item.idReferencia,
});

export const getNotificaciones = async (): Promise<Notificacion[]> => {
    const res = await api.get<NotificacionAPI[]>("/notificaciones/");
    const data: NotificacionAPI[] = res.data;
    return data.map(toUI);
};

export const marcarNotificacionLeida = async (id: string): Promise<Notificacion> => {
    const res = await api.patch<NotificacionAPI>(`/notificaciones/${id}/leida`);
    return toUI(res.data);
};

export const getNoLeidasCount = async (): Promise<number> => {
    const res = await api.get<{ count: number }>("/notificaciones/no-leidas/count");
    return res.data.count ?? 0;
};