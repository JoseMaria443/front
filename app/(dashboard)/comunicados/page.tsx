"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { ComunicadosFilters } from "../../../components/comunicados/comunicados-filters";
import { ComunicadosTable } from "../../../components/comunicados/comunicados-table";
import { comunicadosService } from "../../../services/comunicados.service";
import type { Comunicado } from "../../../models/comunicado.schema";

export default function ComunicadosPage() {
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-corporate-dark">Repositorio de Comunicados</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {isLoading ? "Cargando..." : `${comunicados.length} comunicados`} · Ciclo Ene-Jun 2026
                    </p>
                </div>
                <Button className="rounded-full shadow-md px-6">
                    <Plus className="mr-2 h-4 w-4" />
                    Registrar Comunicado
                </Button>
            </div>

            <ComunicadosFilters />

            {isLoading ? (
                <div className="animate-pulse h-64 bg-gray-200 rounded-2xl w-full"></div>
            ) : (
                <ComunicadosTable items={comunicados} />
            )}
        </div>
    );
}