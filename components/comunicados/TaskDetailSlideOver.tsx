"use client";

import { X, Calendar } from "lucide-react";
import type { Tarea } from "../../models/comunicado.schema";

interface TaskDetailSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    task: Tarea | null;
}

const getEstadoBadge = (estado?: string) => {
    switch (estado) {
        case "Completada":
            return "bg-emerald-50 text-emerald-600 border-emerald-100";
        case "En Progreso":
            return "bg-amber-50 text-amber-600 border-amber-100";
        default:
            return "bg-slate-50 text-slate-500 border-slate-200";
    }
};

const getInitials = (nombre?: string) => {
    if (!nombre) return "U";
    return nombre.split(' ').filter(n => n.length > 0).map(n => n[0]).join('').slice(0, 2).toUpperCase();
};

export function TaskDetailSlideOver({ isOpen, onClose, task }: TaskDetailSlideOverProps) {
    if (!isOpen || !task) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div
                className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative bg-white shadow-2xl transition-all duration-300 ease-in-out flex flex-col h-full w-full md:w-[450px]">
                <div className="flex items-start justify-between border-b border-gray-100 p-6">
                    <div>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-corporate-accent bg-blue-50 px-2.5 py-1 rounded-full">
                            Detalle de Tarea
                        </span>
                        <h2 className="text-xl font-bold text-corporate-dark mt-2">
                            {task.resumenActividad}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
                    <div className="space-y-1">
                        <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Descripción</span>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed text-xs">
                            {task.descripcion}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                        <div className="space-y-1">
                            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</span>
                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${getEstadoBadge(task.estado?.nombre)}`}>
                                {task.estado?.nombre || "Pendiente"}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha Límite</span>
                            <span className="flex items-center gap-1.5 text-gray-600 text-xs font-medium">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                {new Date(task.fechaEntrega).toLocaleDateString('es-MX', {
                                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2 border-t border-gray-100 pt-4">
                        <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Responsables</span>
                        <div className="space-y-2">
                            {task.responsables?.map((r, i) => (
                                <div key={i} className="flex items-center gap-2.5 bg-gray-50 p-2 rounded-xl border border-gray-100">
                                    <div className="w-8 h-8 rounded-full bg-corporate-blue text-white text-xs font-bold flex items-center justify-center">
                                        {getInitials(r.responsable?.nombre)}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-corporate-dark">{r.responsable?.nombre}</p>
                                        <p className="text-[10px] text-gray-400">{r.responsable?.email}</p>
                                    </div>
                                </div>
                            ))}
                            {(!task.responsables || task.responsables.length === 0) && (
                                <p className="text-xs text-gray-400 italic">Sin responsables asignados</p>
                            )}
                        </div>
                    </div>

                    {/* @ts-ignore */}
                    {task.colaboradores && task.colaboradores.length > 0 && (
                        <div className="space-y-2 border-t border-gray-100 pt-4">
                            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Colaboradores</span>
                            <div className="space-y-2">
                                {/* @ts-ignore */}
                                {task.colaboradores.map((colab, i) => (
                                    <div key={i} className="flex items-center gap-2.5 bg-gray-50 p-2 rounded-xl border border-gray-100">
                                        <div className="w-8 h-8 rounded-full bg-purple-500 text-white text-xs font-bold flex items-center justify-center">
                                            {getInitials(colab.nombre)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-corporate-dark">{colab.nombre}</p>
                                            <p className="text-[10px] text-gray-400">{colab.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-100 p-6 bg-gray-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-corporate-blue text-white rounded-lg text-xs font-semibold hover:bg-corporate-dark transition-colors"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
}
