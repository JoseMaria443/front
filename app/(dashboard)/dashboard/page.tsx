"use client";

import { useEffect, useState } from "react";
import { StatCard } from "../../../components/dashboard/stat-card";
import { RecentDocs } from "../../../components/dashboard/recent-docs";
import { MessageSquare, CheckSquare, Upload, Clock } from "lucide-react";
import { comunicadosService } from "../../../services/comunicados.service";
import type { Comunicado } from "../../../models/comunicado.schema";

export default function DashboardPage() {
    const [comunicados, setComunicados] = useState<Comunicado[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const datos = await comunicadosService.obtenerRecientes();
                setComunicados(datos);
            } catch (error) {
                console.error("Error al cargar comunicados", error);
            } finally {
                setIsLoading(false);
            }
        };
        cargarDatos();
    }, []);

    const totalComunicados = comunicados.length;

    const tareasPendientes = comunicados.reduce((total, com) => {
        const pendientes = com.tareas?.filter(t => t.estado?.nombre === "Pendiente").length || 0;
        return total + pendientes;
    }, 0);

    const stats = [
        {
            title: "Total de Comunicados",
            value: isLoading ? "..." : totalComunicados.toString(),
            trend: { label: "Actualizado hoy", isPositive: true },
            icon: <MessageSquare className="h-5 w-5 text-corporate-accent" />,
        },
        {
            title: "Tareas Pendientes",
            value: isLoading ? "..." : tareasPendientes.toString(),
            trend: { label: "Requieren atención", isPositive: false },
            icon: <CheckSquare className="h-5 w-5 text-red-500" />,
        },
        {
            title: "Evidencias Entregadas",
            value: "0",
            trend: { label: "Al día", isPositive: true },
            icon: <Upload className="h-5 w-5 text-emerald-500" />,
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-end">
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-500 shadow-sm">
                    <Clock className="h-4 w-4" />
                    Última sincronización: hace 1 min
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {stats.map((stat) => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </div>

            {isLoading ? (
                <div className="animate-pulse h-64 bg-gray-200 rounded-2xl w-full"></div>
            ) : (
                <RecentDocs docs={comunicados} />
            )}
        </div>
    );
}