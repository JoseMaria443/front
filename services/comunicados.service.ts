import { Comunicado } from '../models/comunicado.schema';

// funcion de obtencion de los oficios recientes  / inyectarles las respuestas de la peticion en backend
const mockComunicados: Comunicado[] = [
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
        emisor: {
            idEmpleado: "e1", nombre: "Rectoría", email: "rectoria@univ.edu.mx",
            idArea: "a1", activo: true
        },
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
                        responsable: { idEmpleado: "11111111-1111-1111-1111-111111111111", nombre: "Dr. Martínez Reyes", email: "m.martinez@universidad.edu.mx", idArea: "a1", activo: true }
                    }
                ]
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
        idMedioRecepcion: "m1",
        idEmpleadoRegistro: "11111111-1111-1111-1111-111111111111",
        tipoComunicado: { idTipoComunicado: "t2", nombre: "Informativo" },
        emisor: {
            idEmpleado: "e2", nombre: "DACE", email: "dace@univ.edu.mx",
            idArea: "a2", activo: true
        }
    }
];

export const comunicadosService = {
    obtenerRecientes: async (): Promise<Comunicado[]> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockComunicados), 600);
        });
    }
};