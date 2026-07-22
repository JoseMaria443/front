"use client";

import { useSessionStore } from "../../store/session.store"; //lectura de zustand de usuario nombre global
import { usePathname } from "next/navigation";

export function Topbar() {
    const user = useSessionStore((state) => state.user);
    const pathname = usePathname();

    if (!user) return null;

    // pequeña utilidad para capitalizar la ruta actual y usarla como título, ya no declaramos multiples de momento
    const pageTitle = pathname.split("/").pop() || "Dashboard";
    const formattedTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1).replace("-", " ");

    const getInitials = (name?: string) => {
        if (!name) return "US";
        const parts = name.replace("Dr. ", "").replace("Ing. ", "").trim().split(" ");
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="mb-8 mt-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <nav className="text-sm text-gray-500">
                    <span className="font-medium text-corporate-dark">SGC2I</span>
                    <span className="mx-2">/</span>
                    <span className="capitalize">{formattedTitle}</span>
                </nav>
                <div className="flex items-center gap-3">
                    <div className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-700 bg-white">
                        <span className="mr-2 h-2 w-2 rounded-full bg-emerald-500" />
                        Ciclo Ene-Jun 2026
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-corporate-blue text-sm font-semibold text-white shadow-sm">
                        {getInitials(user?.nombre)}
                    </div>
                </div>
            </div>
        </div>
    );
}