"use client";

import { useState, useEffect } from "react";
import { X, User, Calendar, CheckCircle2, AlertTriangle, ShieldCheck, Lock } from "lucide-react";
import { Button } from "../ui/Button";
import { api } from "../../services/api.config";
import { useSessionStore } from "../../store/session.store";
import { authService } from "../../services/auth.service";
import { useToast } from "../../components/providers/ToastProvider";

interface HistorialEstatus {
    id: string;
    idEmpleadoAfectado: string;
    idEmpleadoModifica: string;
    accion: string; // "ACTIVACION" / "DESACTIVACION" / etc
    fechaRegistro: string | null;
    modifierNombre: string | null;
}

interface EmpleadoDetalle {
    id: string;
    nombre: string;
    email: string;
    idArea: string;
    activo: boolean;
    cargos: string[];
    historial: HistorialEstatus[];
}

interface EmployeeProfileSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    employeeId: string | null;
    areasList: any[]; // to resolve area name
    onStatusToggled?: () => void;
}

export function EmployeeProfileSlideOver({ isOpen, onClose, employeeId, areasList, onStatusToggled }: EmployeeProfileSlideOverProps) {
    const [detail, setDetail] = useState<EmpleadoDetalle | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState("");

    // Estado local para cambio de contraseña
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirm: '' });
    const [passwordError, setPasswordError] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const currentUser = useSessionStore(state => state.user);

    // Roles validation
    const roles = (currentUser as any)?.cargos_nombres || currentUser?.cargos || [];
    console.log("ROLES DETECTADOS FRONTEND:", roles);
    const isAuthorized = roles.some((c: any) => {
        const nombre = typeof c === 'string' ? c : (c.nombre || "");
        return nombre.toLowerCase().includes("administrador") || nombre.toLowerCase().includes("director");
    });

    const fetchDetail = async (id: string) => {
        setIsLoading(true);
        setError("");
        try {
            const res = await api.get<EmpleadoDetalle>(`/api/empleado/${id}`);
            setDetail(res.data);
        } catch (err: any) {
            console.error("Error loading employee profile:", err);
            setError("No se pudo cargar el perfil del empleado.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && employeeId) {
            fetchDetail(employeeId);
        } else {
            setDetail(null);
        }
    }, [isOpen, employeeId]);

    if (!isOpen) return null;

    const handleToggleStatus = async () => {
        if (!detail || isUpdating || detail.id === currentUser?.idEmpleado || !isAuthorized) return;
        setIsUpdating(true);
        setError("");
        try {
            await api.patch(`/api/empleado/${detail.id}/toggle-status`);
            if (onStatusToggled) {
                onStatusToggled();
            }
            // Reload details to get new history & status
            await fetchDetail(detail.id);
        } catch (err: any) {
            const msg = err.response?.data?.message || err.response?.data?.detail || "Error al cambiar el estatus.";
            setError(msg);
        } finally {
            setIsUpdating(false);
        }
    };

    const areaName = areasList.find(a => a.id === detail?.idArea)?.nombre || "Área Desconocida";
    const initials = detail?.nombre
        ? detail.nombre
              .split(" ")
              .filter(n => n.length > 0)
              .slice(0, 2)
              .map(n => n[0])
              .join("")
              .toUpperCase()
        : "U";

    // Format date safely (backend now returns ISO 8601)
    const formatHistoryDate = (dateStr: string | null) => {
        if (!dateStr) return "Fecha no disponible";
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return date.toLocaleString('es-MX', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateStr;
        }
    };

    const isSelf = detail?.id === currentUser?.idEmpleado;
    const isSwitchDisabled = isUpdating || isSelf || !isAuthorized;

    const handleChangePassword = async () => {
        if (!detail) return;
        setPasswordError('');
        setIsChangingPassword(true);
        try {
            const res = await authService.changePassword(detail.id, {
                password: passwordForm.newPassword,
                password_confirmation: passwordForm.confirm
            });
            if (res.success) {
                useToast().addToast(res.message || 'Contraseña actualizada', 'success');
                setIsChangePasswordOpen(false);
            } else {
                setPasswordError(res.message || 'No se pudo actualizar la contraseña.');
            }
        } catch (err) {
            setPasswordError('Error inesperado al actualizar la contraseña.');
        } finally {
            setIsChangingPassword(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative bg-white shadow-2xl transition-all duration-300 ease-in-out flex flex-col h-full w-full md:w-[450px]">
                <div className="flex items-center justify-between border-b border-gray-100 p-6 shrink-0">
                    <h3 className="text-lg font-bold text-corporate-dark flex items-center gap-2">
                        <User className="h-5 w-5 text-corporate-accent" />
                        Perfil de Empleado
                    </h3>
                    <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-48 space-y-2">
                            <div className="w-8 h-8 border-4 border-corporate-accent border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs text-gray-500 font-medium">Cargando perfil...</p>
                        </div>
                    )}

                    {!isLoading && error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-xs font-semibold">
                            {error}
                        </div>
                    )}

                    {!isLoading && detail && (
                        <>
                            {/* Profile Header */}
                            <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100/60 shadow-sm">
                                <div className="w-14 h-14 rounded-2xl bg-corporate-accent text-white flex items-center justify-center font-bold text-lg shadow-sm">
                                    {initials}
                                </div>
                                <div className="space-y-0.5 truncate">
                                    <h4 className="font-bold text-corporate-dark truncate text-base">{detail.nombre}</h4>
                                    <p className="text-xs text-gray-500 truncate">{detail.email}</p>
                                    <p className="text-[11px] font-bold text-corporate-accent uppercase tracking-wider">{areaName}</p>
                                </div>
                            </div>

                            {/* Status Control Switch */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="block text-xs font-bold text-gray-700">Estado de Cuenta</span>
                                        <span className="block text-[10px] text-gray-400 mt-0.5">Define si el usuario puede acceder al sistema</span>
                                    </div>
                                    <button
                                        type="button"
                                        disabled={isSwitchDisabled}
                                        onClick={handleToggleStatus}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
                                            detail.activo ? 'bg-corporate-blue' : 'bg-gray-200'
                                        } ${isSwitchDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            detail.activo ? 'translate-x-5' : 'translate-x-1'
                                        }`} />
                                    </button>
                                </div>
                                {isSelf && (
                                    <p className="text-[10px] text-amber-600 font-medium bg-amber-50 p-2 rounded-lg border border-amber-100">
                                        No puedes alterar tu propio estatus de cuenta.
                                    </p>
                                )}
                                {!isSelf && !isAuthorized && (
                                    <p className="text-[10px] text-red-600 font-medium bg-red-50 p-2 rounded-lg border border-red-100">
                                        No cuentas con los permisos requeridos (Administrador o Director) para alterar este estatus.
                                    </p>
                                )}
                                <div className="flex items-center gap-2 pt-1 border-t border-gray-50">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Estatus actual:</span>
                                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                        detail.activo 
                                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                            : 'bg-red-50 text-red-600 border border-red-100'
                                    }`}>
                                        {detail.activo ? "Activo" : "Inactivo"}
                                    </span>
                                </div>
                            </div>

                            {/* Cargos Section */}
                            <div className="space-y-2">
                                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cargos Asignados</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {detail.cargos.map((cargo, i) => (
                                        <span key={i} className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-corporate-blue px-3 py-1 text-xs font-semibold border border-blue-100/50 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                                            <ShieldCheck className="h-3 w-3 text-corporate-blue" />
                                            {cargo}
                                        </span>
                                    ))}
                                    {detail.cargos.length === 0 && (
                                        <span className="text-xs text-gray-400 italic">Ningún cargo asignado</span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                {/* Cambiar contraseña */}
                                {isAuthorized && (
                                    <div className="space-y-2 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => { setIsChangePasswordOpen(true); setPasswordForm({ newPassword: '', confirm: '' }); setPasswordError(''); }}
                                            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 shadow-sm transition-colors"
                                        >
                                            <Lock className="h-3.5 w-3.5" />
                                            Cambiar contraseña
                                        </button>
                                    </div>
                                )}

                                {isChangePasswordOpen && (
                                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
                                        <p className="text-xs font-bold text-gray-700">Actualizar contraseña</p>
                                        <div className="space-y-2">
                                            <input
                                                type="password"
                                                placeholder="Nueva contraseña"
                                                value={passwordForm.newPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-corporate-accent focus:ring-1 focus:ring-corporate-accent transition-all"
                                            />
                                            <input
                                                type="password"
                                                placeholder="Confirmar contraseña"
                                                value={passwordForm.confirm}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                                                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-corporate-accent focus:ring-1 focus:ring-corporate-accent transition-all"
                                            />
                                            {passwordError && (
                                                <p className="text-[11px] text-red-600 font-medium bg-red-50 p-2 rounded-lg border border-red-100">{passwordError}</p>
                                            )}
                                            <div className="flex items-center justify-end gap-2 pt-1">
                                                <button
                                                    type="button"
                                                    onClick={() => { setIsChangePasswordOpen(false); setPasswordError(''); }}
                                                    className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={isChangingPassword}
                                                    onClick={handleChangePassword}
                                                    className="px-4 py-1.5 text-xs font-semibold bg-corporate-blue text-white rounded-lg hover:bg-corporate-dark transition-colors disabled:opacity-50"
                                                >
                                                    {isChangingPassword ? 'Guardando...' : 'Guardar'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Status Timeline History */}
                            <div className="space-y-3 pt-2">
                                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Historial de Acciones</span>
                                <div className="border-l-2 border-slate-100 pl-4 ml-2.5 space-y-5">
                                    {detail.historial.map((hist, idx) => {
                                        console.log("ITEM HISTORIAL:", hist);
                                        const rawDate = hist.fechaRegistro || (hist as any).fecha_registro || (hist as any).fecha;
                                        const actionText = String(hist.accion || "").toUpperCase();
                                        const isActivation = actionText.includes("ACTI") && !actionText.includes("DESACTI");
                                        return (
                                            <div key={hist.id || idx} className="relative">
                                                {/* Line indicator icon */}
                                                <div className={`absolute -left-[27px] top-0.5 rounded-full p-1 border-2 border-white shadow-sm flex items-center justify-center ${
                                                    isActivation ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                                                }`}>
                                                    {isActivation ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-xs font-bold text-corporate-dark">
                                                        {isActivation ? "Usuario Reactivado" : "Usuario Desactivado"}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {formatHistoryDate(rawDate)}
                                                    </p>
                                                    <p className="text-[10px] text-gray-500 font-medium">
                                                        Modificado por: <span className="font-semibold text-corporate-accent">{hist.modifierNombre || "Usuario Desconocido"}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {detail.historial.length === 0 && (
                                        <p className="text-xs text-gray-400 italic pl-1">No hay registros de estatus anteriores</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="border-t border-gray-100 p-6 bg-gray-50 flex justify-end shrink-0">
                    <Button onClick={onClose} className="px-5 py-2 text-xs bg-corporate-blue hover:bg-corporate-dark text-white rounded-lg transition-colors font-semibold shadow-sm">
                        Cerrar Perfil
                    </Button>
                </div>
            </div>
        </div>
    );
}
