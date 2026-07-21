"use client";

import { useEffect } from "react";
import { useSessionStore } from "../../store/session.store";

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const initialize = useSessionStore((state) => state.initialize);

    useEffect(() => {
        initialize();
    }, [initialize]);

    return <>{children}</>;
}
