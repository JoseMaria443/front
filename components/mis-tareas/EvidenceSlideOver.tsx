// backdropblur y formulario de subida para evidencias
"use client";

import { useState } from "react";
import { X, Maximize2, Minimize2, UploadCloud } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface EvidenceSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    task: any | null; // manejo de tipado, falta conectar con zod
}

export function EvidenceSlideOver({ isOpen, onClose, task }: EvidenceSlideOverProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div
                className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div
                className={`relative bg-white shadow-2xl transition-all duration-300 ease-in-out flex flex-col h-full ${isExpanded ? "w-full" : "w-full md:w-[500px]"
                    }`}
            >
                <div className="flex items-start justify-between border-b border-gray-100 p-6">
                    <div>
                        <h2 className="text-xl font-bold text-corporate-dark">Subir Evidencia</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {task?.code} · {task?.taskCode} — {task?.title}
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

                    {/* tarjeta de vinculacion de tarea, agregar evento cuando se tenga*/}
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                        <p className="text-xs font-medium text-gray-500 mb-1">Tarea vinculada</p>
                        <p className="font-semibold text-corporate-dark text-sm mb-2">{task?.title}</p>
                        <div className="flex items-center gap-3 text-xs">
                            <span className="text-corporate-accent font-medium">{task?.code}</span>
                            <span className="text-corporate-blue bg-blue-50 px-2 py-0.5 rounded-full">Asignada</span>
                        </div>
                    </div>

                    {/* formulario */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">
                            DOI del Archivo <span className="text-red-500">*</span>
                        </label>
                        <Input placeholder="Ej. EVD-2026-0001" className="h-11" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">
                            Historia <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-corporate-accent resize-none h-32"
                            placeholder="Describe la actividad documentada: qué ocurrió, cuándo, quiénes participaron y qué resultado refleja..."
                        />
                        <div className="text-right text-[10px] text-gray-400 font-medium">0 / 500</div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700">
                            Archivo de Evidencia <span className="text-red-500">*</span>
                        </label>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                            <UploadCloud className="h-8 w-8 text-corporate-blue mb-3" />
                            <p className="text-sm font-semibold text-corporate-dark">Arrastra un archivo o haz clic</p>
                            <p className="text-xs text-gray-500 mt-1">Un archivo · PDF, imagen, video · Máx. 50 MB</p>
                        </div>
                    </div>

                </div>

                <div className="border-t border-gray-100 p-6 bg-white">
                    <Button className="w-full py-6 text-sm bg-gray-100 text-gray-400 hover:bg-gray-100 cursor-not-allowed rounded-xl font-semibold">
                        <UploadCloud className="h-4 w-4 mr-2" />
                        Registrar Evidencia
                    </Button>
                </div>
            </div>
        </div>
    );
}