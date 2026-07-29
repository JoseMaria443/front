"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextValue {
    toasts: Toast[];
    addToast: (message: string, type?: ToastType, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = 'info', duration = 4000) => {
        const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
        setToasts(prev => [...prev, { id, message, type, duration }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
    useEffect(() => {
        toasts.forEach(toast => {
            if (toast.duration && toast.duration > 0) {
                const timer = setTimeout(() => {
                    onDismiss(toast.id);
                }, toast.duration);
                return () => clearTimeout(timer);
            }
        });
    }, [toasts, onDismiss]);

    const typeStyles: Record<ToastType, string> = {
        success: "bg-emerald-50 text-emerald-800 border-emerald-100",
        error: "bg-red-50 text-red-800 border-red-100",
        info: "bg-blue-50 text-blue-800 border-blue-100",
        warning: "bg-amber-50 text-amber-800 border-amber-100",
    };

    return (
        <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border shadow-lg animate-in fade-in slide-in-from-bottom-5 duration-300 min-w-[300px] ${typeStyles[toast.type]}`}
                >
                    <span className="text-xs font-semibold flex-1">{toast.message}</span>
                    <button
                        onClick={() => onDismiss(toast.id)}
                        className="text-gray-400 hover:text-gray-600 font-bold ml-2 text-sm focus:outline-none"
                        aria-label="Cerrar notificación"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
}