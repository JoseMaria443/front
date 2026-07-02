"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { AreaSlideOver } from "../../../components/directorio/AreaSlideOver";
import { EmployeeSlideOver, EmpleadoNuevo } from "../../../components/directorio/EmployeeSlideOver";

const MOCK_AREAS = [
    "División de Ingeniería y Tecnología",
    "Ing. en Sistemas Computacionales",
    "Ing. Industrial",
    "Ing. Electrónica",
    "División de Ciencias Básicas",
    "Matemáticas",
    "Física y Química",
    "División Económico-Administrativa",
    "Administración",
    "Contaduría",
    "DACE",
    "Planeación"
];

const MOCK_EMPLEADOS = [
    { id: 1, nombre: "Dr. Martínez Reyes, Miguel", correo: "m.martinez@universidad.edu.mx", area: "Ing. en Sistemas Computacionales", cargos: ["Coordinador", "Tutor"], iniciales: "MR", color: "bg-corporate-blue", activo: true },
    { id: 2, nombre: "Dra. López Ávila, Ana", correo: "a.lopez@universidad.edu.mx", area: "División de Ciencias Básicas", cargos: ["Docente"], iniciales: "AL", color: "bg-violet-600", activo: true },
    { id: 3, nombre: "Dr. García Mora, Carlos", correo: "c.garcia@universidad.edu.mx", area: "División de Ingeniería y Tecnología", cargos: ["Jefe de División", "Docente"], iniciales: "CG", color: "bg-emerald-500", activo: true },
    { id: 4, nombre: "Mtro. Jiménez Luna, Roberto", correo: "r.jimenez@universidad.edu.mx", area: "Ing. Industrial", cargos: ["Docente"], iniciales: "JL", color: "bg-gray-400", activo: false },
    { id: 5, nombre: "Dra. Peña Vargas, Sofía", correo: "s.pena@universidad.edu.mx", area: "Matemáticas", cargos: ["Docente", "Asesor de Movilidad"], iniciales: "PV", color: "bg-pink-500", activo: true },
];

export default function DirectorioPage() {
    const [activeTab, setActiveTab] = useState<"areas" | "empleados">("areas");
    const [searchQuery, setSearchQuery] = useState("");

    const [areas, setAreas] = useState<string[]>(MOCK_AREAS);
    const [empleados, setEmpleados] = useState(MOCK_EMPLEADOS);

    const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
    const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);

    const empleadosFiltrados = empleados.filter(emp =>
        emp.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.area.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddArea = (nombre: string) => {
        setAreas([nombre, ...areas]);
    };

    const handleAddEmpleado = (empleadoNuevo: EmpleadoNuevo) => {
        const colores = ["bg-corporate-blue", "bg-violet-600", "bg-emerald-500", "bg-pink-500", "bg-amber-500"];
        const colorAsignado = colores[Math.floor(Math.random() * colores.length)];

        setEmpleados([{ ...empleadoNuevo, color: colorAsignado }, ...empleados]);
    };

    const toggleEmpleadoActivo = (id: number) => {
        setEmpleados(empleados.map(emp =>
            emp.id === id ? { ...emp, activo: !emp.activo } : emp
        ));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-corporate-dark">Directorio</h1>
                    <p className="text-sm text-gray-500 mt-1">Gestión de áreas y empleados del sistema</p>
                </div>

                <Button
                    onClick={() => activeTab === "areas" ? setIsAreaModalOpen(true) : setIsEmployeeModalOpen(true)}
                    className="rounded-full shadow-md px-6 bg-corporate-blue hover:bg-corporate-dark"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    {activeTab === "areas" ? "Nueva Área" : "Nuevo Empleado"}
                </Button>
            </div>

            <div className="inline-flex bg-gray-100/80 rounded-full p-1 mb-2">
                <button
                    onClick={() => setActiveTab("areas")}
                    className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === "areas" ? "bg-white text-corporate-dark shadow-sm" : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    Áreas
                </button>
                <button
                    onClick={() => setActiveTab("empleados")}
                    className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === "empleados" ? "bg-white text-corporate-dark shadow-sm" : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    Empleados
                </button>
            </div>

            {activeTab === "areas" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    {areas.map((area, idx) => (
                        <div key={idx} className="bg-white rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-gray-100 p-5 flex items-center min-h-[80px]">
                            <p className="text-sm font-semibold text-corporate-dark">{area}</p>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === "empleados" && (
                <div className="mt-4 space-y-4">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar empleado o área..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-corporate-accent focus:ring-1 focus:ring-corporate-accent transition-all shadow-sm"
                        />
                    </div>

                    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/50">
                                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Empleado</th>
                                        <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Área</th>
                                        <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Cargos</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider w-24">Activo</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {empleadosFiltrados.map((emp) => (
                                        <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${emp.color}`}>
                                                        {emp.iniciales}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-corporate-dark">{emp.nombre}</p>
                                                        <p className="text-xs text-gray-500 mt-0.5">{emp.correo}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-600">{emp.area}</td>
                                            <td className="py-4 px-4">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {emp.cargos.map((cargo, i) => (
                                                        <span key={i} className="inline-flex items-center rounded-full bg-blue-50 text-corporate-blue px-2 py-0.5 text-[10px] font-semibold">
                                                            {cargo}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <button
                                                    onClick={() => toggleEmpleadoActivo(emp.id)}
                                                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${emp.activo ? 'bg-corporate-blue' : 'bg-gray-200'}`}
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emp.activo ? 'translate-x-4' : 'translate-x-1'}`} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {empleadosFiltrados.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="py-12 text-center text-sm text-gray-500">No se encontraron empleados.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            <AreaSlideOver isOpen={isAreaModalOpen} onClose={() => setIsAreaModalOpen(false)} onSave={handleAddArea} />
            <EmployeeSlideOver isOpen={isEmployeeModalOpen} onClose={() => setIsEmployeeModalOpen(false)} areas={areas} onSave={handleAddEmpleado} />
        </div>
    );
}