// backdropblur y formulario de subida para evidencias
"use client";

import { useState, useEffect } from "react";
import { X, Maximize2, Minimize2, UploadCloud, Info, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { EvidenciaDetailSlideOver } from "../comunicados/EvidenciaDetailSlideOver";

interface EvidenceSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    task: any; // Can accept Tarea or MockTask for backward compatibility
    onSuccess?: (evs: { doi: string; descripcion: string; urlArchivo: string; nombreOriginal: string; fechaRegistro: string }[]) => void;
}

interface EvidenceFormState {
    id: string;
    doi: string;
    description: string;
    fileName: string | null;
}

export function EvidenceSlideOver({ isOpen, onClose, task, onSuccess }: EvidenceSlideOverProps) {
    const tarea = task;
    const [isExpanded, setIsExpanded] = useState(false);
    const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
    const [selectedEvidenceForDetail, setSelectedEvidenceForDetail] = useState<any | null>(null);
    const [isEvidenceDetailOpen, setIsEvidenceDetailOpen] = useState(false);
    const [evidences, setEvidences] = useState<EvidenceFormState[]>([
        { id: Math.random().toString(), doi: "", description: "", fileName: null }
    ]);

    useEffect(() => {
        if (isOpen) {
            setEvidences([
                { id: Math.random().toString(), doi: "", description: "", fileName: null }
            ]);
        }
    }, [isOpen, task]);

    const addEvidence = () => {
        setEvidences([
            ...evidences,
            { id: Math.random().toString(), doi: "", description: "", fileName: null }
        ]);
    };

    const removeEvidence = (id: string) => {
        if (evidences.length > 1) {
            setEvidences(evidences.filter(e => e.id !== id));
        }
    };

    const updateEvidence = (id: string, updates: Partial<EvidenceFormState>) => {
        setEvidences(evidences.map(e => e.id === id ? { ...e, ...updates } : e));
    };

    const isValid = evidences.every(ev => ev.doi.trim() !== "" && ev.description.trim() !== "" && ev.fileName !== null);

    if (!isOpen) return null;

    // Adapt fields dynamically for Tarea (API) vs MockTask
    const titleToShow = task?.resumenActividad || task?.title || "Detalle de Tarea";
    const descriptionToShow = task?.descripcion || "Sin descripción disponible.";
    const limitDateToShow = task?.fechaEntrega 
        ? new Date(task.fechaEntrega).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
        : (task?.date || "N/A");
    const statusToShow = task?.estado?.nombre || task?.status || "Asignada";
    const codeToShow = task?.idTarea ? task.idTarea.slice(0, 8) : (task?.code || "N/A");
    const taskCodeToShow = task?.idTarea ? task.idTarea.slice(0, 5).toUpperCase() : (task?.taskCode || "N/A");

    return (
        <>
            <div className="fixed inset-0 z-50 flex justify-end">
                <div
                    className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />

                <div
                    className={`relative bg-white shadow-2xl transition-all duration-300 ease-in-out flex flex-col h-full ${
                        isExpanded ? "w-full" : "w-full md:w-[500px]"
                    }`}
                >
                    <div className="flex items-start justify-between border-b border-gray-100 p-6">
                        <div>
                            <h2 className="text-xl font-bold text-corporate-dark">Subir Evidencia</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {codeToShow} · {taskCodeToShow} — {titleToShow}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="p-2 text-gray-400 hover:text-corporate-dark hover:bg-gray-50 rounded-full transition-colors"
                            >
                                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* tarjeta de vinculación de tarea */}
                        <div
                            onClick={() => setIsTaskDetailOpen(true)}
                            className="relative bg-gray-50 border border-gray-100 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200 group"
                        >
                            <div className="absolute top-4 right-4 text-gray-400 group-hover:text-corporate-dark transition-colors">
                                <Info className="h-4 w-4" />
                            </div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Tarea vinculada</p>
                            <p className="font-semibold text-corporate-dark text-sm mb-2 pr-6">{titleToShow}</p>
                            <div className="flex items-center gap-3 text-xs">
                                <span className="text-corporate-accent font-medium">{codeToShow}</span>
                                <span className="text-corporate-blue bg-blue-50 px-2 py-0.5 rounded-full">{statusToShow}</span>
                            </div>
                        </div>

                        {/* listado de formularios de evidencia */}
                        <div className="space-y-6">
                            {evidences.map((ev, index) => (
                                <div
                                    key={ev.id}
                                    className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 space-y-4 shadow-sm relative animate-in fade-in slide-in-from-bottom-2 duration-200"
                                >
                                    <div className="flex items-center justify-between border-b border-slate-100/50 pb-2.5">
                                        <h3 className="text-xs font-bold text-corporate-dark flex items-center gap-2">
                                            <span className="flex items-center justify-center bg-corporate-blue text-white text-[10px] w-5 h-5 rounded-full font-bold">
                                                {index + 1}
                                            </span>
                                            Evidencia a Registrar
                                        </h3>
                                        {evidences.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeEvidence(ev.id)}
                                                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-semibold p-1 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                Eliminar
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-700">
                                            DOI del Archivo <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            placeholder="Ej. EVD-2026-0001"
                                            className="h-11 bg-white"
                                            value={ev.doi}
                                            onChange={(e) => updateEvidence(ev.id, { doi: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-700">
                                            Descripción <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-corporate-accent resize-none h-32"
                                            placeholder="Describe la actividad documentada..."
                                            value={ev.description}
                                            onChange={(e) => updateEvidence(ev.id, { description: e.target.value.slice(0, 500) })}
                                        />
                                        <div className="text-right text-[10px] text-gray-400 font-medium">
                                            {ev.description.length} / 500
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-700">
                                            Archivo de Evidencia <span className="text-red-500">*</span>
                                        </label>
                                        {ev.fileName ? (
                                            <div className="border border-green-200 bg-green-50/30 rounded-xl p-4 flex items-center justify-between animate-in fade-in duration-150">
                                                <div className="flex items-center gap-2">
                                                    <UploadCloud className="h-5 w-5 text-emerald-600 animate-pulse" />
                                                    <div>
                                                        <p className="text-xs font-semibold text-corporate-dark truncate max-w-[200px] md:max-w-[280px]">
                                                            {ev.fileName}
                                                        </p>
                                                        <p className="text-[10px] text-gray-500">Listo para subir</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => updateEvidence(ev.id, { fileName: null })}
                                                    className="text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 p-1 rounded transition-colors cursor-pointer"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => updateEvidence(ev.id, { fileName: `evidencia_${codeToShow || 'COM'}_${index + 1}.pdf` })}
                                                className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer group/upload"
                                            >
                                                <UploadCloud className="h-8 w-8 text-corporate-blue mb-3 group-hover/upload:scale-110 transition-transform" />
                                                <p className="text-xs font-semibold text-corporate-dark">Simular subida de archivo (Haz clic aquí)</p>
                                                <p className="text-[10px] text-gray-500 mt-1">Un archivo · PDF, imagen, video · Máx. 50 MB</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={addEvidence}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-corporate-accent/30 text-corporate-accent hover:border-corporate-accent hover:bg-blue-50/30 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer"
                        >
                            <Plus className="h-4 w-4" />
                            Agregar otra evidencia para esta tarea
                        </button>
                    </div>

                    <div className="border-t border-gray-100 p-6 bg-white">
                        {isValid ? (
                            <Button
                                onClick={() => {
                                    if (onSuccess) {
                                        onSuccess(
                                            evidences.map((e) => ({
                                                doi: e.doi,
                                                descripcion: e.description,
                                                urlArchivo: "https://simulacion-cloudinary.com/evidencia.pdf",
                                                nombreOriginal: e.fileName || "evidencia.pdf",
                                                fechaRegistro: new Date().toISOString()
                                            }))
                                        );
                                    } else {
                                        alert(`¡Éxito! Se han registrado ${evidences.length} evidencias.`);
                                    }
                                    onClose();
                                }}
                                className="w-full py-6 text-sm bg-corporate-accent hover:bg-corporate-blue text-white rounded-xl font-semibold transition-all duration-200 cursor-pointer"
                            >
                                <UploadCloud className="h-4 w-4 mr-2" />
                                Registrar {evidences.length} Evidencia{evidences.length > 1 ? "s" : ""}
                            </Button>
                        ) : (
                            <Button className="w-full py-6 text-sm bg-gray-100 text-gray-400 hover:bg-gray-100 cursor-not-allowed rounded-xl font-semibold">
                                <UploadCloud className="h-4 w-4 mr-2" />
                                Registrar Evidencia
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {isTaskDetailOpen && (() => {
                console.log("Evidencias en Modal Mis Tareas:", tarea?.evidencias);
                return (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                            onClick={() => setIsTaskDetailOpen(false)}
                        />

                        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all border border-gray-100 flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-start justify-between p-5 border-b border-gray-100">
                                <div>
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-corporate-accent bg-blue-50 px-2.5 py-1 rounded-full">
                                        Detalle de Tarea
                                    </span>
                                    <h3 className="text-lg font-bold text-corporate-dark mt-2">
                                        {titleToShow}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setIsTaskDetailOpen(false)}
                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="p-5 space-y-4 text-sm max-h-[60vh] overflow-y-auto">
                                <div className="space-y-1">
                                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Descripción</span>
                                    <p className="text-gray-600 leading-relaxed text-xs bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        {descriptionToShow}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-1">
                                    <div>
                                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fecha Límite</span>
                                        <span className="text-gray-600 text-xs font-medium block mt-1">
                                            {limitDateToShow}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Estado</span>
                                        <span className="inline-flex items-center text-xs font-semibold text-corporate-blue bg-blue-50 px-2 py-0.5 rounded-full mt-1">
                                            {statusToShow}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2 border-t border-gray-100 pt-3.5">
                                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Responsables</span>
                                    <div className="space-y-2 mt-1">
                                        {tarea?.responsables?.map((r: any, i: number) => (
                                            <div key={i} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                                <div>
                                                    <p className="text-xs font-bold text-corporate-dark">{r.responsable?.nombre || "Responsable"}</p>
                                                    <p className="text-[10px] text-gray-400">{r.responsable?.email || ""}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {(!tarea?.responsables || tarea?.responsables.length === 0) && (
                                            <p className="text-xs text-gray-400 italic">Sin responsables asignados</p>
                                        )}
                                    </div>
                                </div>

                                {/* Evidencias en SlideOver de Evidencias */}
                                {tarea?.evidencias && tarea.evidencias.length > 0 && (
                                    <div className="space-y-2 border-t border-gray-100 pt-3.5">
                                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">EVIDENCIAS CARGADAS</span>
                                        <div className="space-y-2 mt-1">
                                            {tarea.evidencias.map((ev: any, idx: number) => (
                                                <button 
                                                    key={ev.idArchivoEvidencia || idx} 
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedEvidenceForDetail(ev);
                                                        setIsEvidenceDetailOpen(true);
                                                    }}
                                                    className="bg-white border border-gray-100 rounded-lg p-2.5 flex items-center justify-between text-xs shadow-[0_1px_3px_rgba(0,0,0,0.02)] gap-2 hover:bg-blue-50/50 hover:border-blue-200 transition-colors cursor-pointer text-left w-full"
                                                >
                                                    <div className="space-y-0.5 truncate pr-2 flex-1">
                                                        <p className="font-bold text-corporate-dark truncate">
                                                            {ev.nombreOriginal}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400">
                                                            DOI: <span className="font-medium text-corporate-accent">{ev.doi}</span>
                                                        </p>
                                                        <p className="text-[9px] text-gray-500">
                                                            Subido por: <span className="font-semibold">{ev.elaboradorNombre || ev.elaborador?.nombre || "Usuario Desconocido"}</span> · {ev.fechaRegistro ? new Date(ev.fechaRegistro).toLocaleDateString() : "Fecha de registro no disponible"}
                                                        </p>
                                                    </div>
                                                    <div
                                                        className="inline-flex items-center justify-center p-1.5 rounded-md bg-slate-50 border border-gray-100 text-corporate-accent transition-colors"
                                                    >
                                                        <UploadCloud className="h-4 w-4 text-corporate-accent" />
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-gray-50 px-5 py-4 border-t border-gray-100 flex justify-end">
                                <Button
                                    onClick={() => setIsTaskDetailOpen(false)}
                                    className="px-4 py-2 text-xs bg-corporate-blue hover:bg-corporate-dark text-white rounded-lg transition-colors font-semibold"
                                >
                                    Entendido
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            })()}

            <EvidenciaDetailSlideOver
                isOpen={isEvidenceDetailOpen}
                onClose={() => setIsEvidenceDetailOpen(false)}
                evidencia={selectedEvidenceForDetail}
            />
        </>
    );
}