import { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "success" | "warning" | "danger" | "info";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
    const variants = {
        default: "bg-gray-100 text-gray-800 border border-gray-200",
        success: "bg-green-50 text-green-700 border border-green-200",
        warning: "bg-yellow-50 text-yellow-700 border border-yellow-200",
        danger: "bg-red-50 text-red-700 border border-red-200",
        info: "bg-blue-50 text-corporate-blue border border-blue-200",
    };

    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
                variants[variant],
                className
            )}
            {...props}
        />
    );
}