import { z } from "zod";
import { AreaSchema, CargoSchema } from "./catalogos.schema";

export const EmpleadoSchema = z.object({
    idEmpleado: z.string().uuid(),
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    email: z.string().email("Correo inválido"),
    idArea: z.string().uuid(),
    activo: z.boolean().default(true),
    fechaRegistro: z.string().datetime().optional(),

    area: AreaSchema.optional(),
    cargos: z.array(CargoSchema).optional(),
    cargos_nombres: z.array(z.string()).optional(),
});
export type Empleado = z.infer<typeof EmpleadoSchema>;

export const HistorialEstatusSchema = z.object({
    idHistorial: z.string().uuid(),
    idEmpleadoAfectado: z.string().uuid(),
    idEmpleadoModifica: z.string().uuid(),
    accion: z.enum(["DESACTIVACION", "REACTIVACION"]),
    fechaRegistro: z.string().datetime(),

    empleadoModifica: EmpleadoSchema.optional(),
});
export type HistorialEstatus = z.infer<typeof HistorialEstatusSchema>;