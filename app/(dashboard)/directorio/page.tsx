"use client";

import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { EmployeeSlideOver } from "../../../components/directorio/EmployeeSlideOver";
import { EmployeeProfileSlideOver } from "../../../components/directorio/EmployeeProfileSlideOver";
import { api } from "../../../services/api.config";
import { useSessionStore } from "../../../store/session.store";

export default function DirectorioPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [empleados, setEmpleados] = useState<any[]>([]);
    const [areasList, setAreasList] = useState<any[]>([]);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Toast state
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const currentUser = useSessionStore(state => state.user);

    // Roles validation: check if currentUser has "Administrador" or "Director"
    const roles = (currentUser as any)?.cargos_nombres || currentUser?.cargos || [];
    console.log("ROLES DETECTADOS FRONTEND:", roles);
    const hasAdminAccess = roles.some((c: any) => {
        const nombre = typeof c === 'string' ? c : (c.nombre || "");
        return nombre.toLowerCase().includes("administrador") || nombre.toLowerCase().includes("director");
    });

    const showToast = (message: string, type: "success" | "error" = "error") => {
        setToast({ message, type });
    };

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const fetchData = async () => {
        setIsLoading(true);
        setError("");
        try {
            const [empRes, areasRes] = await Promise.all([
                api.get<any[]>('/api/empleado/'),
                api.get<any[]>('/areas/todos')
            ]);
            setEmpleados(empRes.data);
            setAreasList(areasRes.data);
        } catch (err: any) {
            console.error("Error loading directory data:", err);
            setError("Ocurrió un error al cargar el directorio.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleEmpleadoActivo = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();

        if (id === currentUser?.idEmpleado) {
            showToast("No puedes alterar tu propio estatus de cuenta.", "error");
            return;
        }
        if (!hasAdminAccess) {
            showToast("No cuentas con los permisos requeridos (Administrador o Director) para alterar este estatus.", "error");
            return;
        }

        try {
            await api.patch(`/api/empleado/${id}/toggle-status`);
            showToast("Estatus del empleado actualizado con éxito.", "success");
            fetchData();
        } catch (err: any) {
            console.error("Error toggling employee status:", err);
            const msg = err.response?.data?.message || err.response?.data?.detail || "No se pudo cambiar el estatus del empleado.";
            showToast(msg, "error");
        }
    };

    const handleEmployeeClick = (id: string) => {
        setSelectedEmployeeId(id);
        setIsProfileOpen(true);
    };

    const empleadosFiltrados = empleados.filter(emp => {
        const areaName = areasList.find(a => a.id === emp.idArea)?.nombre || "";
        const search = searchQuery.toLowerCase();
        return (
            emp.nombre.toLowerCase().includes(search) ||
            emp.email.toLowerCase().includes(search) ||
            areaName.toLowerCase().includes(search)
        );
    });

    const getEmployeeInitials = (nombre: string) => {
        return nombre
            ? nombre
                  .split(" ")
                  .filter(n => n.length > 0)
                  .slice(0, 2)
                  .map(n => n[0])
                  .join("")
                  .toUpperCase()
            : "U";
    };

    // Color list based on index
    const getAvatarBg = (idx: number) => {
        const colors = [
            "bg-corporate-blue",
            "bg-violet-600",
            "bg-emerald-500",
            "bg-pink-500",
            "bg-amber-500",
            "bg-indigo-600",
            "bg-teal-500"
        ];
        return colors[idx % colors.length];
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-corporate-dark">Directorio</h1>
                    <p className="text-sm text-gray-500 mt-1">Gestión de empleados del sistema</p>
                </div>

                {hasAdminAccess && (
                    <Button
                        onClick={() => setIsEmployeeModalOpen(true)}
                        className="rounded-full shadow-md px-6 bg-corporate-blue hover:bg-corporate-dark cursor-pointer"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Empleado
                    </Button>
                )}
            </div>

            <div className="mt-4 space-y-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar empleado o área..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-corporate-accent focus:ring-1 focus:ring-corporate-accent transition-all shadow-sm"
                    />
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg border border-red-100 text-xs font-semibold">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Empleado</th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Área</th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Cargos</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider w-24">Activo</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-sm text-gray-500">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <div className="w-6 h-6 border-2 border-corporate-accent border-t-transparent rounded-full animate-spin" />
                                                <span>Cargando directorio...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    empleadosFiltrados.map((emp, index) => {
                                        const areaName = areasList.find(a => a.id === emp.idArea)?.nombre || "—";
                                        const isToggleDisabled = emp.id === currentUser?.idEmpleado || !hasAdminAccess;
                                        return (
                                            <tr 
                                                key={emp.id} 
                                                onClick={() => handleEmployeeClick(emp.id)}
                                                className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                                            >
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${getAvatarBg(index)}`}>
                                                            {getEmployeeInitials(emp.nombre)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-corporate-dark">{emp.nombre}</p>
                                                            <p className="text-xs text-gray-500 mt-0.5">{emp.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-sm text-gray-600 font-medium">{areaName}</td>
                                                <td className="py-4 px-4">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {emp.cargos?.map((cargo: string, i: number) => (
                                                            <span key={i} className="inline-flex items-center rounded-full bg-blue-50 text-corporate-blue px-2.5 py-0.5 text-[10px] font-semibold border border-blue-100/30">
                                                                {cargo}
                                                            </span>
                                                        ))}
                                                        {(!emp.cargos || emp.cargos.length === 0) && (
                                                            <span className="text-xs text-gray-400 italic">—</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => toggleEmpleadoActivo(emp.id, e)}
                                                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                                            emp.activo ? 'bg-corporate-blue' : 'bg-gray-200'
                                                        } ${isToggleDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                                                    >
                                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emp.activo ? 'translate-x-4' : 'translate-x-1'}`} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                                {!isLoading && empleadosFiltrados.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-sm text-gray-500">No se encontraron empleados.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <EmployeeSlideOver 
                isOpen={isEmployeeModalOpen} 
                onClose={() => setIsEmployeeModalOpen(false)} 
                onSave={fetchData} 
            />

            <EmployeeProfileSlideOver
                isOpen={isProfileOpen}
                onClose={() => {
                    setIsProfileOpen(false);
                    setSelectedEmployeeId(null);
                }}
                employeeId={selectedEmployeeId}
                areasList={areasList}
                onStatusToggled={fetchData}
            />

            {/* Custom Toast Popup */}
            {toast && (
                <div className={`fixed bottom-5 right-5 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl border shadow-lg animate-in fade-in slide-in-from-bottom-5 duration-300 ${
                    toast.type === "success" 
                        ? "bg-emerald-50 text-emerald-800 border-emerald-100" 
                        : "bg-red-50 text-red-800 border-red-100"
                }`}>
                    <span className="text-xs font-semibold">{toast.message}</span>
                    <button 
                        onClick={() => setToast(null)} 
                        className="text-gray-400 hover:text-gray-600 font-bold ml-2 text-sm focus:outline-none"
                    >
                        ×
                    </button>
                </div>
            )}
        </div>
    );
}