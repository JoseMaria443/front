import { Search } from "lucide-react";

interface TipoComunicado {
    id: string;
    nombre: string;
}

interface Area {
    id: string;
    nombre: string;
}

interface ComunicadosFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    idTipoComunicado: string;
    onTipoChange: (value: string) => void;
    idArea: string;
    onAreaChange: (value: string) => void;
    tiposComunicado: TipoComunicado[];
    areas: Area[];
}

export function ComunicadosFilters({ search, onSearchChange, idTipoComunicado, onTipoChange, idArea, onAreaChange, tiposComunicado, areas }: ComunicadosFiltersProps) {
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
                value={idTipoComunicado}
                onChange={(e) => onTipoChange(e.target.value)}
                className="rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-corporate-accent focus:ring-1 focus:ring-corporate-accent transition-all shadow-sm min-w-[180px]"
            >
                <option value="all">Todos los tipos</option>
                {tiposComunicado.map((t) => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
            </select>
            <select
                value={idArea}
                onChange={(e) => onAreaChange(e.target.value)}
                className="rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-corporate-accent focus:ring-1 focus:ring-corporate-accent transition-all shadow-sm min-w-[180px]"
            >
                <option value="all">Todas las áreas</option>
                {areas.map((a) => (
                    <option key={a.id} value={a.id}>{a.nombre}</option>
                ))}
            </select>
        </div>
    );
}
