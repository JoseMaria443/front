"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { api } from "../../services/api.config";

interface NewTaskSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    idComunicado: string | null;
    onSuccess?: () => void;
}

export function NewTaskSlideOver({ isOpen, onClose, idComunicado, onSuccess }: NewTaskSlideOverProps) {
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fechaEntrega, setFechaEntrega] = useState("");
    const [responsablesSeleccionados, setResponsablesSeleccionados] = useState<string[]>([]);
    const [colaboradoresSeleccionados, setColaboradoresSeleccionados] = useState<string[]>([]);

    // Employees list from API
    const [empleadosList, setEmpleadosList] = useState<any[]>([]);
    const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isOpen) return;
        setIsLoadingEmployees(true);
        setError("");
        api.get<any[]>('/api/empleado/?activo=true')
            .then(res => {
                setEmpleadosList(res.data);
            })
            .catch(err => {
                console.error("Error loading employees:", err);
                setError("Error al cargar la lista de empleados.");
            })
            .finally(() => {
                setIsLoadingEmployees(false);
            });
    }, [isOpen]);

    if (!isOpen || !idComunicado) return null;

    const isFormValid =
        titulo.trim() !== "" &&
        descripcion.trim() !== "" &&
        fechaEntrega !== "" &&
        responsablesSeleccionados.length > 0;

    const handleToggleResponsable = (id: string) => {
        if (responsablesSeleccionados.includes(id)) {
            setResponsablesSeleccionados(responsablesSeleccionados.filter(r => r !== id));
        } else {
            setResponsablesSeleccionados([...responsablesSeleccionados, id]);
            setColaboradoresSeleccionados(colaboradoresSeleccionados.filter(c => c !== id));
        }
    };

    const handleToggleColaborador = (id: string) => {
        if (colaboradoresSeleccionados.includes(id)) {
            setColaboradoresSeleccionados(colaboradoresSeleccionados.filter(c => c !== id));
        } else {
            setColaboradoresSeleccionados([...colaboradoresSeleccionados, id]);
            setResponsablesSeleccionados(responsablesSeleccionados.filter(r => r !== id));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid || isSubmitting) return;

        setIsSubmitting(true);
        setError("");

        const payload = {
            idComunicado,
            resumenActividad: titulo,
            descripcion,
            fechaEntrega: new Date(fechaEntrega).toISOString(),
            responsables: responsablesSeleccionados,
            colaboradores: colaboradoresSeleccionados
        };

        try {
            await api.post('/tareas/', payload);

            // Clean inputs
            setTitulo("");
            setDescripcion("");
            setFechaEntrega("");
            setResponsablesSeleccionados([]);
            setColaboradoresSeleccionados([]);

            if (onSuccess) {
                onSuccess();
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || err.response?.data?.detail || "Error al agregar la tarea.";
            setError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div
                className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <form onSubmit={handleSubmit} className="relative bg-white shadow-2xl transition-all duration-300 ease-in-out flex flex-col h-full w-full md:w-[450px]">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-gray-100 p-6">
                    <div>
                        <h2 className="text-xl font-bold text-corporate-dark">Agregar Tarea</h2>
                        <p className="text-xs text-gray-500 mt-1">Crea una nueva tarea asignada a este comunicado</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 text-sm">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-semibold">
                            {error}
                        </div>
                    )}
                    {isLoadingEmployees && (
                        <div className="text-center py-2 text-xs text-gray-500">
                            Cargando empleados del sistema...
                        </div>
                    )}

                    {/* Título de la Tarea */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">
                            Título / Resumen <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="Ej. Actualizar plan curricular 2026"
                            className="h-11 bg-white"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            required
                        />
                    </div>

                    {/* Descripción de la Tarea */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">
                            Descripción Detallada <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-corporate-accent resize-none h-24"
                            placeholder="Especifica los entregables, pautas y requisitos de esta tarea..."
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            required
                        />
                    </div>

                    {/* Fecha de Entrega */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">
                            Fecha Límite <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="datetime-local"
                            className="h-11 bg-white"
                            value={fechaEntrega}
                            onChange={(e) => setFechaEntrega(e.target.value)}
                            required
                        />
                    </div>

                    {/* Estado */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">
                            Estado Inicial <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-corporate-accent h-11 cursor-not-allowed text-gray-500"
                            value="asignada"
                            disabled
                        >
                            <option value="asignada">Asignada</option>
                        </select>
                    </div>

                    {/* Responsables */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 block">
                            Responsables <span className="text-red-500">* (Mínimo 1)</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100 max-h-40 overflow-y-auto">
                            {empleadosList.map(emp => {
                                const selected = responsablesSeleccionados.includes(emp.id);
                                return (
                                    <button
                                        type="button"
                                        key={emp.id}
                                        onClick={() => handleToggleResponsable(emp.id)}
                                        className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                                            selected
                                                ? "bg-blue-50 border-corporate-accent text-corporate-blue font-semibold"
                                                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                                        }`}
                                    >
                                        <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[10px] ${
                                            selected ? "border-corporate-accent bg-corporate-accent text-white" : "border-gray-300"
                                        }`}>
                                            {selected && "✓"}
                                        </div>
                                        <span className="truncate text-xs">{emp.nombre}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Colaboradores */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 block">
                            Colaboradores (Opcional)
                        </label>
                        <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100 max-h-40 overflow-y-auto">
                            {empleadosList.map(emp => {
                                const selected = colaboradoresSeleccionados.includes(emp.id);
                                const isResp = responsablesSeleccionados.includes(emp.id);
                                return (
                                    <button
                                        type="button"
                                        key={emp.id}
                                        onClick={() => handleToggleColaborador(emp.id)}
                                        disabled={isResp}
                                        className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                                            selected
                                                ? "bg-purple-50 border-purple-400 text-purple-700 font-semibold"
                                                : isResp
                                                ? "bg-gray-100 border-gray-100 text-gray-300 cursor-not-allowed"
                                                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                                        }`}
                                    >
                                        <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[10px] ${
                                            selected ? "border-purple-500 bg-purple-500 text-white" : "border-gray-300"
                                        }`}>
                                            {selected && "✓"}
                                        </div>
                                        <span className="truncate text-xs">{emp.nombre}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 p-6 bg-white flex gap-3">
                    <Button
                        type="button"
                        onClick={onClose}
                        className="w-1/2 py-5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-semibold"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={!isFormValid || isSubmitting}
                        className={`w-1/2 py-5 text-sm rounded-xl font-semibold transition-all duration-200 ${
                            isFormValid && !isSubmitting
                                ? "bg-corporate-accent hover:bg-corporate-blue text-white cursor-pointer"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                        {isSubmitting ? "Agregando..." : "Agregar"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
