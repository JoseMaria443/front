"use client";

import { useEffect } from "react";
import { useSessionStore } from "../../store/session.store";
import { Toaster } from "react-hot-toast";

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const initialize = useSessionStore((state) => state.initialize);

    useEffect(() => {
        initialize();
    }, [initialize]);

    return (
        <>
            {children}
            <Toaster position="top-right" reverseOrder={false} />
        </>
    );
}
