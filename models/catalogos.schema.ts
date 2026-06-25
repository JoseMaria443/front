import { z } from "zod";

export const AreaSchema = z.object({
    idArea: z.string().uuid(),
    nombre: z.string().min(1, "El nombre es obligatorio"),
});
export type Area = z.infer<typeof AreaSchema>;

export const CargoSchema = z.object({
    idCargo: z.string().uuid(),
    nombre: z.string().min(1),
});
export type Cargo = z.infer<typeof CargoSchema>;

export const TipoComunicadoSchema = z.object({
    idTipoComunicado: z.string().uuid(),
    nombre: z.string(),
});
export type TipoComunicado = z.infer<typeof TipoComunicadoSchema>;

export const MedioRecepcionSchema = z.object({
    idMedioRecepcion: z.string().uuid(),
    nombre: z.string(),
});
export type MedioRecepcion = z.infer<typeof MedioRecepcionSchema>;

export const RolDestinatarioSchema = z.object({
    idRolDestinatario: z.string().uuid(),
    descripcionRol: z.string(),
});
export type RolDestinatario = z.infer<typeof RolDestinatarioSchema>;

export const RolResponsableSchema = z.object({
    idRolResponsable: z.string().uuid(),
    descripcionRol: z.string(),
});
export type RolResponsable = z.infer<typeof RolResponsableSchema>;

export const EstadoTareaSchema = z.object({
    idEstadoTarea: z.string().uuid(),
    nombre: z.string(),
});
export type EstadoTarea = z.infer<typeof EstadoTareaSchema>;