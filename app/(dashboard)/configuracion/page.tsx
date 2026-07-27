"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { CatalogModal } from "../../../components/configuracion/CatalogModal";
import { api } from "../../../services/api.config";

interface CatalogoItem {
    id: string;
    nombre?: string;
    descripcion_rol?: string;
    archivado?: boolean;
}

interface CatalogoConfig {
    label: string;
    endpoint: string;
    isReadOnly: boolean;
    nameKey: "nombre" | "descripcion_rol";
}

const CATALOGOS_CONFIG: Record<string, CatalogoConfig> = {
    "Áreas": { label: "Áreas", endpoint: "/areas", isReadOnly: false, nameKey: "nombre" },
    "Cargos": { label: "Cargos", endpoint: "/cargos", isReadOnly: false, nameKey: "nombre" },
    "Tipos de Comunicado": { label: "Tipos de Comunicado", endpoint: "/tipos-comunicado", isReadOnly: false, nameKey: "nombre" },
    "Medios de Recepción": { label: "Medios de Recepción", endpoint: "/medios-recepcion", isReadOnly: false, nameKey: "nombre" },
    "Roles de Destinatario": { label: "Roles de Destinatario", endpoint: "/roles-destinatario", isReadOnly: false, nameKey: "descripcion_rol" },
    "Estados de Tarea": { label: "Estados de Tarea", endpoint: "/estados-tarea", isReadOnly: true, nameKey: "nombre" },
};

const MENU_CATALOGOS = Object.keys(CATALOGOS_CONFIG);

export default function ConfiguracionPage() {
    const [activeTab, setActiveTab] = useState<string>(MENU_CATALOGOS[0]);
    const [items, setItems] = useState<CatalogoItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const config = CATALOGOS_CONFIG[activeTab];

    const fetchItems = async () => {
        setIsLoading(true);
        setError("");
        try {
            const url = config.isReadOnly 
                ? config.endpoint 
                : `${config.endpoint}/todos`;
            const response = await api.get<CatalogoItem[]>(url);
            setItems(response.data);
        } catch (err: any) {
            setError("Error al cargar los registros del catálogo.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [activeTab]);

    const handleAddRegistro = async (nombre: string) => {
        setError("");
        try {
            const payload = { [config.nameKey]: nombre };
            await api.post(config.endpoint + "/", payload);
            fetchItems();
        } catch (err: any) {
            const msg = err.response?.data?.message || err.response?.data?.detail || "Error al crear el registro.";
            setError(msg);
        }
    };

    const handleToggleArchivado = async (item: CatalogoItem) => {
        setError("");
        try {
            const nextArchivedState = !item.archivado;
            await api.patch(`${config.endpoint}/${item.id}/archivar`, { archivado: nextArchivedState });
            fetchItems();
        } catch (err: any) {
            const msg = err.response?.data?.message || err.response?.data?.detail || "Error al actualizar el estado de archivo.";
            setError(msg);
        }
    };

    const isCoreCargo = (item: CatalogoItem) => {
        if (activeTab !== "Cargos") return false;
        const nombre = item.nombre || "";
        return ["administrador", "director", "docente"].includes(nombre.trim().toLowerCase());
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 h-full min-h-[calc(100vh-8rem)]">
            <div className="w-full md:w-64 shrink-0">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 pl-3">Catálogos</h3>
                <nav className="space-y-1">
                    {MENU_CATALOGOS.map((catalogo) => {
                        const isActive = activeTab === catalogo;

                        return (
                            <button
                                key={catalogo}
                                onClick={() => {
                                    setActiveTab(catalogo);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors text-left ${isActive
                                    ? "bg-blue-50 text-corporate-blue font-semibold"
                                    : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                <span>{catalogo}</span>
                                {isActive && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-200/50 text-corporate-blue">
                                        {items.length}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className="flex-1 bg-white rounded-3xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 p-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-corporate-dark">{activeTab}</h2>
                        <p className="text-sm text-gray-500 mt-1">Administra los registros de este catálogo del sistema.</p>
                    </div>
                    {!config.isReadOnly && (
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            className="rounded-full shadow-md px-5 bg-corporate-blue hover:bg-corporate-dark text-sm h-10 cursor-pointer"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Registro
                        </Button>
                    )}
                </div>

                <div className="overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre</th>
                                {!config.isReadOnly && (
                                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right w-44">Estado / Archivar</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={config.isReadOnly ? 1 : 2} className="py-8 text-center text-sm text-gray-500">
                                        Cargando registros...
                                    </td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan={config.isReadOnly ? 1 : 2} className="py-8 text-center text-sm text-gray-500">
                                        No hay registros en este catálogo.
                                    </td>
                                </tr>
                            ) : (
                                items.map((item) => {
                                    const nombreMostrar = item[config.nameKey] || "";
                                    const coreCargo = isCoreCargo(item);

                                    return (
                                        <tr key={item.id} className="group transition-colors hover:bg-gray-50/30">
                                            <td className="py-4 pr-4">
                                                <span className={`text-sm font-medium ${item.archivado ? "text-gray-400 line-through" : "text-gray-700"}`}>
                                                    {nombreMostrar}
                                                </span>
                                                {item.archivado && (
                                                    <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-medium text-gray-600">
                                                        Archivado
                                                    </span>
                                                )}
                                            </td>
                                            {!config.isReadOnly && (
                                                <td className="py-4 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <span className="text-xs text-gray-400">
                                                            {item.archivado ? "Archivado" : "Activo"}
                                                        </span>
                                                        <button
                                                            onClick={() => handleToggleArchivado(item)}
                                                            disabled={coreCargo}
                                                            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                                                                item.archivado ? 'bg-gray-200' : 'bg-corporate-blue'
                                                            }`}
                                                            title={coreCargo ? "Los roles core del sistema no pueden ser archivados" : item.archivado ? "Desarchivar" : "Archivar"}
                                                        >
                                                            <span
                                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                                    item.archivado ? 'translate-x-1' : 'translate-x-4'
                                                                }`}
                                                            />
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <CatalogModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleAddRegistro}
            />
        </div>
    );
}