"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { ComunicadosFilters } from "../../../components/comunicados/comunicados-filters";
import { ComunicadosTable } from "../../../components/comunicados/comunicados-table";
import { NewComunicadoSlideOver } from "../../../components/comunicados/NewComunicadoSlideOver";
import { api } from "../../../services/api.config";

interface TipoComunicado {
    id: string;
    nombre: string;
}

interface Area {
    id: string;
    nombre: string;
}

export default function ComunicadosPage() {
    const [comunicadosCount, setComunicadosCount] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0);
    const [isNewComunicadoOpen, setIsNewComunicadoOpen] = useState(false);

    // Catálogos
    const [tiposComunicado, setTiposComunicado] = useState<TipoComunicado[]>([]);
    const [areas, setAreas] = useState<Area[]>([]);

    // Filtros controlados
    const [search, setSearch] = useState("");
    const [idTipoComunicado, setIdTipoComunicado] = useState("all");
    const [idArea, setIdArea] = useState("all");

    const triggerRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    const loadCatalogs = async () => {
        try {
            const [tiposRes, areasRes] = await Promise.all([
                api.get<any[]>('/tipos-comunicado/todos'),
                api.get<any[]>('/areas/todos')
            ]);
            setTiposComunicado(tiposRes.data);
            setAreas(areasRes.data);
        } catch (err) {
            console.error("Error loading catalogs:", err);
        }
    };

    useEffect(() => {
        loadCatalogs();
    }, []);

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
                idTipoComunicado={idTipoComunicado}
                onTipoChange={setIdTipoComunicado}
                idArea={idArea}
                onAreaChange={setIdArea}
                tiposComunicado={tiposComunicado}
                areas={areas}
            />

            <ComunicadosTable
                refreshKey={refreshKey}
                onRefreshNeeded={triggerRefresh}
                filters={{ search, idTipoComunicado, idArea }}
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
