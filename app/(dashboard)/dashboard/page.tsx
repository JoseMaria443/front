"use client";

import { useState, useEffect } from "react";
import { StatCard } from "../../../components/dashboard/stat-card";
import { RecentDocs } from "../../../components/dashboard/recent-docs";
import { MessageSquare, CheckSquare, Upload, Clock } from "lucide-react";
import { useDataStore } from "../../../store/data.store";
import { ComunicadoDetailSlideOver } from "../../../components/comunicados/ComunicadoDetailSlideOver";
import { api } from "../../../services/api.config";
import type { Comunicado } from "../../../models/comunicado.schema";

export default function DashboardPage() {
    const { comunicados: mockStoreComunicados } = useDataStore();
    const [recentComunicados, setRecentComunicados] = useState<Comunicado[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedComunicado, setSelectedComunicado] = useState<Comunicado | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // Keep KPIs with mock store data as requested
    const totalComunicados = mockStoreComunicados.length;

    const tareasPendientes = mockStoreComunicados.reduce((total, com) => {
        const pendientes = com.tareas?.filter(t => t.estado?.nombre === "Pendiente").length || 0;
        return total + pendientes;
    }, 0);

    const totalEvidencias = mockStoreComunicados.reduce((total, com) => {
        const evidencias = com.tareas?.reduce((tEv, t) => tEv + (t.evidencias?.length || 0), 0) || 0;
        return total + evidencias;
    }, 0);

    const fetchRecentComunicados = async () => {
        setIsLoading(true);
        try {
            const response = await api.get<any[]>('/comunicados');
            
            // Fetch catalog items to resolve relations
            const [tiposRes, mediosRes] = await Promise.all([
                api.get<any[]>('/tipos-comunicado/todos'),
                api.get<any[]>('/medios-recepcion/todos')
            ]);
            
            const tiposMap = new Map(tiposRes.data.map(t => [t.id, t]));
            const mediosMap = new Map(mediosRes.data.map(m => [m.id, m]));

            const mapped: Comunicado[] = response.data.map((c) => ({
                idComunicado: c.id,
                folioDoi: c.folioDoi,
                numComunicado: c.numComunicado,
                tema: c.tema,
                fechaEmision: c.fechaEmision,
                fechaRecepcion: c.fechaRecepcion,
                fechaRegistro: c.fechaRegistro,
                idEmisor: c.idEmisor,
                idTipoComunicado: c.idTipoComunicado,
                idMedioRecepcion: c.idMedioRecepcion,
                idEmpleadoRegistro: c.idEmpleadoRegistro,
                idEstadoComunicado: c.idEstadoComunicado,
                // Relationships
                tipoComunicado: tiposMap.has(c.idTipoComunicado) 
                    ? { idTipoComunicado: c.idTipoComunicado, nombre: tiposMap.get(c.idTipoComunicado).nombre }
                    : undefined,
                medioRecepcion: mediosMap.has(c.idMedioRecepcion)
                    ? { idMedioRecepcion: c.idMedioRecepcion, nombre: mediosMap.get(c.idMedioRecepcion).nombre }
                    : undefined,
                areaEmisoraNombre: c.areaEmisoraNombre,
                empleadoRegistroNombre: c.empleadoRegistroNombre,
                tareas: [],
                archivos: []
            }));

            // Sort by emission date desc
            const sorted = mapped.sort((a, b) => new Date(b.fechaEmision).getTime() - new Date(a.fechaEmision).getTime());
            setRecentComunicados(sorted.slice(0, 5));
        } catch (err) {
            console.error("Error loading recent comunicados:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRecentComunicados();
    }, []);

    const stats = [
        {
            title: "Total de Comunicados",
            value: totalComunicados.toString(),
            trend: { label: "Actualizado hoy", isPositive: true },
            icon: <MessageSquare className="h-5 w-5 text-corporate-accent" />,
        },
        {
            title: "Tareas Pendientes",
            value: tareasPendientes.toString(),
            trend: { label: "Requieren atención", isPositive: false },
            icon: <CheckSquare className="h-5 w-5 text-red-500" />,
        },
        {
            title: "Evidencias Entregadas",
            value: totalEvidencias.toString(),
            trend: { label: "Al día", isPositive: true },
            icon: <Upload className="h-5 w-5 text-emerald-500" />,
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-corporate-dark">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">Gestión y control de actividades</p>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-500 shadow-sm self-end sm:self-auto">
                    <Clock className="h-4 w-4" />
                    Última sincronización: {isLoading ? "Cargando..." : "hace 1 min"}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {stats.map((stat) => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </div>

            <RecentDocs 
                docs={recentComunicados} 
                onDocClick={(doc) => {
                    setSelectedComunicado(doc);
                    setIsDetailOpen(true);
                }}
            />

            <ComunicadoDetailSlideOver
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                comunicado={selectedComunicado}
            />
        </div>
    );
}