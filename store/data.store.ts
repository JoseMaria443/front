import { create } from 'zustand';
import type { Comunicado, Tarea, ArchivoEvidencia } from '../models/comunicado.schema';
import type { Empleado } from '../models/empleado.schema';

interface DataState {
    comunicados: Comunicado[];
    empleados: Empleado[];
    areas: { idArea: string; nombre: string }[];
    tiposComunicado: { idTipoComunicado: string; nombre: string }[];
    mediosRecepcion: { idMedioRecepcion: string; nombre: string }[];
    estadosTarea: { idEstadoTarea: string; nombre: string }[];
    
    agregarComunicado: (nuevo: Comunicado) => void;
    agregarTareaAComunicado: (idComunicado: string, nuevaTarea: Tarea) => void;
    subirEvidenciaATarea: (idComunicado: string, idTarea: string, nuevasEvidencias: ArchivoEvidencia[]) => void;
}

const mockEmpleados: Empleado[] = [
    { idEmpleado: "11111111-1111-1111-1111-111111111111", nombre: "Dr. Martínez Reyes", email: "m.martinez@universidad.edu.mx", idArea: "a1", activo: true },
    { idEmpleado: "22222222-2222-2222-2222-222222222222", nombre: "Mtro. Carlos Gómez", email: "c.gomez@universidad.edu.mx", idArea: "a2", activo: true },
    { idEmpleado: "33333333-3333-3333-3333-333333333333", nombre: "Ing. Alicia López", email: "a.lopez@universidad.edu.mx", idArea: "a1", activo: true },
    { idEmpleado: "44444444-4444-4444-4444-444444444444", nombre: "Mtra. Patricia Valdéz", email: "p.valdez@universidad.edu.mx", idArea: "a2", activo: true }
];

const mockAreas = [
    { idArea: "a1", nombre: "Rectoría" },
    { idArea: "a2", nombre: "DACE" },
    { idArea: "a3", nombre: "División Básica" }
];

const mockTiposComunicado = [
    { idTipoComunicado: "t1", nombre: "Acción" },
    { idTipoComunicado: "t2", nombre: "Informativo" },
    { idTipoComunicado: "t3", nombre: "Auditoría" }
];

const mockMediosRecepcion = [
    { idMedioRecepcion: "m1", nombre: "Oficio Físico" },
    { idMedioRecepcion: "m2", nombre: "Correo Electrónico" },
    { idMedioRecepcion: "m3", nombre: "Sistema SICEEA" }
];

const mockEstadosTarea = [
    { idEstadoTarea: "est1", nombre: "Pendiente" },
    { idEstadoTarea: "est2", nombre: "En Progreso" },
    { idEstadoTarea: "est3", nombre: "Completada" }
];

const initialComunicados: Comunicado[] = [
    {
        idComunicado: "c1",
        folioDoi: "OFI-2025-0142",
        numComunicado: "REC-2025-0142",
        tema: "Actualización Plan Académico 2025-II",
        fechaEmision: "2025-06-06T10:00:00Z",
        fechaRecepcion: "2025-06-06T11:00:00Z",
        idEmisor: "e1",
        idTipoComunicado: "t1",
        idMedioRecepcion: "m1",
        idEmpleadoRegistro: "11111111-1111-1111-1111-111111111111",
        tipoComunicado: { idTipoComunicado: "t1", nombre: "Acción" },
        medioRecepcion: { idMedioRecepcion: "m1", nombre: "Oficio Físico" },
        emisor: { idEmpleado: "e1", nombre: "Rectoría", email: "rectoria@univ.edu.mx", idArea: "a1", activo: true },
        tareas: [
            {
                idTarea: "tar1",
                idComunicado: "c1",
                idEstadoTarea: "est1",
                resumenActividad: "Actualizar perfil de egreso Ing. Sistemas",
                descripcion: "Incorporar modificaciones al plan académico según acuerdos.",
                fechaEntrega: "2025-06-15T23:59:00Z",
                estado: { idEstadoTarea: "est1", nombre: "Pendiente" },
                responsables: [
                    {
                        idResponsable: "11111111-1111-1111-1111-111111111111",
                        idRolResponsable: "r1",
                        responsable: mockEmpleados[0]
                    }
                ],
                evidencias: []
            }
        ],
        archivos: [
            {
                idArchivo: "f1",
                urlArchivo: "https://universidad.edu.mx/files/plan_academico_2025.pdf",
                nombreOriginal: "plan_academico_2025.pdf"
            }
        ]
    },
    {
        idComunicado: "c2",
        folioDoi: "OFI-2025-0141",
        numComunicado: "DACE-2025-0141",
        tema: "Convocatoria Evaluación Docente Integral",
        fechaEmision: "2025-06-05T09:00:00Z",
        fechaRecepcion: "2025-06-05T09:30:00Z",
        idEmisor: "e2",
        idTipoComunicado: "t2",
        idMedioRecepcion: "m2",
        idEmpleadoRegistro: "11111111-1111-1111-1111-111111111111",
        tipoComunicado: { idTipoComunicado: "t2", nombre: "Informativo" },
        medioRecepcion: { idMedioRecepcion: "m2", nombre: "Correo Electrónico" },
        emisor: { idEmpleado: "e2", nombre: "DACE", email: "dace@univ.edu.mx", idArea: "a2", activo: true },
        tareas: [
            {
                idTarea: "tar2",
                idComunicado: "c2",
                idEstadoTarea: "est2",
                resumenActividad: "Preparación Junta de Academia División Básica",
                descripcion: "Coordinar los temas de agenda y el orden del día.",
                fechaEntrega: "2025-06-13T23:59:00Z",
                estado: { idEstadoTarea: "est2", nombre: "En Progreso" },
                responsables: [
                    {
                        idResponsable: "22222222-2222-2222-2222-222222222222",
                        idRolResponsable: "r1",
                        responsable: mockEmpleados[1]
                    }
                ],
                evidencias: []
            }
        ],
        archivos: [
            {
                idArchivo: "f2",
                urlArchivo: "https://universidad.edu.mx/files/convocatoria_docente_2025.pdf",
                nombreOriginal: "convocatoria_docente_2025.pdf"
            }
        ]
    }
];

export const useDataStore = create<DataState>((set) => ({
    comunicados: initialComunicados,
    empleados: mockEmpleados,
    areas: mockAreas,
    tiposComunicado: mockTiposComunicado,
    mediosRecepcion: mockMediosRecepcion,
    estadosTarea: mockEstadosTarea,

    agregarComunicado: (nuevo) => set((state) => ({
        comunicados: [nuevo, ...state.comunicados]
    })),

    agregarTareaAComunicado: (idComunicado, nuevaTarea) => set((state) => ({
        comunicados: state.comunicados.map((c) => {
            if (c.idComunicado === idComunicado) {
                return {
                    ...c,
                    tareas: [...(c.tareas || []), nuevaTarea]
                };
            }
            return c;
        })
    })),

    subirEvidenciaATarea: (idComunicado, idTarea, nuevasEvidencias) => set((state) => ({
        comunicados: state.comunicados.map((c) => {
            if (c.idComunicado === idComunicado) {
                return {
                    ...c,
                    tareas: (c.tareas || []).map((t) => {
                        if (t.idTarea === idTarea) {
                            return {
                                ...t,
                                evidencias: [...(t.evidencias || []), ...nuevasEvidencias]
                            };
                        }
                        return t;
                    })
                };
            }
            return c;
        })
    }))
}));
