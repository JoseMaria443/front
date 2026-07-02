"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface CatalogModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (nombre: string) => void;
}

export function CatalogModal({ isOpen, onClose, onSave }: CatalogModalProps) {
    const [nombre, setNombre] = useState("");

    if (!isOpen) return null;

    const handleSave = () => {
        if (nombre.trim() === "") return;
        onSave(nombre.trim());
        setNombre("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-corporate-dark">+ Nuevo Registro</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-2 mb-6">
                    <label className="text-xs font-bold text-gray-700">
                        Nombre <span className="text-red-500">*</span>
                    </label>
                    <Input
                        placeholder="Nombre del registro..."
                        className="h-11 border-gray-300 focus:border-corporate-blue focus:ring-corporate-blue"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        autoFocus
                    />
                </div>

                <Button
                    onClick={handleSave}
                    disabled={!nombre.trim()}
                    className={`w-full py-2.5 text-sm rounded-xl font-semibold transition-all ${nombre.trim()
                            ? "bg-gray-100 text-corporate-dark hover:bg-gray-200"
                            : "bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-100"
                        }`}
                >
                    Guardar Registro
                </Button>
            </div>
        </div>
    );
}