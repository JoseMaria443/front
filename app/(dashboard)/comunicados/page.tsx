"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { ComunicadosFilters } from "../../../components/comunicados/comunicados-filters";
import { ComunicadosTable } from "../../../components/comunicados/comunicados-table";
import { NewComunicadoSlideOver } from "../../../components/comunicados/NewComunicadoSlideOver";
import { useDataStore } from "../../../store/data.store";

export default function ComunicadosPage() {
    const { comunicados } = useDataStore();
    const [isNewComunicadoOpen, setIsNewComunicadoOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-corporate-dark">Repositorio de Comunicados</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {comunicados.length} comunicados · Ciclo Ene-Jun 2026
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

            <ComunicadosFilters />

            <ComunicadosTable />

            <NewComunicadoSlideOver
                isOpen={isNewComunicadoOpen}
                onClose={() => setIsNewComunicadoOpen(false)}
            />
        </div>
    );
}