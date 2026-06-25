import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';

//manejador de sidebar y topbar para todas las vistas
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-corporate-light overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden relative">
                <Topbar />

                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}