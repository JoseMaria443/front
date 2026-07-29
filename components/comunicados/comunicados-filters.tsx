import { Search, ChevronDown } from "lucide-react";

interface ComunicadosFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    tipo: string;
    onTipoChange: (value: string) => void;
    area: string;
    onAreaChange: (value: string) => void;
}

export function ComunicadosFilters({ search, onSearchChange, tipo, onTipoChange, area, onAreaChange }: ComunicadosFiltersProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar por Folio/DOI o tema..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-corporate-accent focus:ring-1 focus:ring-corporate-accent transition-all shadow-sm"
                />
            </div>
            <select
                value={tipo}
                onChange={(e) => onTipoChange(e.target.value)}
                className="rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-corporate-accent focus:ring-1 focus:ring-corporate-accent transition-all shadow-sm min-w-[180px]"
            >
                <option value="all">Todos los tipos</option>
                <option value="Oficio">Oficio</option>
                <option value="Memo">Memo</option>
                <option value="Circular">Circular</option>
            </select>
            <select
                value={area}
                onChange={(e) => onAreaChange(e.target.value)}
                className="rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-corporate-accent focus:ring-1 focus:ring-corporate-accent transition-all shadow-sm min-w-[180px]"
            >
                <option value="all">Todas las áreas</option>
                <option value="rrhh">Recursos Humanos</option>
                <option value="ti">Tecnología</option>
                <option value="finanzas">Finanzas</option>
            </select>
        </div>
    );
}
