"use client";

import { useSessionStore } from '../../store/session.store';
//lectura de zustand de nombre de usuario de memoria global
export function Topbar() {
    const user = useSessionStore((state) => state.user);

    return (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center">
                <span className="text-sm font-medium text-gray-500">
                    Ciclo Ene–Jun 2026
                </span>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-corporate-dark leading-tight">
                            {user?.nombre || "Usuario"}
                        </p>
                        <p className="text-xs text-gray-500">
                            {user?.cargos?.[0]?.nombre || "Área Administrativa"}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-corporate-blue flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        {user?.nombre?.substring(0, 2).toUpperCase() || "US"}
                    </div>
                </div>
            </div>
        </header>
    );
}