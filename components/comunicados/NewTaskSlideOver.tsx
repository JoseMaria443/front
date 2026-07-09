"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useDataStore } from "../../store/data.store";
import type { Tarea } from "../../models/comunicado.schema";

interface NewTaskSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    idComunicado: string | null;
}

export function NewTaskSlideOver({ isOpen, onClose, idComunicado }: NewTaskSlideOverProps) {
    const { empleados, estadosTarea, agregarTareaAComunicado } = useDataStore();

    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fechaEntrega, setFechaEntrega] = useState("");
    const [idEstado, setIdEstado] = useState("est1"); // Default to "Pendiente" (est1)
    const [responsablesSeleccionados, setResponsablesSeleccionados] = useState<string[]>([]);
    const [colaboradoresSeleccionados, setColaboradoresSeleccionados] = useState<string[]>([]);

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
            // Remove from collaborators if selected as responsible
            setColaboradoresSeleccionados(colaboradoresSeleccionados.filter(c => c !== id));
        }
    };

    const handleToggleColaborador = (id: string) => {
        if (colaboradoresSeleccionados.includes(id)) {
            setColaboradoresSeleccionados(colaboradoresSeleccionados.filter(c => c !== id));
        } else {
            setColaboradoresSeleccionados([...colaboradoresSeleccionados, id]);
            // Remove from responsables if selected as collaborator
            setResponsablesSeleccionados(responsablesSeleccionados.filter(r => r !== id));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        const estadoSeleccionado = estadosTarea.find(est => est.idEstadoTarea === idEstado);

        const nuevaTarea: Tarea = {
            idTarea: Math.random().toString(),
            idComunicado: idComunicado,
            idEstadoTarea: idEstado,
            resumenActividad: titulo,
            descripcion,
            fechaEntrega: new Date(fechaEntrega).toISOString(),
            fechaRegistro: new Date().toISOString(),
            estado: estadoSeleccionado ? { idEstadoTarea: idEstado, nombre: estadoSeleccionado.nombre } : undefined,
            responsables: responsablesSeleccionados.map(id => {
                const emp = empleados.find(e => e.idEmpleado === id);
                return {
                    idResponsable: id,
                    idRolResponsable: "r1", // Responsable
                    responsable: emp
                };
            }),
            // Since collaborator is not part of the backend schema array, we can encode collaborators
            // in description or just keep them locally in the mock. For display in front-end, let's map them
            // inside description or store them as a mock field if we want (e.g. as custom properties on the mock object).
            // Zod schema doesn't throw if we add extra fields in mock state:
            // Let's add collaborators:
            // @ts-ignore
            colaboradores: colaboradoresSeleccionados.map(id => {
                const emp = empleados.find(e => e.idEmpleado === id);
                return emp;
            }),
            evidencias: []
        };

        agregarTareaAComunicado(idComunicado, nuevaTarea);
        onClose();
        // Reset states
        setTitulo("");
        setDescripcion("");
        setFechaEntrega("");
        setIdEstado("est1");
        setResponsablesSeleccionados([]);
        setColaboradoresSeleccionados([]);
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* SlideOver Panel (1/4 width style, md:w-[450px]) */}
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
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-corporate-accent h-11"
                            value={idEstado}
                            onChange={(e) => setIdEstado(e.target.value)}
                            required
                        >
                            {estadosTarea.map(est => (
                                <option key={est.idEstadoTarea} value={est.idEstadoTarea}>{est.nombre}</option>
                            ))}
                        </select>
                    </div>

                    {/* Responsables (Selección Múltiple) */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 block">
                            Responsables <span className="text-red-500">* (Mínimo 1)</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100 max-h-40 overflow-y-auto">
                            {empleados.map(emp => {
                                const selected = responsablesSeleccionados.includes(emp.idEmpleado);
                                return (
                                    <button
                                        type="button"
                                        key={emp.idEmpleado}
                                        onClick={() => handleToggleResponsable(emp.idEmpleado)}
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

                    {/* Colaboradores (Selección Múltiple) */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 block">
                            Colaboradores (Opcional)
                        </label>
                        <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100 max-h-40 overflow-y-auto">
                            {empleados.map(emp => {
                                const selected = colaboradoresSeleccionados.includes(emp.idEmpleado);
                                const isResp = responsablesSeleccionados.includes(emp.idEmpleado);
                                return (
                                    <button
                                        type="button"
                                        key={emp.idEmpleado}
                                        onClick={() => handleToggleColaborador(emp.idEmpleado)}
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
                        disabled={!isFormValid}
                        className={`w-1/2 py-5 text-sm rounded-xl font-semibold transition-all duration-200 ${
                            isFormValid
                                ? "bg-corporate-accent hover:bg-corporate-blue text-white cursor-pointer"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                        Agregar
                    </Button>
                </div>
            </form>
        </div>
    );
}
