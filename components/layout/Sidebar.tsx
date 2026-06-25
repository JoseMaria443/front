import Link from 'next/link';

export function Sidebar() {
    const navItems = [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Oficios', href: '/comunicados' },
        { name: 'Mis Tareas', href: '/mis-tareas' },
        { name: 'Directorio', href: '/directorio' },
        { name: 'Configuración', href: '/configuracion' },
    ];

    return (
        <aside className="w-64 bg-corporate-dark text-white flex flex-col h-full shadow-xl">
            <div className="h-16 flex items-center px-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-corporate-accent rounded-md flex items-center justify-center font-bold text-lg">
                        A
                    </div>
                    <div>
                        <h1 className="font-semibold text-sm leading-tight">AcademiCRM</h1>
                        <p className="text-xs text-gray-400">Universidad Politécnica</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-white/10 text-xs text-gray-500 text-center">
                Versión 1.0.0
            </div>
        </aside>
    );
}