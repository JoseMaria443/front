"use client";

import { useEffect, useState } from "react";
import { useSessionStore } from "../store/session.store";

interface DashboardSessionProviderProps {
  children: React.ReactNode;
}

/**
 * Componente auxiliar para forzar la hidratación de la sesión
 * desde cookies/localStorage en rutas del dashboard donde
 * el SessionProvider no alcanza a rehidratar antes de las primeras llamadas.
 */
export function DashboardSessionProvider({ children }: DashboardSessionProviderProps) {
  const hydrate = useSessionStore((state) => state.hydrate);
  const token = useSessionStore((state) => state.token);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    hydrate();
    // Solo marcar como hidratado si ya hay token o si definitivamente no lo hay
    const currentToken = useSessionStore.getState().token;
    setHydrated(true);
  }, [hydrate]);

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-sm text-gray-500">Cargando sesión...</div>
      </div>
    );
  }

  if (!token) {
    // No hay sesión válida: no renderizar dashboard para evitar 401 en cascada
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-sm text-gray-500">No hay sesión activa. Redirigiendo al login...</div>
      </div>
    );
  }

  return <>{children}</>;
}
