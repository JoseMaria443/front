"use client";

import { useState, useEffect } from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { api } from "../../services/api.config";

interface EmployeeSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: () => void;
}

export function EmployeeSlideOver({ isOpen, onClose, onSave }: EmployeeSlideOverProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    
    // Form states
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [idArea, setIdArea] = useState("");
    const [cargosSeleccionados, setCargosSeleccionados] = useState<string[]>([]);
    const [accesoSistema, setAccesoSistema] = useState(false);
    const [password, setPassword] = useState("");
    
    // Catalog states
    const [areasList, setAreasList] = useState<any[]>([]);
    const [cargosList, setCargosList] = useState<any[]>([]);
    
    const [isLoadingOptions, setIsLoadingOptions] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isOpen) return;
        
        // Reset form
        setNombre("");
        setCorreo("");
        setIdArea("");
        setCargosSeleccionados([]);
        setAccesoSistema(false);
        setPassword("");
        setError("");
        
        setIsLoadingOptions(true);
        Promise.all([
            api.get<any[]>('/areas/todos'),
            api.get<any[]>('/cargos/todos')
        ]).then(([areasRes, cargosRes]) => {
            setAreasList(areasRes.data.filter(x => !x.archivado));
            setCargosList(cargosRes.data.filter(x => !x.archivado));
        }).catch(err => {
            console.error("Error loading employee catalogs:", err);
        }).finally(() => {
            setIsLoadingOptions(false);
        });
    }, [isOpen]);

    if (!isOpen) return null;

    const toggleCargo = (cargoId: string) => {
        setCargosSeleccionados(prev => 
            prev.includes(cargoId)
                ? prev.filter(id => id !== cargoId)
                : [...prev, cargoId]
        );
    };

    const isFormValid =
        nombre.trim() !== "" &&
        correo.trim() !== "" &&
        idArea !== "" &&
        cargosSeleccionados.length > 0 &&
        (!accesoSistema || password.trim() !== "");

    const handleSave = async () => {
        if (!isFormValid || isSubmitting) return;

        setIsSubmitting(true);
        setError("");

        const payload: any = {
            nombre,
            email: correo,
            idArea,
            cargos: cargosSeleccionados,
            acceso_sistema: accesoSistema
        };

        if (accesoSistema) {
            payload.password = password;
        }

        try {
            await api.post('/api/empleado/', payload);
            if (onSave) {
                onSave();
            }
            onClose();
        } catch (err: any) {
            const msg = err.response?.data?.message || err.response?.data?.detail || "Error al crear el empleado.";
            setError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className={`relative bg-white shadow-2xl transition-all duration-300 ease-in-out flex flex-col h-full ${isExpanded ? "w-full" : "w-full md:w-[450px]"}`}>
                <div className="flex items-start justify-between border-b border-gray-100 p-6">
                    <div>
                        <h2 className="text-xl font-bold text-corporate-dark">Nuevo Empleado</h2>
                        <p className="text-sm text-gray-500 mt-1">Registra un nuevo docente o coordinador</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 text-gray-400 hover:text-corporate-dark hover:bg-gray-50 rounded-full">
                            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                        </button>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg border border-red-100 text-xs font-semibold">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">Nombre Completo <span className="text-red-500">*</span></label>
                        <Input
                            placeholder="Ej. Dr. Apellido Apellido, Nombre" className="h-11"
                            value={nombre} onChange={e => setNombre(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">Correo Institucional <span className="text-red-500">*</span></label>
                        <Input
                            placeholder="usuario@universidad.edu.mx" type="email" className="h-11"
                            value={correo} onChange={e => setCorreo(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">Área <span className="text-red-500">*</span></label>
                        <select
                            className="w-full h-11 rounded-md border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-corporate-accent"
                            value={idArea}
                            onChange={e => setIdArea(e.target.value)}
                        >
                            <option value="" disabled>— Seleccionar área —</option>
                            {areasList.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-700">Cargos <span className="text-red-500">*</span></label>
                        <div className="flex flex-wrap gap-2">
                            {cargosList.map(cargo => (
                                <button
                                    key={cargo.id}
                                    type="button"
                                    onClick={() => toggleCargo(cargo.id)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${cargosSeleccionados.includes(cargo.id)
                                            ? 'bg-corporate-blue text-white border-corporate-blue shadow-sm'
                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {cargo.nombre}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100/50 pt-2 mt-4">
                        <div>
                            <span className="block text-xs font-bold text-gray-700">Habilitar acceso al sistema (Usuario Interno)</span>
                            <span className="block text-[10px] text-gray-400 mt-0.5">Le permite iniciar sesión en la plataforma</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setAccesoSistema(!accesoSistema);
                                if (accesoSistema) setPassword("");
                            }}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${accesoSistema ? 'bg-corporate-blue' : 'bg-gray-200'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${accesoSistema ? 'translate-x-4' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    {accesoSistema && (
                        <div className="space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                            <label className="text-xs font-bold text-gray-700">Contraseña Temporal <span className="text-red-500">*</span></label>
                            <Input
                                placeholder="Escribe la contraseña temporal..."
                                type="password"
                                className="h-11 bg-white"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-100 p-6 bg-white">
                    <Button
                        onClick={handleSave} disabled={!isFormValid || isSubmitting}
                        className={`w-full py-6 text-sm rounded-xl font-semibold ${isFormValid && !isSubmitting ? "bg-corporate-blue text-white hover:bg-corporate-dark shadow-md" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                    >
                        {isSubmitting ? "Registrando..." : "Crear Empleado"}
                    </Button>
                </div>
            </div>
        </div>
    );
}