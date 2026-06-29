import { ChevronRight } from "lucide-react";
import { Button } from "../ui/Button";
import type { Comunicado } from "../../models/comunicado.schema";

const tipoStyles: Record<string, string> = {
    Acción: "text-red-500",
    Informativo: "text-sky-500",
    Urgente: "text-amber-500",
};

interface RecentDocsProps {
    docs: Comunicado[];
}

export function RecentDocs({ docs }: RecentDocsProps) {
    return (
        <div className="rounded-2xl bg-white shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
            <div className="flex flex-row items-center justify-between p-6 pb-4 border-b border-gray-50">
                <h3 className="text-lg font-semibold text-corporate-dark">Documentos Recientes</h3>
                <Button variant="ghost" className="text-corporate-accent hover:text-corporate-blue text-sm h-8 px-2">
                    Ver todos <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
            </div>
            <div className="p-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 text-left">
                                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Folio / DOI</th>
                                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Tema</th>
                                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Fecha de Emisión</th>
                                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Tipo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {docs.map((doc) => {
                                const tipoNombre = doc.tipoComunicado?.nombre || "Informativo";
                                const estiloTipo = tipoStyles[tipoNombre] || "text-gray-500";

                                return (
                                    <tr key={doc.idComunicado} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 pr-4">
                                            <span className="text-sm font-semibold text-corporate-accent">{doc.folioDoi}</span>
                                        </td>
                                        <td className="py-4 pr-4 text-sm text-gray-700">{doc.tema}</td>
                                        <td className="py-4 pr-4 text-sm tabular-nums text-gray-500">
                                            {new Date(doc.fechaEmision).toLocaleDateString('es-MX', {
                                                year: 'numeric', month: 'short', day: 'numeric'
                                            })}
                                        </td>
                                        <td className="py-4">
                                            <span className={`text-sm font-medium ${estiloTipo}`}>
                                                {tipoNombre}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {docs.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-sm text-gray-500">
                                        No hay documentos recientes
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}