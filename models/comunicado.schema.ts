import { z } from "zod";
import {
    TipoComunicadoSchema,
    MedioRecepcionSchema,
    RolDestinatarioSchema,
    EstadoTareaSchema,
    RolResponsableSchema
} from "./catalogos.schema";
import { EmpleadoSchema } from "./empleado.schema";

export const ArchivoEvidenciaSchema = z.object({
    idArchivoEvidencia: z.string().uuid(),
    doi: z.string(),
    descripcion: z.string(),
    urlArchivo: z.string().url(),
    nombreOriginal: z.string(),
    idElaborador: z.string().uuid(),
    fechaRegistro: z.string().datetime(),

    elaborador: EmpleadoSchema.optional(),
});
export type ArchivoEvidencia = z.infer<typeof ArchivoEvidenciaSchema>;

export const TareaResponsableSchema = z.object({
    idResponsable: z.string().uuid(),
    idRolResponsable: z.string().uuid(),

    responsable: EmpleadoSchema.optional(),
    rol: RolResponsableSchema.optional(),
});
export type TareaResponsable = z.infer<typeof TareaResponsableSchema>;

export const TareaSchema = z.object({
    idTarea: z.string().uuid(),
    idComunicado: z.string().uuid(),
    idEstadoTarea: z.string().uuid(),
    resumenActividad: z.string(),
    descripcion: z.string(),
    fechaEntrega: z.string().datetime(),
    fechaRegistro: z.string().datetime().optional(),

    estado: EstadoTareaSchema.optional(),
    responsables: z.array(TareaResponsableSchema).optional(),
    evidencias: z.array(ArchivoEvidenciaSchema).optional(),
});
export type Tarea = z.infer<typeof TareaSchema>;

export const ComunicadoArchivoSchema = z.object({
    idArchivo: z.string().uuid(),
    urlArchivo: z.string().url(),
    nombreOriginal: z.string(),
});
export type ComunicadoArchivo = z.infer<typeof ComunicadoArchivoSchema>;

export const ComunicadoDestinatarioSchema = z.object({
    idDestinatario: z.string().uuid(),
    idRolDestinatario: z.string().uuid(),

    destinatario: EmpleadoSchema.optional(),
    rol: RolDestinatarioSchema.optional(),
});
export type ComunicadoDestinatario = z.infer<typeof ComunicadoDestinatarioSchema>;

export const ComunicadoSchema = z.object({
    idComunicado: z.string().uuid(),
    folioDoi: z.string().min(1, "El folio es requerido"),
    numComunicado: z.string(),
    tema: z.string(),
    fechaEmision: z.string().datetime(),
    fechaRecepcion: z.string().datetime(),
    fechaRegistro: z.string().datetime().optional(),

    idEmisor: z.string().uuid(),
    idTipoComunicado: z.string().uuid(),
    idMedioRecepcion: z.string().uuid(),
    idEmpleadoRegistro: z.string().uuid(),

    emisor: EmpleadoSchema.optional(),
    tipoComunicado: TipoComunicadoSchema.optional(),
    medioRecepcion: MedioRecepcionSchema.optional(),
    empleadoRegistro: EmpleadoSchema.optional(),
    destinatarios: z.array(ComunicadoDestinatarioSchema).optional(),
    archivos: z.array(ComunicadoArchivoSchema).optional(),
    tareas: z.array(TareaSchema).optional(),
    areaEmisoraNombre: z.string().optional(),
    empleadoRegistroNombre: z.string().optional(),
});
export type Comunicado = z.infer<typeof ComunicadoSchema>;