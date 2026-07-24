"use client";

import { useState, useEffect } from "react";
import { EvidenceSlideOver } from "../../../components/mis-tareas/EvidenceSlideOver";
import { TaskDetailSlideOver } from "../../../components/comunicados/TaskDetailSlideOver";
import { EvidenciaDetailSlideOver } from "../../../components/comunicados/EvidenciaDetailSlideOver";
import { Button } from "../../../components/ui/Button";
import { Clock, AlertTriangle, UploadCloud, Calendar, CheckSquare } from "lucide-react";
import { useSessionStore } from "../../../store/session.store";
import { api } from "../../../services/api.config";

const getInitials = (nombre?: string) => {
    if (!nombre) return "U";
    return nombre.split(' ').filter(n => n.length > 0).map(n => n[0]).join('').slice(0, 2).toUpperCase();
};

const getEstadoBadge = (status?: string) => {
    switch (status) {
        case "Completada":
            return "bg-emerald-50 text-emerald-600 border-emerald-100";
        case "En Progreso":
            return "bg-amber-50 text-amber-600 border-amber-100";
        default:
            return "bg-slate-50 text-slate-500 border-slate-200";
    }
};

export default function MisTareasPage() {
    const { user } = useSessionStore();
    // @ts-ignore
    const loggedInUserId = user?.id || user?.idEmpleado || "11111111-1111-1111-1111-111111111111"; // Dr. Martínez Reyes

    const [tasksList, setTasksList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [filtroUrgencia, setFiltroUrgencia] = useState("Todas");

    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);

    const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<any>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const [selectedEvidenceForDetail, setSelectedEvidenceForDetail] = useState<any>(null);
    const [isEvidenceDetailOpen, setIsEvidenceDetailOpen] = useState(false);

    const fetchTasks = async () => {
        setIsLoading(true);
        setError("");
        try {
            const [tasksRes, comsRes, empsRes] = await Promise.all([
                api.get<any[]>('/tareas/'),
                api.get<any[]>('/comunicados/'),
                api.get<any[]>('/api/empleado/?activo=true')
            ]);

            const comsMap = new Map(comsRes.data.map(c => [c.id, c]));
            const empsMap = new Map(empsRes.data.map(e => [e.id, e]));

            const filtered = tasksRes.data.filter((t: any) => {
                return t.responsables?.some((r: any) => r.idEmpleado === loggedInUserId);
            });

            const mapped = filtered.map((t: any) => {
                const com = comsMap.get(t.idComunicado);
                const status = t.estado || "Asignada";
                
                return {
                    id: t.id,
                    idTarea: t.id,
                    idComunicado: t.idComunicado,
                    code: com?.folioDoi || "N/A",
                    taskCode: t.id.slice(0, 5).toUpperCase(),
                    title: t.resumenActividad,
                    descripcion: t.descripcion,
                    fechaEntrega: t.fechaEntrega,
                    date: new Date(t.fechaEntrega).toLocaleDateString('es-MX', {
                        day: 'numeric', month: 'short', year: 'numeric'
                    }),
                    status: status,
                    urgency: status === "Completada" ? "Completada" : "2d restantes",
                    avatars: t.responsables?.map((r: any) => {
                        const emp = empsMap.get(r.idEmpleado);
                        return getInitials(emp?.nombre);
                    }) || [],
                    responsables: t.responsables?.map((r: any) => {
                        const emp = empsMap.get(r.idEmpleado);
                        return {
                            idResponsable: r.idEmpleado,
                            responsable: emp ? {
                                idEmpleado: emp.id,
                                nombre: emp.nombre,
                                email: emp.email,
                                idArea: emp.idArea,
                                activo: emp.activo
                            } : undefined
                        };
                    }) || [],
                    evidencias: t.evidencias?.map((ev: any) => {
                        const emp = empsMap.get(ev.idElaborador || ev.idUsuario);
                        return {
                            idArchivoEvidencia: ev.idArchivoEvidencia || ev.id,
                            doi: ev.doi,
                            nombreOriginal: ev.nombreOriginal,
                            urlArchivo: ev.urlArchivo,
                            fechaRegistro: ev.fechaRegistro,
                            elaboradorNombre: ev.elaboradorNombre || emp?.nombre,
                            elaborador: emp ? {
                                idEmpleado: emp.id,
                                nombre: emp.nombre,
                                email: emp.email,
                                idArea: emp.idArea,
                                activo: emp.activo
                            } : undefined
                        };
                    }) || []
                };
            });

            setTasksList(mapped);
        } catch (err) {
            console.error("Error loading tasks:", err);
            setError("Error al cargar las tareas desde el servidor.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [loggedInUserId]);

    const openEvidenceModal = (task: any) => {
        setSelectedTask(task);
        setIsSlideOverOpen(true);
    };

    const handleRowClick = (task: any) => {
        setSelectedTaskForDetail({
            idTarea: task.id,
            idComunicado: task.idComunicado,
            resumenActividad: task.title,
            descripcion: task.descripcion,
            fechaEntrega: task.fechaEntrega,
            estado: { nombre: task.status },
            responsables: task.responsables,
            colaboradores: [],
            evidencias: task.evidencias
        });
        setIsDetailOpen(true);
    };

    const handleEvidenceSuccess = async (evs: any[]) => {
        if (selectedTask) {
            const taskId = selectedTask.id;
            try {
                for (const e of evs) {
                    const payload = {
                        idTarea: taskId,
                        doi: e.doi,
                        descripcion: e.descripcion,
                        urlArchivo: "https://simulacion-cloudinary.com/evidencia.pdf",
                        nombreOriginal: "evidencia.pdf"
                    };
                    await api.post('/evidencias/', payload);
                }
                setIsSlideOverOpen(false);
                fetchTasks();
            } catch (err) {
                console.error("Error creating evidence:", err);
            }
        }
    };

    const filteredTasks = tasksList.filter((task) => {
        if (filtroUrgencia === "Todas") return true;
        if (filtroUrgencia === "Alta") return task.status === "Pendiente";
        if (filtroUrgencia === "Media") return task.status === "En Progreso";
        if (filtroUrgencia === "Baja") return task.status === "Completada";
        return true;
    });

    const countAlta = tasksList.filter(t => t.status === "Pendiente").length;
    const countMedia = tasksList.filter(t => t.status === "En Progreso").length;
    const countBaja = tasksList.filter(t => t.status === "Completada").length;

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-corporate-dark">Mis Tareas</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Inbox personal · {tasksList.length} tareas asignadas ordenadas por fecha de entrega
                </p>
            </div>

            <div className="flex items-center gap-3 mb-6">
                <span className="text-sm text-gray-500 mr-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filtrar por:
                </span>
                <button 
                    onClick={() => setFiltroUrgencia("Todas")}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-colors cursor-pointer ${
                        filtroUrgencia === "Todas" 
                            ? "bg-blue-50 text-corporate-blue border-blue-100" 
                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                >
                    Todas <span className="ml-1 bg-white border text-[10px] rounded-full px-1.5 py-0.5">{tasksList.length}</span>
                </button>
                <button 
                    onClick={() => setFiltroUrgencia("Alta")}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-colors cursor-pointer ${
                        filtroUrgencia === "Alta" 
                            ? "bg-red-50 text-red-600 border-red-100" 
                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                >
                    Pendientes <span className="ml-1 bg-gray-50 border text-[10px] rounded-full px-1.5 py-0.5">{countAlta}</span>
                </button>
                <button 
                    onClick={() => setFiltroUrgencia("Media")}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-colors cursor-pointer ${
                        filtroUrgencia === "Media" 
                            ? "bg-amber-50 text-amber-600 border-amber-100" 
                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                >
                    En Progreso <span className="ml-1 bg-gray-50 border text-[10px] rounded-full px-1.5 py-0.5">{countMedia}</span>
                </button>
                <button 
                    onClick={() => setFiltroUrgencia("Baja")}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-colors cursor-pointer ${
                        filtroUrgencia === "Baja" 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                >
                    Completadas <span className="ml-1 bg-gray-50 border text-[10px] rounded-full px-1.5 py-0.5">{countBaja}</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="py-4 pl-6 pr-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-40">Urgencia</th>
                                <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tarea</th>
                                <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-48">Fecha de Entrega</th>
                                <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-36">Responsables</th>
                                <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-36">Estado</th>
                                <th className="py-4 pr-6 pl-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-56 text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredTasks.map((t, idx) => (
                                <tr 
                                    key={t.id} 
                                    onClick={() => handleRowClick(t)}
                                    className={`${t.status === 'Pendiente' ? "bg-red-50/5" : "hover:bg-gray-50/50"} cursor-pointer transition-colors`}
                                >
                                    <td className="py-5 pl-6 pr-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                                            t.status === 'Completada' 
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                                : t.status === 'En Progreso' 
                                                ? 'bg-amber-50 text-amber-600 border-amber-100'
                                                : 'bg-red-50 text-red-600 border-red-100'
                                        }`}>
                                            {t.status === 'Completada' ? <CheckSquare className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                            {t.urgency}
                                        </span>
                                    </td>
                                    <td className="py-5 px-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-corporate-accent text-xs font-bold">{t.code}</span>
                                            <span className="text-gray-300 text-xs">•</span>
                                            <span className="text-corporate-accent text-xs font-bold">{t.taskCode}</span>
                                        </div>
                                        <p className="text-sm font-bold text-corporate-dark">{t.title}</p>
                                    </td>
                                    <td className="py-5 px-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                            <Calendar className={`w-4 h-4 ${t.status === 'Pendiente' ? 'text-red-400' : 'text-gray-400'}`} />
                                            <span className={t.status === 'Pendiente' ? 'text-red-500' : ''}>{t.date}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-4">
                                        <div className="flex -space-x-2">
                                            {t.avatars.map((initials: string, i: number) => (
                                                <div
                                                    key={i}
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white ${
                                                        initials === 'CG' ? 'bg-emerald-500' :
                                                        initials === 'MR' ? 'bg-corporate-blue' :
                                                        initials === 'AL' ? 'bg-violet-500' : 'bg-pink-500'
                                                    }`}
                                                >
                                                    {initials}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-5 px-4">
                                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${getEstadoBadge(t.status)}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="py-5 pr-6 pl-4 text-right">
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openEvidenceModal(t);
                                            }}
                                            className="bg-corporate-accent hover:bg-corporate-blue text-white rounded-lg py-2.5 shadow-sm text-sm cursor-pointer ml-auto"
                                        >
                                            <UploadCloud className="w-4 h-4 mr-2" />
                                            Atender / Subir Evidencia
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {filteredTasks.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-sm text-gray-500">
                                        No tienes tareas en esta categoría
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <EvidenceSlideOver
                isOpen={isSlideOverOpen}
                onClose={() => setIsSlideOverOpen(false)}
                task={selectedTask}
                onSuccess={handleEvidenceSuccess}
            />

            <TaskDetailSlideOver
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                task={selectedTaskForDetail}
            />

            <EvidenciaDetailSlideOver
                isOpen={isEvidenceDetailOpen}
                onClose={() => setIsEvidenceDetailOpen(false)}
                evidencia={selectedEvidenceForDetail}
            />
        </div>
    );
}