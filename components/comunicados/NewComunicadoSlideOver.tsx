"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { api } from "../../services/api.config";

interface NewComunicadoSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function NewComunicadoSlideOver({ isOpen, onClose, onSuccess }: NewComunicadoSlideOverProps) {
    const [folio, setFolio] = useState("");
    const [numComunicado, setNumComunicado] = useState("");
    const [tema, setTema] = useState("");
    const [idEmisor, setIdEmisor] = useState("");
    const [fechaEmision, setFechaEmision] = useState("");
    const [fechaRecepcion, setFechaRecepcion] = useState("");
    const [idMedio, setIdMedio] = useState("");
    const [idTipo, setIdTipo] = useState("");
    const [destinatariosSeleccionados, setDestinatariosSeleccionados] = useState<string[]>([]);
    const [idRolDestinatario, setIdRolDestinatario] = useState("");

    // Catalog States
    const [tiposList, setTiposList] = useState<any[]>([]);
    const [mediosList, setMediosList] = useState<any[]>([]);
    const [empleadosList, setEmpleadosList] = useState<any[]>([]);
    const [rolesDestList, setRolesDestList] = useState<any[]>([]);
    
    const [isLoadingOptions, setIsLoadingOptions] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isOpen) return;
        setIsLoadingOptions(true);
        setError("");
        Promise.all([
            api.get<any[]>('/tipos-comunicado/todos'),
            api.get<any[]>('/medios-recepcion/todos'),
            api.get<any[]>('/api/empleado/?activo=true'),
            api.get<any[]>('/roles-destinatario/todos')
        ]).then(([tiposRes, mediosRes, empsRes, rolesRes]) => {
            setTiposList(tiposRes.data.filter(x => !x.archivado));
            setMediosList(mediosRes.data.filter(x => !x.archivado));
            setEmpleadosList(empsRes.data);
            setRolesDestList(rolesRes.data.filter(x => !x.archivado));
        }).catch(err => {
            console.error("Error loading dropdown data:", err);
            setError("Error al cargar los catálogos para el formulario.");
        }).finally(() => {
            setIsLoadingOptions(false);
        });
    }, [isOpen]);

    if (!isOpen) return null;

    const isFormValid = 
        folio.trim() !== "" &&
        tema.trim() !== "" &&
        idEmisor !== "" &&
        fechaEmision !== "" &&
        fechaRecepcion !== "" &&
        idMedio !== "" &&
        idTipo !== "" &&
        destinatariosSeleccionados.length > 0 &&
        idRolDestinatario !== "";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid || isSubmitting) return;

        setIsSubmitting(true);
        setError("");
        
        const payload = {
            folioDoi: folio,
            numComunicado: numComunicado || `NUM-${folio}`,
            tema,
            idEmisor,
            fechaEmision: new Date(fechaEmision).toISOString(),
            fechaRecepcion: new Date(fechaRecepcion).toISOString(),
            idTipoComunicado: idTipo,
            idMedioRecepcion: idMedio,
            destinatarios: destinatariosSeleccionados.map(idDest => ({
                idDestinatario: idDest,
                idRolDestinatario
            })),
            archivoUrl: "https://simulacion-cloudinary.com/documento_adjunto.pdf"
        };

        try {
            await api.post('/comunicados/', payload);
            
            // Clean inputs
            setFolio("");
            setNumComunicado("");
            setTema("");
            setIdEmisor("");
            setFechaEmision("");
            setFechaRecepcion("");
            setIdMedio("");
            setIdTipo("");
            setDestinatariosSeleccionados([]);
            setIdRolDestinatario("");
            
            if (onSuccess) {
                onSuccess();
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || err.response?.data?.detail || "Error al registrar el comunicado.";
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
                        <h2 className="text-xl font-bold text-corporate-dark">Registrar Comunicado</h2>
                        <p className="text-xs text-gray-500 mt-1">Crea un nuevo comunicado en el repositorio oficial</p>
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
                    {isLoadingOptions && (
                        <div className="text-center py-4 text-xs text-gray-500">
                            Cargando catálogos del sistema...
                        </div>
                    )}

                    {/* Folio */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">
                            Folio / DOI <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="Ej. OFI-2026-0034"
                            className="h-11 bg-white"
                            value={folio}
                            onChange={(e) => setFolio(e.target.value)}
                            required
                        />
                    </div>

                    {/* Número Comunicado */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">
                            Nº Comunicado
                        </label>
                        <Input
                            placeholder="Ej. REC-2026-01"
                            className="h-11 bg-white"
                            value={numComunicado}
                            onChange={(e) => setNumComunicado(e.target.value)}
                        />
                    </div>

                    {/* Tema */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">
                            Tema / Asunto <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="Ej. Convocatoria Movilidad Estudiantil"
                            className="h-11 bg-white"
                            value={tema}
                            onChange={(e) => setTema(e.target.value)}
                            required
                        />
                    </div>

                    {/* Emisor */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">
                            Emisor <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-corporate-accent h-11"
                            value={idEmisor}
                            onChange={(e) => setIdEmisor(e.target.value)}
                            required
                        >
                            <option value="">Selecciona el emisor...</option>
                            {empleadosList.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.nombre}</option>
                            ))}
                        </select>
                    </div>

                    {/* Fecha de Emisión */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">
                            Fecha de Emisión <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="datetime-local"
                            className="h-11 bg-white"
                            value={fechaEmision}
                            onChange={(e) => setFechaEmision(e.target.value)}
                            required
                        />
                    </div>

                    {/* Fecha de Recepción */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">
                            Fecha de Recepción <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="datetime-local"
                            className="h-11 bg-white"
                            value={fechaRecepcion}
                            onChange={(e) => setFechaRecepcion(e.target.value)}
                            required
                        />
                    </div>

                    {/* Medio de Recepción */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">
                            Medio de Recepción <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-corporate-accent h-11"
                            value={idMedio}
                            onChange={(e) => setIdMedio(e.target.value)}
                            required
                        >
                            <option value="">Selecciona el medio...</option>
                            {mediosList.map(m => (
                                <option key={m.id} value={m.id}>{m.nombre}</option>
                            ))}
                        </select>
                    </div>

                    {/* Tipo de Comunicado */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">
                            Tipo de Comunicado <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-corporate-accent h-11"
                            value={idTipo}
                            onChange={(e) => setIdTipo(e.target.value)}
                            required
                        >
                            <option value="">Selecciona el tipo...</option>
                            {tiposList.map(t => (
                                <option key={t.id} value={t.id}>{t.nombre}</option>
                            ))}
                        </select>
                    </div>

                    {/* Destinatarios */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">
                            Destinatarios <span className="text-red-500">*</span>
                        </label>
                        <p className="text-[10px] text-gray-400 mb-1">Manten presionado Ctrl (Windows) o Cmd (Mac) para seleccionar varios</p>
                        <select
                            multiple
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-corporate-accent min-h-[120px]"
                            value={destinatariosSeleccionados}
                            onChange={(e) => {
                                const selected = Array.from(e.target.selectedOptions, option => option.value);
                                setDestinatariosSeleccionados(selected);
                            }}
                            required
                        >
                            {empleadosList.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.nombre}</option>
                            ))}
                        </select>
                    </div>

                    {/* Rol de Destinatario */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">
                            Rol de Destinatario <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-corporate-accent h-11"
                            value={idRolDestinatario}
                            onChange={(e) => setIdRolDestinatario(e.target.value)}
                            required
                        >
                            <option value="">Selecciona el rol de destinatario...</option>
                            {rolesDestList.map(r => (
                                <option key={r.id} value={r.id}>{r.descripcion_rol}</option>
                            ))}
                        </select>
                    </div>

                    {/* Archivo Adjunto */}
                    <div className="space-y-1 pt-2">
                        <label className="text-xs font-bold text-gray-700">
                            Documento Adjunto (PDF)
                        </label>
                        <input
                            type="file"
                            accept=".pdf"
                            className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-corporate-blue hover:file:bg-blue-100"
                        />
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
                        {isSubmitting ? "Registrando..." : "Registrar"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
