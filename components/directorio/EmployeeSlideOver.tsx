"use client";

import { useState } from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const CARGOS_DISPONIBLES = [
    "Docente", "Coordinador", "Jefe de División",
    "Administrador", "Tutor", "Asesor de Movilidad"
];

interface EmployeeSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    areas: string[];
    onSave: (empleado: any) => void;
}

export function EmployeeSlideOver({ isOpen, onClose, areas, onSave }: EmployeeSlideOverProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [formData, setFormData] = useState({
        nombre: "",
        correo: "",
        area: "",
        cargos: [] as string[]
    });

    if (!isOpen) return null;

    const toggleCargo = (cargo: string) => {
        setFormData(prev => ({
            ...prev,
            cargos: prev.cargos.includes(cargo)
                ? prev.cargos.filter(c => c !== cargo)
                : [...prev.cargos, cargo]
        }));
    };

    const isFormValid = formData.nombre && formData.correo && formData.area && formData.cargos.length > 0;

    const handleSave = () => {
        if (!isFormValid) return;

        const iniciales = formData.nombre.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();

        onSave({
            id: Date.now(),
            ...formData,
            iniciales,
            activo: true
        });

        // resetear el formulario mock
        setFormData({ nombre: "", correo: "", area: "", cargos: [] });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className={`relative bg-white shadow-2xl transition-all duration-300 ease-in-out flex flex-col h-full ${isExpanded ? "w-full" : "w-full md:w-[450px]"}`}>
                <div className="flex items-start justify-between border-b border-gray-100 p-6">
                    <div>
                        <h2 className="text-xl font-bold text-corporate-dark">Nuevo Empleado</h2>
                        <p className="text-sm text-gray-500 mt-1">Registra un nuevo docente o coordinador</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 text-gray-400 hover:text-corporate-dark hover:bg-gray-50 rounded-full">
                            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                        </button>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">Nombre Completo <span className="text-red-500">*</span></label>
                        <Input
                            placeholder="Ej. Dr. Apellido Apellido, Nombre" className="h-11"
                            value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">Correo Institucional <span className="text-red-500">*</span></label>
                        <Input
                            placeholder="usuario@universidad.edu.mx" type="email" className="h-11"
                            value={formData.correo} onChange={e => setFormData({ ...formData, correo: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">Área <span className="text-red-500">*</span></label>
                        <select
                            className="w-full h-11 rounded-md border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-corporate-accent"
                            value={formData.area}
                            onChange={e => setFormData({ ...formData, area: e.target.value })}
                        >
                            <option value="" disabled>— Seleccionar área —</option>
                            {areas.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-700">Cargos <span className="text-red-500">*</span></label>
                        <div className="flex flex-wrap gap-2">
                            {CARGOS_DISPONIBLES.map(cargo => (
                                <button
                                    key={cargo}
                                    onClick={() => toggleCargo(cargo)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${formData.cargos.includes(cargo)
                                            ? 'bg-corporate-blue text-white border-corporate-blue shadow-sm'
                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {cargo}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 p-6 bg-white">
                    <Button
                        onClick={handleSave} disabled={!isFormValid}
                        className={`w-full py-6 text-sm rounded-xl font-semibold ${isFormValid ? "bg-corporate-blue text-white hover:bg-corporate-dark shadow-md" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        Crear Empleado
                    </Button>
                </div>
            </div>
        </div>
    );
}