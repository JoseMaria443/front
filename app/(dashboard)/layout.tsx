import { Sidebar } from "../../components/layout/Sidebar";
import { Topbar } from "../../components/layout/Topbar";

export default function DashboardLayout({ //manejador de layout para todas las vistas  
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-corporate-light">
            <Sidebar />

            <main className="flex-1 flex flex-col min-h-screen ml-16 md:ml-64 transition-all duration-300 ease-in-out p-6 md:p-8">
                <div className="max-w-7xl mx-auto w-full">
                    <Topbar />
                    {children}
                </div>
            </main>
        </div>
    );
}