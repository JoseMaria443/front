"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";
import { ChevronLeft, GraduationCap, LayoutDashboard, FileText, CheckSquare, Users, Settings, Bell, LogOut } from "lucide-react";
import { useSessionStore } from "../../store/session.store";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: "Comunicados", href: "/comunicados", icon: <FileText className="h-5 w-5" /> },
    { label: "Mis Tareas", href: "/mis-tareas", icon: <CheckSquare className="h-5 w-5" /> },
    { label: "Directorio", href: "/directorio", icon: <Users className="h-5 w-5" /> },
    { label: "Configuración", href: "/configuracion", icon: <Settings className="h-5 w-5" /> },
];

const bottomNavItems = [
    { label: "Notificaciones", href: "/notificaciones", icon: <Bell className="h-5 w-5" /> },
];

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const user = useSessionStore((state) => state.user);
    const logout = useSessionStore((state) => state.logout);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const getInitials = (name?: string) => {
        if (!name) return "US";
        const parts = name.replace("Dr. ", "").replace("Ing. ", "").trim().split(" ");
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-slate-900 text-white transition-all duration-300 ease-in-out",
                collapsed ? "w-16" : "w-64"
            )}
        >
            <div className="flex h-16 items-center gap-3 border-b border-slate-700 px-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-corporate-accent">
                    <GraduationCap className="h-5 w-5 text-white" />
                </div>
                {!collapsed && (
                    <div className="overflow-hidden transition-all">
                        <p className="text-sm font-semibold leading-tight">SGC2I</p>
                        <p className="text-xs text-slate-400">UPChiapas</p>
                    </div>
                )}
                <Button
                    variant="ghost"
                    onClick={() => setCollapsed(!collapsed)}
                    className={cn(
                        "ml-auto h-7 w-7 p-0 shrink-0 text-slate-400 hover:bg-slate-800 hover:text-white flex items-center justify-center",
                        collapsed && "mx-auto"
                    )}
                >
                    <ChevronLeft
                        className={cn("h-4 w-4 transition-transform duration-300", collapsed && "rotate-180")}
                    />
                </Button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                                        isActive
                                            ? "bg-corporate-accent/20 text-corporate-accent"
                                            : "text-slate-300 hover:bg-slate-800 hover:text-white",
                                        collapsed && "justify-center px-2"
                                    )}
                                >
                                    {item.icon}
                                    {!collapsed && <span className="truncate">{item.label}</span>}
                                    {isActive && !collapsed && (
                                        <span className="ml-auto h-2 w-2 rounded-full bg-corporate-accent" />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="border-t border-slate-700 py-4 px-3">
                <ul className="space-y-1">
                    {bottomNavItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white",
                                    collapsed && "justify-center px-2"
                                )}
                            >
                                {item.icon}
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="mt-4 flex flex-col gap-2 border-t border-slate-700 pt-4">
                    <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-corporate-blue text-sm font-semibold">
                            {getInitials(user?.nombre)}
                        </div>
                        {!collapsed && (
                            <div className="overflow-hidden flex-1">
                                <p className="text-sm font-medium truncate">{user?.nombre || "Cargando..."}</p>
                                <p className="text-xs text-slate-400 truncate">{user?.cargos?.[0]?.nombre || "Área Administrativa"}</p>
                            </div>
                        )}
                    </div>
                    
                    <button
                        onClick={handleLogout}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-red-950/30 hover:text-red-400 transition-colors cursor-pointer w-full text-left",
                            collapsed && "justify-center px-2"
                        )}
                        title="Cerrar Sesión"
                    >
                        <LogOut className="h-5 w-5" />
                        {!collapsed && <span className="truncate">Cerrar Sesión</span>}
                    </button>
                </div>
            </div>
        </aside>
    );
}