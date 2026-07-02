"use client";
//Descripcion --> NO (Historia)

import { useState } from "react";
import { EvidenceSlideOver, MockTask } from "../../../components/mis-tareas/EvidenceSlideOver";
import { Button } from "../../../components/ui/Button";
import { Clock, AlertTriangle, UploadCloud, Calendar } from "lucide-react";

const mockTasks = [
    {
        id: 1,
        code: "COM-2026-0131",
        taskCode: "T-002",
        title: "Difundir convocatoria movilidad estudiantil",
        urgency: "2d restantes",
        urgencyType: "danger",
        date: "10 Jun 2026",
        avatars: ["CG"],
    },
    {
        id: 2,
        code: "COM-2026-0135",
        taskCode: "T-005",
        title: "Preparación Junta de Academia División Básica",
        urgency: "Próxima",
        urgencyType: "warning",
        date: "13 Jun 2026",
        avatars: ["CG"],
    },
    {
        id: 3,
        code: "COM-2026-0142",
        taskCode: "T-001",
        title: "Actualizar perfil de egreso Ing. Sistemas",
        urgency: "Urgente",
        urgencyType: "danger",
        date: "15 Jun 2026",
        avatars: ["MR", "AL"],
    },
    {
        id: 4,
        code: "COM-2026-0137",
        taskCode: "T-004",
        title: "Llenar formato eficiencia terminal 2024",
        urgency: "Urgente",
        urgencyType: "danger",
        date: "15 Jun 2026",
        avatars: ["MR", "PV", "AL"],
    },
];

export default function MisTareasPage() {
    const [selectedTask, setSelectedTask] = useState<MockTask | null>(null);
    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);

    const openEvidenceModal = (task: MockTask) => {
        setSelectedTask(task);
        setIsSlideOverOpen(true);
    };

    return (
        <div className="space-y-6">

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-corporate-dark">Mis Tareas</h1>
                <p className="text-sm text-gray-500 mt-1">Inbox personal · 6 tareas ordenadas por fecha de entrega</p>
            </div>

            <div className="flex items-center gap-3 mb-6">
                <span className="text-sm text-gray-500 mr-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Urgencia:
                </span>
                <button className="rounded-full bg-blue-50 text-corporate-blue px-4 py-1.5 text-sm font-medium border border-blue-100">
                    Todas <span className="ml-1 bg-white text-corporate-blue rounded-full px-1.5 py-0.5 text-[10px]">6</span>
                </button>
                <button className="rounded-full bg-white text-gray-600 px-4 py-1.5 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors">
                    Alta <span className="ml-1 bg-gray-100 rounded-full px-1.5 py-0.5 text-[10px]">3</span>
                </button>
                <button className="rounded-full bg-white text-gray-600 px-4 py-1.5 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors">
                    Media <span className="ml-1 bg-gray-100 rounded-full px-1.5 py-0.5 text-[10px]">1</span>
                </button>
                <button className="rounded-full bg-white text-gray-600 px-4 py-1.5 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors">
                    Baja <span className="ml-1 bg-gray-100 rounded-full px-1.5 py-0.5 text-[10px]">2</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="py-4 pl-6 pr-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-40">Urgencia</th>
                                <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tarea</th>
                                <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-48">Fecha de Entrega</th>
                                <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-36">Responsables</th>
                                <th className="py-4 pr-6 pl-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-56">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {mockTasks.map((t, idx) => (
                                <tr key={t.id} className={idx === 2 ? "bg-blue-50/30" : "hover:bg-gray-50/50"}>
                                    <td className="py-5 pl-6 pr-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${t.urgencyType === 'danger' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                            {t.urgencyType === 'danger' ? <Clock className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                                            {t.urgency}
                                        </span>
                                    </td>
                                    <td className="py-5 px-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-corporate-accent text-xs font-semibold">{t.code}</span>
                                            <span className="text-gray-300 text-xs">•</span>
                                            <span className="text-corporate-accent text-xs font-semibold">{t.taskCode}</span>
                                        </div>
                                        <p className="text-sm font-semibold text-corporate-dark">{t.title}</p>
                                    </td>
                                    <td className="py-5 px-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                            <Calendar className={`w-4 h-4 ${t.urgencyType === 'danger' ? 'text-red-400' : 'text-gray-400'}`} />
                                            <span className={t.urgencyType === 'danger' ? 'text-red-500' : ''}>{t.date}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-4">
                                        <div className="flex -space-x-2">
                                            {t.avatars.map((initials, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white ${initials === 'CG' ? 'bg-emerald-500' :
                                                        initials === 'MR' ? 'bg-corporate-blue' :
                                                            initials === 'AL' ? 'bg-violet-500' : 'bg-pink-500'
                                                        }`}
                                                >
                                                    {initials}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-5 pr-6 pl-4">
                                        <Button
                                            onClick={() => openEvidenceModal(t)}
                                            className="w-full bg-corporate-accent hover:bg-corporate-blue text-white rounded-lg py-2.5 shadow-sm text-sm"
                                        >
                                            <UploadCloud className="w-4 h-4 mr-2" />
                                            Atender / Subir Evidencia
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <EvidenceSlideOver
                isOpen={isSlideOverOpen}
                onClose={() => setIsSlideOverOpen(false)}
                task={selectedTask}
            />

        </div>
    );
}