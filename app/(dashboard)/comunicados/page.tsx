"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { ComunicadosFilters } from "../../../components/comunicados/comunicados-filters";
import { ComunicadosTable } from "../../../components/comunicados/comunicados-table";
import { NewComunicadoSlideOver } from "../../../components/comunicados/NewComunicadoSlideOver";
import { api } from "../../../services/api.config";

export default function ComunicadosPage() {
    const [comunicadosCount, setComunicadosCount] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0);
    const [isNewComunicadoOpen, setIsNewComunicadoOpen] = useState(false);

    // Filtros controlados
    const [search, setSearch] = useState("");
    const [tipo, setTipo] = useState("all");
    const [area, setArea] = useState("all");

    const triggerRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    useEffect(() => {
        api.get<any[]>('/comunicados').then(res => {
            setComunicadosCount(res.data.length);
        }).catch(err => {
            console.error("Error loading count:", err);
        });
    }, [refreshKey]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-corporate-dark">Repositorio de Comunicados</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {comunicadosCount} comunicados · Ciclo Ene-Jun 2026
                    </p>
                </div>
                <Button
                    onClick={() => setIsNewComunicadoOpen(true)}
                    className="rounded-full shadow-md px-6 cursor-pointer"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Registrar Comunicado
                </Button>
            </div>

            <ComunicadosFilters
                search={search}
                onSearchChange={setSearch}
                tipo={tipo}
                onTipoChange={setTipo}
                area={area}
                onAreaChange={setArea}
            />

            <ComunicadosTable
                refreshKey={refreshKey}
                onRefreshNeeded={triggerRefresh}
                filters={{ search, tipo, area }}
            />

            <NewComunicadoSlideOver
                isOpen={isNewComunicadoOpen}
                onClose={() => setIsNewComunicadoOpen(false)}
                onSuccess={() => {
                    setIsNewComunicadoOpen(false);
                    triggerRefresh();
                }}
            />
        </div>
    );
}