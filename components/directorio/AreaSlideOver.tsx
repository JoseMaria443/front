"use client";

import { useState } from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface AreaSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (nombre: string) => void;
}

export function AreaSlideOver({ isOpen, onClose, onSave }: AreaSlideOverProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [nombre, setNombre] = useState("");

    if (!isOpen) return null;

    const handleSave = () => {
        if (nombre.trim() === "") return;
        onSave(nombre);
        setNombre("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div
                className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div
                className={`relative bg-white shadow-2xl transition-all duration-300 ease-in-out flex flex-col h-full ${isExpanded ? "w-full" : "w-full md:w-[450px]"
                    }`}
            >
                <div className="flex items-start justify-between border-b border-gray-100 p-6">
                    <div>
                        <h2 className="text-xl font-bold text-corporate-dark">Nueva Área</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Agrega un área o departamento al directorio
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-2 text-gray-400 hover:text-corporate-dark hover:bg-gray-50 rounded-full"
                        >
                            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">
                            Nombre del Área <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="Ej. Ing. en Mecatrónica"
                            className="h-11"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>
                </div>

                <div className="border-t border-gray-100 p-6 bg-white">
                    <Button
                        onClick={handleSave}
                        disabled={!nombre.trim()}
                        className={`w-full py-6 text-sm rounded-xl font-semibold ${nombre.trim()
                                ? "bg-corporate-blue text-white hover:bg-corporate-dark shadow-md"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        Guardar Área
                    </Button>
                </div>
            </div>
        </div>
    );
}