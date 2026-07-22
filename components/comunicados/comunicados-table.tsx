"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, Plus, UploadCloud, Info, CheckSquare, Clock } from "lucide-react";
import type { Comunicado, Tarea } from "../../models/comunicado.schema";
import { NewTaskSlideOver } from "./NewTaskSlideOver";
import { ComunicadoDetailSlideOver } from "./ComunicadoDetailSlideOver";
import { EvidenceSlideOver } from "../mis-tareas/EvidenceSlideOver";
import { TaskDetailSlideOver } from "./TaskDetailSlideOver";
import { api } from "../../services/api.config";

const medioStyles: Record<string, string> = {
    "Oficio Físico": "bg-red-50 text-red-600 border-red-100",
    "Correo Electrónico": "bg-sky-50 text-sky-600 border-sky-100",
    "Sistema SICEEA": "bg-purple-50 text-purple-600 border-purple-100",
};

const getEstadoBadge = (estado?: string) => {
    switch (estado?.toLowerCase()) {
        case "completada":
            return "bg-emerald-50 text-emerald-600 border-emerald-100";
        case "en progreso":
        case "en-proceso":
            return "bg-amber-50 text-amber-600 border-amber-100";
        default:
            return "bg-slate-50 text-slate-500 border-slate-200";
    }
};

const getInitials = (nombre?: string) => {
    if (!nombre) return "U";
    return nombre.split(' ').filter(n => n.length > 0).map(n => n[0]).join('').slice(0, 2).toUpperCase();
};

interface ComunicadosTableProps {
    refreshKey: number;
    onRefreshNeeded: () => void;
}

export function ComunicadosTable({ refreshKey, onRefreshNeeded }: ComunicadosTableProps) {
    const [comunicadosList, setComunicadosList] = useState<Comunicado[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // States for row expansion
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
    
    const [selectedComunicado, setSelectedComunicado] = useState<Comunicado | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<Tarea | null>(null);
    const [isTaskDetailSlideOverOpen, setIsTaskDetailSlideOverOpen] = useState(false);
    
    const [activeComunicadoIdForNewTask, setActiveComunicadoIdForNewTask] = useState<string | null>(null);
    const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
    
    const [activeTaskForEvidence, setActiveTaskForEvidence] = useState<{ comunicadoId: string; task: Tarea } | null>(null);
    const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);

    const fetchComunicados = async () => {
        setIsLoading(true);
        try {
            const response = await api.get<any[]>('/comunicados/');
            const tasksResponse = await api.get<any[]>('/tareas/');
            const [tiposRes, mediosRes, areasRes, empsRes, rolesRespRes] = await Promise.all([
                api.get<any[]>('/tipos-comunicado/todos'),
                api.get<any[]>('/medios-recepcion/todos'),
                api.get<any[]>('/areas/todos'),
                api.get<any[]>('/api/empleado/?activo=true'),
                api.get<any[]>('/roles-responsable/todos')
            ]);
            
            const tiposMap = new Map(tiposRes.data.map(t => [t.id, t]));
            const mediosMap = new Map(mediosRes.data.map(m => [m.id, m]));
            const areasMap = new Map(areasRes.data.map(a => [a.id, a]));
            const empsMap = new Map(empsRes.data.map(e => [e.id, e]));
            const rolesRespMap = new Map(rolesRespRes.data.map(r => [r.id, r]));

            // Group tasks by comunicadoId
            const tasksByComunicado = new Map<string, any[]>();
            for (const t of tasksResponse.data) {
                const comId = t.idComunicado;
                if (!tasksByComunicado.has(comId)) {
                    tasksByComunicado.set(comId, []);
                }
                
                const lideres: any[] = [];
                const colaboradores: any[] = [];
                for (const resp of t.responsables || []) {
                    const emp = empsMap.get(resp.idResponsable);
                    const rol = rolesRespMap.get(resp.idRolResponsable);
                    const isColab = rol?.descripcion_rol?.toLowerCase().includes("apoyo") || 
                                    rol?.descripcion_rol?.toLowerCase().includes("colaborador") ||
                                    resp.idRolResponsable === "00000000-0000-0000-0000-000000000002"; // rol_apoyo_id
                    
                    const mappedEmp = emp ? {
                        idEmpleado: emp.id,
                        nombre: emp.nombre,
                        email: emp.email,
                        idArea: emp.idArea,
                        activo: emp.activo
                    } : undefined;
                    
                    if (isColab) {
                        colaboradores.push(mappedEmp);
                    } else {
                        lideres.push({
                            idResponsable: resp.idResponsable,
                            idRolResponsable: resp.idRolResponsable,
                            responsable: mappedEmp
                        });
                    }
                }

                const mappedTask = {
                    idTarea: t.id,
                    idComunicado: t.idComunicado,
                    idEstadoTarea: t.idEstadoTarea,
                    resumenActividad: t.resumenActividad,
                    descripcion: t.descripcion,
                    fechaEntrega: t.fechaEntrega,
                    fechaRegistro: t.fechaRegistro,
                    estado: { idEstadoTarea: t.idEstadoTarea, nombre: t.estado || "Asignada" },
                    responsables: lideres,
                    colaboradores: colaboradores,
                    evidencias: []
                };
                
                tasksByComunicado.get(comId)?.push(mappedTask);
            }
            
            // Get all evidences
            const evidencesResponse = await api.get<any[]>('/evidencias/');
            const evidencesByTask = new Map<string, any[]>();
            for (const ev of evidencesResponse.data) {
                const tId = ev.idTarea;
                if (!evidencesByTask.has(tId)) {
                    evidencesByTask.set(tId, []);
                }
                const emp = empsMap.get(ev.idElaborador);
                evidencesByTask.get(tId)?.push({
                    idArchivoEvidencia: ev.id,
                    doi: ev.doi,
                    descripcion: ev.descripcion,
                    urlArchivo: ev.urlArchivo,
                    nombreOriginal: ev.nombreOriginal,
                    idElaborador: ev.idElaborador,
                    fechaRegistro: ev.fechaRegistro,
                    elaborador: emp ? {
                        idEmpleado: emp.id,
                        nombre: emp.nombre,
                        email: emp.email,
                        idArea: emp.idArea,
                        activo: emp.activo
                    } : undefined
                });
            }

            // Assign evidences to their tasks
            for (const [comId, tList] of tasksByComunicado.entries()) {
                for (const t of tList) {
                    t.evidencias = evidencesByTask.get(t.idTarea) || [];
                }
            }

            const mapped: Comunicado[] = response.data.map((c) => {
                const comId = c.id;
                const emisorArea = areasMap.get(c.idEmisor);
                const regEmp = empsMap.get(c.idEmpleadoRegistro);

                return {
                    idComunicado: comId,
                    folioDoi: c.folioDoi,
                    numComunicado: c.numComunicado,
                    tema: c.tema,
                    fechaEmision: c.fechaEmision,
                    fechaRecepcion: c.fechaRecepcion,
                    fechaRegistro: c.fechaRegistro,
                    idEmisor: c.idEmisor,
                    idTipoComunicado: c.idTipoComunicado,
                    idMedioRecepcion: c.idMedioRecepcion,
                    idEmpleadoRegistro: c.idEmpleadoRegistro,
                    idEstadoComunicado: c.idEstadoComunicado,
                    areaEmisoraNombre: c.areaEmisoraNombre,
                    empleadoRegistroNombre: c.empleadoRegistroNombre,
                    tipoComunicado: tiposMap.has(c.idTipoComunicado)
                        ? { idTipoComunicado: c.idTipoComunicado, nombre: tiposMap.get(c.idTipoComunicado).nombre }
                        : undefined,
                    medioRecepcion: mediosMap.has(c.idMedioRecepcion)
                        ? { idMedioRecepcion: c.idMedioRecepcion, nombre: mediosMap.get(c.idMedioRecepcion).nombre }
                        : undefined,
                    emisor: emisorArea ? {
                        idEmpleado: emisorArea.id,
                        nombre: emisorArea.nombre,
                        email: "contacto@univ.edu.mx",
                        idArea: emisorArea.id,
                        activo: true
                    } : undefined,
                    empleadoRegistro: regEmp ? {
                        idEmpleado: regEmp.id,
                        nombre: regEmp.nombre,
                        email: regEmp.email,
                        idArea: regEmp.idArea,
                        activo: regEmp.activo
                    } : undefined,
                    tareas: tasksByComunicado.get(comId) || [],
                    archivos: c.archivoUrl ? [
                        {
                            idArchivo: comId + "_file",
                            urlArchivo: c.archivoUrl,
                            nombreOriginal: c.archivoUrl.split('/').pop() || "archivo.pdf"
                        }
                    ] : []
                };
            });

            const sorted = mapped.sort((a, b) => new Date(b.fechaEmision).getTime() - new Date(a.fechaEmision).getTime());
            setComunicadosList(sorted);
        } catch (err) {
            console.error("Error loading repository data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComunicados();
    }, [refreshKey]);

    const toggleRow = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleRowClick = (comunicado: Comunicado) => {
        setSelectedComunicado(comunicado);
        setIsDetailOpen(true);
    };

    const handleOpenNewTask = (idComunicado: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveComunicadoIdForNewTask(idComunicado);
        setIsNewTaskOpen(true);
    };

    const handleOpenEvidence = (comunicadoId: string, task: Tarea, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveTaskForEvidence({ comunicadoId, task });
        setIsEvidenceOpen(true);
    };

    const handleEvidenceSuccess = async (evs: any[]) => {
        if (activeTaskForEvidence) {
            const { task } = activeTaskForEvidence;
            try {
                for (const e of evs) {
                    const payload = {
                        idTarea: task.idTarea,
                        doi: e.doi,
                        descripcion: e.descripcion,
                        urlArchivo: "https://simulacion-cloudinary.com/evidencia.pdf",
                        nombreOriginal: "evidencia.pdf"
                    };
                    await api.post('/evidencias/', payload);
                }
                setIsEvidenceOpen(false);
                onRefreshNeeded();
            } catch (err) {
                console.error("Error creating evidence:", err);
            }
        }
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_2px_10px_rgb(0,0,0,0.04)]">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                            <th className="w-12 py-4 pl-4 text-center"></th>
                            <th className="py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Folio / DOI</th>
                            <th className="py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Tema</th>
                            <th className="py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Área Emisora</th>
                            <th className="py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Fecha Emisión</th>
                            <th className="py-4 pr-6 text-xs font-bold uppercase tracking-wider text-gray-400 text-right">Medio</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-sm text-gray-500">
                                    Cargando comunicados...
                                </td>
                            </tr>
                        ) : refreshKey >= 0 && comunicadosList.map((item) => {
                            const isExpanded = expandedRows[item.idComunicado] || false;
                            const medioNombre = item.medioRecepcion?.nombre || "Correo Electrónico";
                            const estiloMedio = medioStyles[medioNombre] || "bg-gray-50 text-gray-600 border-gray-200";

                            return (
                                <tr key={item.idComunicado} className="group/row transition-all duration-200 border-b border-gray-50">
                                    <td colSpan={6} className="p-0">
                                        {/* Main Row */}
                                        <div 
                                            onClick={() => handleRowClick(item)}
                                            className="flex items-center w-full hover:bg-gray-50/50 transition-colors cursor-pointer py-4"
                                        >
                                            <div 
                                                onClick={(e) => toggleRow(item.idComunicado, e)}
                                                className="w-12 flex justify-center text-gray-300 group-hover/row:text-corporate-accent transition-colors"
                                            >
                                                {isExpanded ? (
                                                    <ChevronDown className="h-5 w-5" />
                                                ) : (
                                                    <ChevronRight className="h-5 w-5" />
                                                )}
                                            </div>
                                            <div className="flex-1 grid grid-cols-5 items-center gap-4">
                                                <div className="col-span-1">
                                                    <span className="text-sm font-bold text-corporate-accent">{item.folioDoi}</span>
                                                </div>
                                                <div className="col-span-1.5 pr-4 text-sm font-medium text-corporate-dark truncate max-w-[200px]">
                                                    {item.tema}
                                                </div>
                                                <div className="col-span-1 pr-4 text-sm text-gray-500 truncate">
                                                    {item.areaEmisoraNombre || item.emisor?.nombre || "N/A"}
                                                </div>
                                                <div className="col-span-1 text-sm tabular-nums text-gray-500">
                                                    {new Date(item.fechaEmision).toLocaleDateString('es-MX', {
                                                        year: 'numeric', month: 'short', day: 'numeric'
                                                    })}
                                                </div>
                                                <div className="col-span-0.5 flex justify-end pr-6">
                                                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${estiloMedio}`}>
                                                        {medioNombre}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expansion Nivel 2 & 3 */}
                                        {isExpanded && (
                                            <div className="bg-slate-50/50 border-t border-gray-100/50 px-6 py-5 space-y-4 animate-in fade-in duration-200">
                                                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                                    <h4 className="text-xs font-bold uppercase tracking-wider text-corporate-dark flex items-center gap-1.5">
                                                        <CheckSquare className="h-4 w-4 text-corporate-accent" />
                                                        Tareas Vinculadas ({item.tareas?.length || 0})
                                                    </h4>
                                                    <button
                                                        onClick={(e) => handleOpenNewTask(item.idComunicado, e)}
                                                        className="inline-flex items-center gap-1 text-xs font-bold text-corporate-accent hover:text-corporate-blue transition-colors bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm cursor-pointer"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                        Agregar Tarea
                                                    </button>
                                                </div>

                                                {/* Task List (Nivel 2) */}
                                                {item.tareas && item.tareas.length > 0 ? (
                                                    <div className="space-y-4">
                                                        {item.tareas.map((task) => (
                                                            <div 
                                                                key={task.idTarea} 
                                                                onClick={() => {
                                                                    setSelectedTaskForDetail(task);
                                                                    setIsTaskDetailSlideOverOpen(true);
                                                                }}
                                                                className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm space-y-3 hover:bg-gray-50/50 cursor-pointer transition-colors duration-150"
                                                            >
                                                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                                                                    <div>
                                                                        <h5 className="text-sm font-bold text-corporate-dark">
                                                                            {task.resumenActividad}
                                                                        </h5>
                                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                                            {task.descripcion}
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getEstadoBadge(task.estado?.nombre)}`}>
                                                                            {task.estado?.nombre || "Asignada"}
                                                                        </span>
                                                                        <button
                                                                            onClick={(e) => handleOpenEvidence(item.idComunicado, task, e)}
                                                                            className="inline-flex items-center gap-1 text-xs font-semibold text-corporate-accent hover:bg-blue-50/50 p-1.5 rounded-lg transition-colors border border-corporate-accent/20 cursor-pointer"
                                                                        >
                                                                            <UploadCloud className="h-3.5 w-3.5" />
                                                                            Subir Evidencia
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                {/* Responsables & Colaboradores */}
                                                                <div className="flex flex-wrap items-center gap-6 text-xs border-t border-gray-50 pt-2.5">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-semibold text-gray-400">Responsables:</span>
                                                                        <div className="flex -space-x-1.5">
                                                                            {task.responsables?.map((r, i) => (
                                                                                <div 
                                                                                    key={i}
                                                                                    title={r.responsable?.nombre}
                                                                                    className="w-6 h-6 rounded-full bg-corporate-blue text-white text-[10px] font-bold flex items-center justify-center border border-white"
                                                                                >
                                                                                    {getInitials(r.responsable?.nombre)}
                                                                                </div>
                                                                            ))}
                                                                            {(!task.responsables || task.responsables.length === 0) && (
                                                                                <span className="text-gray-400 italic">Ninguno</span>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {/* Colaboradores */}
                                                                    {task.colaboradores && task.colaboradores.length > 0 && (
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="font-semibold text-gray-400">Colaboradores:</span>
                                                                            <div className="flex -space-x-1.5">
                                                                                {task.colaboradores.map((colab, i) => (
                                                                                    <div 
                                                                                        key={i}
                                                                                        title={colab.nombre}
                                                                                        className="w-6 h-6 rounded-full bg-purple-500 text-white text-[10px] font-bold flex items-center justify-center border border-white"
                                                                                    >
                                                                                        {getInitials(colab.nombre)}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    
                                                                    <div className="flex items-center gap-1 text-gray-400">
                                                                        <Clock className="h-3 w-3" />
                                                                        <span>Entrega: {new Date(task.fechaEntrega).toLocaleDateString()}</span>
                                                                    </div>
                                                                </div>

                                                                {/* Evidencias (Nivel 3) */}
                                                                {task.evidencias && task.evidencias.length > 0 && (
                                                                    <div className="mt-3 bg-slate-50 rounded-xl p-3 border border-slate-100/50 space-y-2">
                                                                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                                            Evidencias Cargadas ({task.evidencias.length})
                                                                        </span>
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                            {task.evidencias.map((ev) => (
                                                                                <div 
                                                                                    key={ev.idArchivoEvidencia} 
                                                                                    className="bg-white border border-gray-100 rounded-lg p-2.5 flex items-center justify-between text-xs shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                                                                                >
                                                                                    <div className="space-y-0.5 truncate pr-2">
                                                                                        <p className="font-bold text-corporate-dark truncate">
                                                                                            {ev.nombreOriginal}
                                                                                        </p>
                                                                                        <p className="text-[10px] text-gray-400">
                                                                                            DOI: <span className="font-medium text-corporate-accent">{ev.doi}</span>
                                                                                        </p>
                                                                                        <p className="text-[9px] text-gray-500">
                                                                                            Subido por: <span className="font-semibold">{ev.elaborador?.nombre || "Usuario Desconocido"}</span>
                                                                                        </p>
                                                                                    </div>
                                                                                    <span className="text-[9px] text-gray-400 font-medium whitespace-nowrap bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                                                                                        {new Date(ev.fechaRegistro).toLocaleDateString()}
                                                                                    </span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-gray-400 italic text-center py-4">
                                                        No hay tareas asignadas para este comunicado
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        {!isLoading && refreshKey >= 0 && comunicadosList.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-sm text-gray-500">
                                    No hay comunicados registrados
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* SlideOver Components */}
            <ComunicadoDetailSlideOver
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                comunicado={selectedComunicado}
            />

            <NewTaskSlideOver
                isOpen={isNewTaskOpen}
                onClose={() => setIsNewTaskOpen(false)}
                idComunicado={activeComunicadoIdForNewTask}
                onSuccess={() => {
                    setIsNewTaskOpen(false);
                    onRefreshNeeded();
                }}
            />

            <EvidenceSlideOver
                isOpen={isEvidenceOpen}
                onClose={() => setIsEvidenceOpen(false)}
                task={activeTaskForEvidence ? {
                    id: activeTaskForEvidence.task.idTarea,
                    code: activeTaskForEvidence.task.resumenActividad,
                    taskCode: activeTaskForEvidence.task.idTarea.slice(0, 5),
                    title: activeTaskForEvidence.task.resumenActividad,
                    urgency: "Urgente",
                    urgencyType: "danger",
                    date: new Date(activeTaskForEvidence.task.fechaEntrega).toLocaleDateString(),
                    avatars: []
                } : null}
                onSuccess={handleEvidenceSuccess}
            />

            <TaskDetailSlideOver
                isOpen={isTaskDetailSlideOverOpen}
                onClose={() => setIsTaskDetailSlideOverOpen(false)}
                task={selectedTaskForDetail}
            />
        </div>
    );
}