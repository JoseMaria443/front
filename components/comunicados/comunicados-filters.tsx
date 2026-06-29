import { Search, ChevronDown } from "lucide-react";

export function ComunicadosFilters() {
    return (
        <div className="flex flex-col gap-4 sm:flex-row mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar por Folio/DOI..."
                    className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-corporate-accent focus:ring-1 focus:ring-corporate-accent transition-all shadow-sm"
                />
            </div>
            <button className="flex items-center justify-between gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 shadow-sm transition-colors min-w-[180px]">
                Tipo de Comunicado
                <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
            <button className="flex items-center justify-between gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 shadow-sm transition-colors min-w-[180px]">
                Área de Origen
                <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
        </div>
    );
}