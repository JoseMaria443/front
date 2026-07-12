"use client";

import { useState } from "react";
import { X, Calendar } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useDataStore } from "../../store/data.store";
import type { Comunicado } from "../../models/comunicado.schema";

interface NewComunicadoSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NewComunicadoSlideOver({ isOpen, onClose }: NewComunicadoSlideOverProps) {
    const { areas, tiposComunicado, mediosRecepcion, agregarComunicado, empleados } = useDataStore();

    const [folio, setFolio] = useState("");
    const [numComunicado, setNumComunicado] = useState("");
    const [tema, setTema] = useState("");
    const [idArea, setIdArea] = useState("");
    const [fechaEmision, setFechaEmision] = useState("");
    const [idMedio, setIdMedio] = useState("");
    const [idTipo, setIdTipo] = useState("");

    if (!isOpen) return null;

    const areaSeleccionada = areas.find(a => a.idArea === idArea);
    const medioSeleccionado = mediosRecepcion.find(m => m.idMedioRecepcion === idMedio);
    const tipoSeleccionado = tiposComunicado.find(t => t.idTipoComunicado === idTipo);

    const isFormValid = 
        folio.trim() !== "" &&
        tema.trim() !== "" &&
        idArea !== "" &&
        fechaEmision !== "" &&
        idMedio !== "" &&
        idTipo !== "";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        const nuevoComunicado: Comunicado = {
            idComunicado: Math.random().toString(),
            folioDoi: folio,
            numComunicado: numComunicado || `NUM-${folio}`,
            tema,
            fechaEmision: new Date(fechaEmision).toISOString(),
            fechaRecepcion: new Date().toISOString(),
            idEmisor: idArea, // area emisor id mapped to idEmisor
            idTipoComunicado: idTipo,
            idMedioRecepcion: idMedio,
            idEmpleadoRegistro: "11111111-1111-1111-1111-111111111111", // Dr. Martinez
            emisor: {
                idEmpleado: idArea,
                nombre: areaSeleccionada?.nombre || "Área Desconocida",
                email: "contacto@universidad.edu.mx",
                idArea,
                activo: true
            },
            tipoComunicado: tipoSeleccionado ? { idTipoComunicado: idTipo, nombre: tipoSeleccionado.nombre } : undefined,
            medioRecepcion: medioSeleccionado ? { idMedioRecepcion: idMedio, nombre: medioSeleccionado.nombre } : undefined,
            tareas: [],
            archivos: [
                {
                    idArchivo: Math.random().toString(),
                    urlArchivo: `https://universidad.edu.mx/files/${folio.toLowerCase().replace(/\s+/g, '_')}_archivo.pdf`,
                    nombreOriginal: `${folio.toLowerCase().replace(/\s+/g, '_')}_archivo.pdf`
                }
            ]
        };

        agregarComunicado(nuevoComunicado);
        onClose();
        // Reset states
        setFolio("");
        setNumComunicado("");
        setTema("");
        setIdArea("");
        setFechaEmision("");
        setIdMedio("");
        setIdTipo("");
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

                    {/* Área Emisora */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">
                            Área Emisora <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-corporate-accent h-11"
                            value={idArea}
                            onChange={(e) => setIdArea(e.target.value)}
                            required
                        >
                            <option value="">Selecciona el área...</option>
                            {areas.map(a => (
                                <option key={a.idArea} value={a.idArea}>{a.nombre}</option>
                            ))}
                        </select>
                    </div>

                    {/* Fecha de Emisión */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">
                            Fecha de Emisión <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Input
                                type="datetime-local"
                                className="h-11 bg-white pr-10"
                                value={fechaEmision}
                                onChange={(e) => setFechaEmision(e.target.value)}
                                required
                            />
                        </div>
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
                            {mediosRecepcion.map(m => (
                                <option key={m.idMedioRecepcion} value={m.idMedioRecepcion}>{m.nombre}</option>
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
                            {tiposComunicado.map(t => (
                                <option key={t.idTipoComunicado} value={t.idTipoComunicado}>{t.nombre}</option>
                            ))}
                        </select>
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
                        Registrar
                    </Button>
                </div>
            </form>
        </div>
    );
}
