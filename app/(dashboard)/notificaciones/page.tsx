"use client";

import { useState, useEffect } from "react";
import { Bell, Search, Filter } from "lucide-react";
import { getNotificaciones } from "../../../services/notificaciones.service";
import type { Notificacion } from "../../../services/notificaciones.service";

export default function NotificacionesPage() {
    const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterTipo, setFilterTipo] = useState<string>("all");
    const [filterLeidas, setFilterLeidas] = useState<string>("all");

    const fetchNotificaciones = async () => {
        setIsLoading(true);
        try {
            // TODO: reemplazar con GET /notificaciones
            const data = await getNotificaciones();
            setNotificaciones(data);
        } catch (err) {
            console.error("Error cargando notificaciones:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotificaciones();
    }, []);

    // Filtros controlados en cliente (mismo patrón que directorio/page.tsx)
    const notificacionesFiltradas = notificaciones.filter(n => {
        const searchLower = search.toLowerCase();
        const coincideBusqueda =
            n.titulo.toLowerCase().includes(searchLower) ||
            n.mensaje.toLowerCase().includes(searchLower);

        const coincideTipo = filterTipo === "all" || n.tipo === filterTipo;
        const coincideLeidas =
            filterLeidas === "all" ||
            (filterLeidas === "leidas" && n.leida) ||
            (filterLeidas === "no_leidas" && !n.leida);

        return coincideBusqueda && coincideTipo && coincideLeidas;
    });

    // En un backend real, esto sería algo como:
    // const queryParams = new URLSearchParams();
    // if (search) queryParams.set("search", search);
    // if (filterTipo !== "all") queryParams.set("tipo", filterTipo);
    // if (filterLeidas !== "all") queryParams.set("leidas", filterLeidas);
    // const res = await api.get(`/notificaciones?${queryParams}`);
    // setNotificaciones(res.data);

    const getIconoPorTipo = (tipo: Notificacion["tipo"]) => {
        const base = "w-8 h-8 rounded-full flex items-center justify-center shrink-0";
        switch (tipo) {
            case "success":
                return `${base} bg-emerald-50 text-emerald-600`;
            case "error":
                return `${base} bg-red-50 text-red-600`;
            case "warning":
                return `${base} bg-amber-50 text-amber-600`;
            default:
                return `${base} bg-blue-50 text-blue-600`;
        }
    };

    const getBadgeTipo = (tipo: Notificacion["tipo"]) => {
        const base = "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide";
        switch (tipo) {
            case "success":
                return `${base} bg-emerald-50 text-emerald-700 border-emerald-100`;
            case "error":
                return `${base} bg-red-50 text-red-700 border-red-100`;
            case "warning":
                return `${base} bg-amber-50 text-amber-700 border-amber-100`;
            default:
                return `${base} bg-blue-50 text-blue-700 border-blue-100`;
        }
    };

    const formatearFecha = (fecha: string) => {
        const d = new Date(fecha);
        if (isNaN(d.getTime()) || d.getTime() <= 0) return "Fecha no disponible";
        return d.toLocaleString("es-MX", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const noLeidasCount = notificaciones.filter(n => !n.leida).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-corporate-dark">Notificaciones</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {noLeidasCount > 0
                            ? `Tienes ${noLeidasCount} notificación${noLeidasCount > 1 ? "es" : ""} sin leer.`
                            : "No hay notificaciones sin leer."}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchNotificaciones}
                        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 shadow-sm transition-colors"
                    >
                        <Filter className="h-3.5 w-3.5" />
                        Limpiar filtros
                    </button>
                </div>
            </div>

            {/* Filtros controlados */}
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por título o mensaje..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-corporate-accent focus:ring-1 focus:ring-corporate-accent transition-all shadow-sm"
                    />
                </div>
                <select
                    value={filterTipo}
                    onChange={(e) => setFilterTipo(e.target.value)}
                    className="rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-corporate-accent focus:ring-1 focus:ring-corporate-accent transition-all shadow-sm"
                >
                    <option value="all">Todos los tipos</option>
                    <option value="info">Información</option>
                    <option value="success">Éxito</option>
                    <option value="warning">Advertencia</option>
                    <option value="error">Error</option>
                </select>
                <select
                    value={filterLeidas}
                    onChange={(e) => setFilterLeidas(e.target.value)}
                    className="rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-corporate-accent focus:ring-1 focus:ring-corporate-accent transition-all shadow-sm"
                >
                    <option value="all">Todas</option>
                    <option value="leidas">Leídas</option>
                    <option value="no_leidas">No leídas</option>
                </select>
            </div>

            {/* Lista de notificaciones */}
            <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="py-12 text-center text-sm text-gray-500">
                        Cargando notificaciones...
                    </div>
                ) : notificacionesFiltradas.length === 0 ? (
                    <div className="py-12 text-center text-sm text-gray-500">
                        No se encontraron notificaciones con los filtros actuales.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {notificacionesFiltradas.map((n) => (
                            <div
                                key={n.id}
                                className={`flex items-start gap-4 px-6 py-5 transition-colors ${
                                    n.leida ? "bg-white" : "bg-slate-50/60"
                                }`}
                            >
                                <div className={"mt-0.5 " + getIconoPorTipo(n.tipo)}>
                                    <Bell className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-3">
                                        <p
                                            className={`text-sm truncate ${
                                                n.leida ? "font-medium text-gray-600" : "font-bold text-corporate-dark"
                                            }`}
                                        >
                                            {n.titulo}
                                        </p>
                                        <span className={getBadgeTipo(n.tipo)}>
                                            {n.tipo}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                        {n.mensaje}
                                    </p>
                                    <p className="text-[10px] text-gray-400 mt-2 font-medium">
                                        {formatearFecha(n.fechaCreacion)}
                                        {!n.leida && (
                                            <span className="ml-2 inline-flex items-center rounded-full bg-blue-50 text-corporate-accent px-2 py-0.5 border border-blue-100">
                                                Sin leer
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}