"use client";

import { X, Calendar, FileText, Download, User } from "lucide-react";

interface EvidenciaDetailSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    evidencia: {
        idArchivoEvidencia: string;
        doi: string;
        nombreOriginal: string;
        urlArchivo: string;
        fechaRegistro: string | Date;
        elaboradorNombre?: string;
        descripcion?: string;
        elaborador?: {
            nombre: string;
            email?: string;
        };
    } | null;
}

const formatRegistroDate = (dateStr?: string | Date) => {
    if (!dateStr) return "Fecha de registro no disponible";
    const d = new Date(dateStr);
    if (isNaN(d.getTime()) || d.getTime() <= 0) {
        return "Fecha de registro no disponible";
    }
    return d.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export function EvidenciaDetailSlideOver({ isOpen, onClose, evidencia }: EvidenciaDetailSlideOverProps) {
    if (!isOpen || !evidencia) return null;

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
                            Archivo de Evidencia
                        </span>
                        <h2 className="text-xl font-bold text-corporate-dark mt-2">
                            Detalles de Evidencia
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
                    {/* Visual File Card */}
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-start gap-3.5 shadow-sm">
                        <div className="p-3 bg-blue-50 text-corporate-accent rounded-lg border border-blue-100/50">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div className="truncate flex-1">
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nombre del Archivo</span>
                            <p className="text-sm font-bold text-corporate-dark mt-0.5 truncate leading-tight" title={evidencia.nombreOriginal}>
                                {evidencia.nombreOriginal}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-1">
                                DOI: <span className="font-semibold text-corporate-accent">{evidencia.doi}</span>
                            </p>
                        </div>
                    </div>

                    {/* Metadata items */}
                    <div className="space-y-4 pt-2">
                        <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha de Registro</span>
                                <p className="text-gray-700 text-xs font-medium mt-0.5">
                                    {formatRegistroDate(evidencia.fechaRegistro)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 border-t border-gray-100 pt-4">
                            <User className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Elaborado por</span>
                                <p className="text-gray-700 text-xs font-bold mt-0.5">
                                    {evidencia.elaboradorNombre || evidencia.elaborador?.nombre || "Usuario Desconocido"}
                                </p>
                                {evidencia.elaborador?.email && (
                                    <p className="text-[10px] text-gray-400 mt-0.5">
                                        {evidencia.elaborador.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        {evidencia.descripcion && (
                            <div className="space-y-1 border-t border-gray-100 pt-4">
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Descripción / Notas</span>
                                <p className="text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed text-xs">
                                    {evidencia.descripcion}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t border-gray-100 p-6 bg-gray-50 flex flex-col gap-2">
                    <a
                        href={evidencia.urlArchivo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-corporate-accent hover:bg-corporate-accent/90 text-white rounded-lg text-xs font-bold shadow transition-colors cursor-pointer text-center"
                    >
                        <Download className="h-4 w-4" />
                        Ver / Descargar Documento
                    </a>
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
