"use client";

import { useState, useEffect } from "react";
import { X, FileText, ExternalLink, Users } from "lucide-react";
import type { Comunicado } from "../../models/comunicado.schema";
import { api } from "../../services/api.config";

interface ComunicadoDetailSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    comunicado: Comunicado | null;
}

export function ComunicadoDetailSlideOver({ isOpen, onClose, comunicado }: ComunicadoDetailSlideOverProps) {
    const [destinatarios, setDestinatarios] = useState<any[]>([]);
    const [isLoadingDest, setIsLoadingDest] = useState(false);

    useEffect(() => {
        if (!isOpen || !comunicado) return;
        
        const fetchDestAndRoles = async () => {
            setIsLoadingDest(true);
            try {
                const [destRes, empsRes, rolesRes] = await Promise.all([
                    api.get<any[]>(`/comunicados/${comunicado.idComunicado}/destinatarios`),
                    api.get<any[]>('/api/empleado/?activo=true'),
                    api.get<any[]>('/roles-destinatario/todos')
                ]);
                
                const empsMap = new Map(empsRes.data.map(e => [e.id, e]));
                const rolesMap = new Map(rolesRes.data.map(r => [r.id, r]));
                
                const mapped = destRes.data.map((d: any) => {
                    const emp = empsMap.get(d.idDestinatario);
                    const rol = rolesMap.get(d.idRolDestinatario);
                    return {
                        destinatario: emp ? {
                            nombre: emp.nombre,
                            email: emp.email
                        } : undefined,
                        rol: rol ? {
                            descripcionRol: rol.descripcionRol
                        } : undefined
                    };
                });
                
                setDestinatarios(mapped);
            } catch (err) {
                console.error("Error fetching destinatarios:", err);
            } finally {
                setIsLoadingDest(false);
            }
        };
        
        fetchDestAndRoles();
    }, [isOpen, comunicado]);

    if (!isOpen || !comunicado) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* SlideOver Panel (1/4 screen style, md:w-[450px]) */}
            <div className="relative bg-white shadow-2xl transition-all duration-300 ease-in-out flex flex-col h-full w-full md:w-[450px]">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-gray-100 p-6">
                    <div>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-corporate-accent bg-blue-50 px-2.5 py-1 rounded-full">
                            Detalle de Comunicado
                        </span>
                        <h2 className="text-xl font-bold text-corporate-dark mt-2">
                            {comunicado.folioDoi}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
                    {/* Tema */}
                    <div className="space-y-1">
                        <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Tema / Asunto</span>
                        <p className="font-semibold text-corporate-dark text-base leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                            {comunicado.tema}
                        </p>
                    </div>

                    {/* Emisor y Tipo */}
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Emisor / Área</span>
                            <span className="block font-medium text-corporate-dark text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                                {comunicado.emisorNombre || comunicado.emisor?.nombre || 'Sin emisor asignado'}{' '}
                                {comunicado.areaEmisoraNombre && (
                                    <span className="text-sm text-gray-500 font-normal">({comunicado.areaEmisoraNombre})</span>
                                )}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Tipo de Comunicado</span>
                            <span className="block font-medium text-corporate-dark text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                {comunicado.tipoComunicado?.nombre || "N/A"}
                            </span>
                        </div>
                    </div>

                    {/* Fechas */}
                    <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                        <div className="space-y-1">
                            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha Emisión</span>
                            <span className="block text-gray-600 text-xs font-medium">
                                {new Date(comunicado.fechaEmision).toLocaleDateString('es-MX', {
                                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha Recepción</span>
                            <span className="block text-gray-600 text-xs font-medium">
                                {new Date(comunicado.fechaRecepcion).toLocaleDateString('es-MX', {
                                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                            </span>
                        </div>
                    </div>

                    {/* Medio y Adicionales */}
                    <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                        <div className="space-y-1">
                            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Medio Recepción</span>
                            <span className="block font-medium text-corporate-dark text-xs">
                                {comunicado.medioRecepcion?.nombre || "Correo Electrónico"}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Nº Comunicado</span>
                            <span className="block text-gray-600 text-xs font-medium">
                                {comunicado.numComunicado || "N/A"}
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 space-y-1">
                        <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Registrado Por</span>
                        <p className="text-gray-700 text-xs font-medium">
                            {comunicado.empleadoRegistroNombre || 'Usuario desconocido'}
                        </p>
                    </div>

                    {/* Destinatarios */}
                    {destinatarios && destinatarios.length > 0 && (
                        <div className="border-t border-gray-100 pt-4 space-y-2">
                            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                <Users className="h-3.5 w-3.5 text-gray-400" />
                                Destinatarios
                            </span>
                            <div className="space-y-2">
                                {destinatarios.map((dest, i) => (
                                    <div key={i} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                                        <div>
                                            <p className="font-bold text-corporate-dark">
                                                {dest.destinatario?.nombre || "Destinatario"}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">
                                                {dest.destinatario?.email || ""}
                                            </p>
                                        </div>
                                        {dest.rol?.descripcionRol && (
                                            <span className="text-[9px] font-bold text-corporate-accent bg-blue-50 px-2 py-0.5 rounded border border-blue-100/50">
                                                {dest.rol.descripcionRol}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="border-t border-gray-100 pt-4 space-y-2">
                        <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Archivos Adjuntos</span>
                        {comunicado.archivos && comunicado.archivos.length > 0 ? (
                            <div className="space-y-2">
                                {comunicado.archivos.map((archivo) => (
                                    <a
                                        key={archivo.idArchivo}
                                        href={archivo.urlArchivo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2.5 truncate">
                                            <FileText className="h-4 w-4 text-corporate-accent shrink-0" />
                                            <span className="text-xs font-semibold text-corporate-dark truncate">
                                                {archivo.nombreOriginal}
                                            </span>
                                        </div>
                                        <ExternalLink className="h-3.5 w-3.5 text-gray-400 group-hover:text-corporate-accent transition-colors shrink-0" />
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 italic">No hay archivos adjuntos en este comunicado</p>
                        )}
                    </div>
                </div>

                {/* Footer */}
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
