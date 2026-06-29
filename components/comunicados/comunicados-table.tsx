import { ChevronRight } from "lucide-react";
import type { Comunicado } from "../../models/comunicado.schema";

const medioStyles: Record<string, string> = {
    "Oficio Físico": "bg-red-50 text-red-600 border-red-100",
    "Correo Electrónico": "bg-sky-50 text-sky-600 border-sky-100",
    "Sistema SICEEA": "bg-purple-50 text-purple-600 border-purple-100",
};

interface ComunicadosTableProps {
    items: Comunicado[];
}

export function ComunicadosTable({ items }: ComunicadosTableProps) {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_2px_10px_rgb(0,0,0,0.04)]">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50 text-left">
                            <th className="w-10"></th>
                            <th className="pb-3 pt-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Folio / DOI</th>
                            <th className="pb-3 pt-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Tema</th>
                            <th className="pb-3 pt-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Área Emisora</th>
                            <th className="pb-3 pt-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Fecha Emisión</th>
                            <th className="pb-3 pt-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Medio</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {items.map((item) => {
                            const medioNombre = item.medioRecepcion?.nombre || "Correo Electrónico";
                            const estiloMedio = medioStyles[medioNombre] || "bg-gray-50 text-gray-600 border-gray-200";

                            return (
                                <tr key={item.idComunicado} className="group hover:bg-gray-50/80 transition-colors cursor-pointer">
                                    <td className="py-4 pl-4">
                                        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-corporate-accent transition-colors" />
                                    </td>
                                    <td className="py-4">
                                        <span className="text-sm font-semibold text-corporate-accent">{item.folioDoi}</span>
                                    </td>
                                    <td className="py-4 pr-4 text-sm text-gray-700">{item.tema}</td>
                                    <td className="py-4 pr-4 text-sm text-gray-500">{item.emisor?.nombre || "N/A"}</td>
                                    <td className="py-4 pr-4 text-sm tabular-nums text-gray-500">
                                        {new Date(item.fechaEmision).toLocaleDateString('es-MX', {
                                            year: 'numeric', month: 'short', day: 'numeric'
                                        })}
                                    </td>
                                    <td className="py-4 pr-4">
                                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${estiloMedio}`}>
                                            {medioNombre}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                        {items.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-sm text-gray-500">
                                    No hay comunicados registrados
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}