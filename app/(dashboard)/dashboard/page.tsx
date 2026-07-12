"use client";

import { useState } from "react";
import { StatCard } from "../../../components/dashboard/stat-card";
import { RecentDocs } from "../../../components/dashboard/recent-docs";
import { MessageSquare, CheckSquare, Upload, Clock } from "lucide-react";
import { useDataStore } from "../../../store/data.store";
import { ComunicadoDetailSlideOver } from "../../../components/comunicados/ComunicadoDetailSlideOver";
import type { Comunicado } from "../../../models/comunicado.schema";

export default function DashboardPage() {
    const { comunicados } = useDataStore();
    const [selectedComunicado, setSelectedComunicado] = useState<Comunicado | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const totalComunicados = comunicados.length;

    const tareasPendientes = comunicados.reduce((total, com) => {
        const pendientes = com.tareas?.filter(t => t.estado?.nombre === "Pendiente").length || 0;
        return total + pendientes;
    }, 0);

    const totalEvidencias = comunicados.reduce((total, com) => {
        const evidencias = com.tareas?.reduce((tEv, t) => tEv + (t.evidencias?.length || 0), 0) || 0;
        return total + evidencias;
    }, 0);

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
                    Última sincronización: hace 1 min
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {stats.map((stat) => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </div>

            <RecentDocs 
                docs={comunicados} 
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