"use client";

import { useState } from "react";
import { X, Calendar, UploadCloud, AlertTriangle } from "lucide-react";
import type { Tarea } from "../../models/comunicado.schema";
import { EvidenciaDetailSlideOver } from "./EvidenciaDetailSlideOver";
import { useSessionStore } from "../../store/session.store";
import { api } from "../../services/api.config";
import { Button } from "../ui/Button";

interface TaskDetailSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    task: Tarea | null;
    onRefreshNeeded?: () => void;
    onUploadEvidence?: (task: Tarea) => void;
}

const getEstadoColorClasses = (estado?: string) => {
    const est = (estado || "asignada").toLowerCase();
    switch (est) {
        case "en proceso":
            return {
                badge: "bg-amber-50 text-amber-600 border-amber-100",
                border: "border-l-amber-500"
            };
        case "entregada":
            return {
                badge: "bg-indigo-50 text-indigo-600 border-indigo-100",
                border: "border-l-indigo-500"
            };
        case "revisada":
            return {
                badge: "bg-emerald-50 text-emerald-600 border-emerald-100",
                border: "border-l-emerald-500"
            };
        case "rechazada":
            return {
                badge: "bg-red-50 text-red-600 border-red-100",
                border: "border-l-red-500"
            };
        case "vencida":
            return {
                badge: "bg-orange-50 text-orange-600 border-orange-100",
                border: "border-l-orange-500"
            };
        case "cancelada":
            return {
                badge: "bg-gray-50 text-gray-500 border-gray-200",
                border: "border-l-gray-400"
            };
        case "asignada":
        default:
            return {
                badge: "bg-slate-50 text-slate-500 border-slate-200",
                border: "border-l-slate-400"
            };
    }
};

const getInitials = (nombre?: string) => {
    if (!nombre) return "U";
    return nombre.split(' ').filter(n => n.length > 0).map(n => n[0]).join('').slice(0, 2).toUpperCase();
};

export function TaskDetailSlideOver({ isOpen, onClose, task, onRefreshNeeded, onUploadEvidence }: TaskDetailSlideOverProps) {
    const [selectedEvidenceForDetail, setSelectedEvidenceForDetail] = useState<any | null>(null);
    const [isEvidenceDetailOpen, setIsEvidenceDetailOpen] = useState(false);
    
    // Actions states
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionError, setActionError] = useState("");

    const currentUser = useSessionStore(state => state.user);

    const handleOpenEvidenceDetail = (ev: any, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedEvidenceForDetail(ev);
        setIsEvidenceDetailOpen(true);
    };

    if (!isOpen || !task) return null;

    // RBAC
    const roles = currentUser?.cargos_nombres || [];
    const isDirector = roles.some((r: any) => typeof r === 'string' && r.toLowerCase().includes('director'));
    const estadoNombre = typeof task.estado === 'string' ? task.estado : (task.estado?.nombre || "Asignada");
    const estadoName = estadoNombre.toLowerCase();
    const isTerminal = ['revisada', 'cancelada'].includes(estadoName);
    const isAsignada = estadoName === "asignada";
    const showUploadButton = ['en proceso', 'en-proceso', 'rechazada', 'vencida'].includes(estadoName);

    const estadoClasses = getEstadoColorClasses(estadoNombre);

    const handleApprove = async () => {
        setIsSubmitting(true);
        setActionError("");
        try {
            await api.patch(`/tareas/${task.idTarea}/revisar`);
            if (onRefreshNeeded) onRefreshNeeded();
            onClose();
        } catch (err: any) {
            console.error("Error approving task:", err);
            setActionError(err.response?.data?.message || err.response?.data?.detail || "No se pudo aprobar la tarea.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = async () => {
        setIsSubmitting(true);
        setActionError("");
        try {
            await api.patch(`/tareas/${task.idTarea}/rechazar`);
            if (onRefreshNeeded) onRefreshNeeded();
            onClose();
        } catch (err: any) {
            console.error("Error rejecting task:", err);
            setActionError(err.response?.data?.message || err.response?.data?.detail || "No se pudo rechazar la tarea.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStartTask = async () => {
        setIsSubmitting(true);
        setActionError("");
        try {
            await api.patch(`/tareas/${task.idTarea}/en-proceso`);
            if (onRefreshNeeded) onRefreshNeeded();
        } catch (err: any) {
            console.error("Error starting task:", err);
            setActionError(err.response?.data?.message || err.response?.data?.detail || "No se pudo comenzar la tarea.");
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

            <div className={`relative bg-white shadow-2xl transition-all duration-300 ease-in-out flex flex-col h-full w-full md:w-[450px] border-l-4 ${estadoClasses.border}`}>
                <div className="flex items-start justify-between border-b border-gray-100 p-6 shrink-0">
                    <div>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-corporate-accent bg-blue-50 px-2.5 py-1 rounded-full">
                            Detalle de Tarea
                        </span>
                        <h2 className="text-xl font-bold text-corporate-dark mt-2">
                            {task.resumenActividad}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        {showUploadButton && onUploadEvidence && (
                            <button
                                onClick={() => onUploadEvidence(task)}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-corporate-accent hover:text-corporate-blue transition-colors bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm cursor-pointer"
                            >
                                <UploadCloud className="h-3.5 w-3.5" />
                                Subir Evidencia
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
                    {actionError && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-100 text-xs font-semibold flex items-start gap-2 animate-in fade-in duration-200">
                            <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                            <span>{actionError}</span>
                        </div>
                    )}

                    <div className="space-y-1">
                        <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Descripción</span>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed text-xs">
                            {task.descripcion}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                        <div className="space-y-1">
                            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</span>
                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${estadoClasses.badge}`}>
                                {estadoNombre}
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
                        <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Personal Asignado</span>
                        <div className="space-y-2">
                            {task.responsables?.map((r, i) => (
                                <div key={`resp-${i}`} className="flex items-center justify-between gap-2.5 bg-gray-50 p-2 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-corporate-blue text-white text-xs font-bold flex items-center justify-center shrink-0">
                                            {getInitials(r.responsable?.nombre)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-corporate-dark">{r.responsable?.nombre}</p>
                                            <p className="text-[10px] text-gray-400">{r.responsable?.email}</p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-2.5 py-0.5 text-[9px] font-bold shrink-0">
                                        Responsable
                                    </span>
                                </div>
                            ))}
                            {/* @ts-ignore */}
                            {task.colaboradores?.map((colab, i) => (
                                <div key={`colab-${i}`} className="flex items-center justify-between gap-2.5 bg-gray-50 p-2 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-purple-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                                            {getInitials(colab.nombre)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-corporate-dark">{colab.nombre}</p>
                                            <p className="text-[10px] text-gray-400">{colab.email}</p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-600 px-2.5 py-0.5 text-[9px] font-bold shrink-0">
                                        Colaborador
                                    </span>
                                </div>
                            ))}
                            {(!task.responsables || task.responsables.length === 0) && (!task.colaboradores || task.colaboradores.length === 0) && (
                                <p className="text-xs text-gray-400 italic">Sin personal asignado</p>
                            )}
                        </div>
                    </div>

                    {/* Evidencias en SlideOver de Detalles */}
                    {task.evidencias && task.evidencias.length > 0 && (
                        <div className="space-y-2 border-t border-gray-100 pt-4">
                            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Evidencias Cargadas</span>
                            <div className="space-y-2">
                                {task.evidencias.map((ev, idx) => (
                                    <button 
                                        key={ev.idArchivoEvidencia || idx} 
                                        type="button"
                                        onClick={(e) => handleOpenEvidenceDetail(ev, e)}
                                        className="bg-slate-50 border border-slate-100 p-3 rounded-lg flex items-center justify-between gap-3 shadow-sm hover:bg-slate-100/80 hover:border-slate-200/80 transition-colors w-full text-left cursor-pointer"
                                    >
                                        <div className="truncate pr-2 flex-1">
                                            <p className="text-xs font-bold text-corporate-dark truncate">{ev.nombreOriginal}</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">
                                                DOI: <span className="font-semibold text-corporate-accent">{ev.doi}</span> · {new Date(ev.fechaRegistro).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div
                                            className="inline-flex items-center justify-center p-2 rounded-lg bg-white border border-gray-200 text-corporate-accent transition-colors shadow-sm"
                                            title="Ver detalles de evidencia"
                                        >
                                            <UploadCloud className="h-4 w-4" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions Footer for Director on Entregada task */}
                {estadoName === "entregada" && isDirector ? (
                    <div className="bg-slate-50 px-6 py-5 border-t border-gray-100 flex items-center justify-between gap-3 shrink-0">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Evaluación</span>
                            <span className="text-[11px] text-gray-500">¿Aprobar o rechazar entrega?</span>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={handleReject}
                                disabled={isSubmitting}
                                className="px-4 py-2 border border-red-200 text-red-600 bg-white hover:bg-red-50 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                            >
                                {isSubmitting ? "Cargando..." : "Rechazar"}
                            </Button>
                            <Button
                                onClick={handleApprove}
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                            >
                                {isSubmitting ? "Cargando..." : "Aprobar"}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="border-t border-gray-100 p-6 bg-gray-50 flex justify-end shrink-0 gap-3">
                        {isAsignada && (
                            <Button
                                onClick={handleStartTask}
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                            >
                                {isSubmitting ? "Cargando..." : "Comenzar Tarea"}
                            </Button>
                        )}
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-corporate-blue text-white rounded-lg text-xs font-semibold hover:bg-corporate-dark transition-colors"
                        >
                            Entendido
                        </button>
                    </div>
                )}
            </div>

            <EvidenciaDetailSlideOver
                isOpen={isEvidenceDetailOpen}
                onClose={() => setIsEvidenceDetailOpen(false)}
                evidencia={selectedEvidenceForDetail}
            />
        </div>
    );
}
