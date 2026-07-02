"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { CatalogModal } from "../../../components/configuracion/CatalogModal";

interface CatalogoItem {
    id: number;
    nombre: string;
}

const INITIAL_MOCKS: Record<string, CatalogoItem[]> = {
    "Cargos": [
        { id: 1, nombre: "Docente" },
        { id: 2, nombre: "Coordinador" },
        { id: 3, nombre: "Jefe de División" },
        { id: 4, nombre: "Administrador" },
        { id: 5, nombre: "Tutor" },
        { id: 6, nombre: "Asesor de Movilidad" },
    ],
    "Tipos de Comunicado": [
        { id: 1, nombre: "Informativo" },
        { id: 2, nombre: "Acción" },
        { id: 3, nombre: "Saliente" },
    ],
    "Medios de Recepción": [
        { id: 1, nombre: "Oficio Físico" },
        { id: 2, nombre: "Correo Electrónico" },
        { id: 3, nombre: "Sistema SICEEA" },
        { id: 4, nombre: "WhatsApp" },
    ],
    "Roles de Destinatario": [
        { id: 1, nombre: "Principal" },
        { id: 2, nombre: "Copia (CC)" },
        { id: 3, nombre: "Copia Oculta (CCO)" },
        { id: 4, nombre: "Informativo" },
    ],
    "Roles de Responsable": [
        { id: 1, nombre: "Titular" },
        { id: 2, nombre: "Apoyo" },
        { id: 3, nombre: "Supervisor" },
    ],
    "Estados de Tarea": [
        { id: 1, nombre: "Pendiente" },
        { id: 2, nombre: "En Progreso" },
        { id: 3, nombre: "Completada" },
        { id: 4, nombre: "Cancelada" },
    ],
};

const MENU_CATALOGOS = Object.keys(INITIAL_MOCKS);

export default function ConfiguracionPage() {
    const [catalogos, setCatalogos] = useState(INITIAL_MOCKS);
    const [activeTab, setActiveTab] = useState<string>(MENU_CATALOGOS[0]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState("");

    const itemsActuales = catalogos[activeTab];


    const handleAddRegistro = (nombre: string) => {
        const nuevoId = Date.now();
        setCatalogos(prev => ({
            ...prev,
            [activeTab]: [...prev[activeTab], { id: nuevoId, nombre }]
        }));
    };

    const handleDelete = (id: number) => {
        setCatalogos(prev => ({
            ...prev,
            [activeTab]: prev[activeTab].filter(item => item.id !== id)
        }));
    };

    const startEditing = (item: CatalogoItem) => {
        setEditingId(item.id);
        setEditValue(item.nombre);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditValue("");
    };

    const saveEditing = () => {
        if (editValue.trim() === "") return;
        setCatalogos(prev => ({
            ...prev,
            [activeTab]: prev[activeTab].map(item =>
                item.id === editingId ? { ...item, nombre: editValue.trim() } : item
            )
        }));
        cancelEditing();
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 h-full min-h-[calc(100vh-8rem)]">

            <div className="w-full md:w-64 shrink-0">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 pl-3">Catálogos</h3>
                <nav className="space-y-1">
                    {MENU_CATALOGOS.map((catalogo) => {
                        const isActive = activeTab === catalogo;
                        const count = catalogos[catalogo].length;

                        return (
                            <button
                                key={catalogo}
                                onClick={() => {
                                    setActiveTab(catalogo);
                                    cancelEditing();
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors ${isActive
                                    ? "bg-blue-50 text-corporate-blue font-semibold"
                                    : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                <span>{catalogo}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? "bg-blue-200/50 text-corporate-blue" : "bg-gray-100 text-gray-500"
                                    }`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className="flex-1 bg-white rounded-3xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 p-8">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-corporate-dark">{activeTab}</h2>
                        <p className="text-sm text-gray-500 mt-1">Administra los registros de este catálogo del sistema.</p>
                    </div>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="rounded-full shadow-md px-5 bg-corporate-blue hover:bg-corporate-dark text-sm h-10"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Registro
                    </Button>
                </div>

                <div className="overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre</th>
                                <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right w-32">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {itemsActuales.map((item) => {
                                const isEditing = editingId === item.id;

                                return (
                                    <tr key={item.id} className="group transition-colors hover:bg-gray-50/30">
                                        <td className="py-4 pr-4">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && saveEditing()}
                                                    className="w-full rounded-lg border border-corporate-blue bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-corporate-blue/20"
                                                    autoFocus
                                                />
                                            ) : (
                                                <span className="text-sm font-medium text-gray-700">{item.nombre}</span>
                                            )}
                                        </td>
                                        <td className="py-4 text-right">
                                            {isEditing ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={saveEditing}
                                                        className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md hover:bg-emerald-100 transition-colors"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={cancelEditing}
                                                        className="p-1.5 bg-gray-100 text-gray-500 rounded-md hover:bg-gray-200 transition-colors"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => startEditing(item)}
                                                        className="p-1.5 bg-blue-50 text-corporate-blue rounded-md hover:bg-blue-100 transition-colors"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-1.5 bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {itemsActuales.length === 0 && (
                                <tr>
                                    <td colSpan={2} className="py-8 text-center text-sm text-gray-500">
                                        No hay registros en este catálogo.
                                    </td>
                                </tr>
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