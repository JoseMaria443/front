import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate-accent disabled:opacity-50 disabled:pointer-events-none";

        const variants = {
            primary: "bg-corporate-blue text-white hover:bg-corporate-blue/90",
            secondary: "bg-corporate-light text-corporate-dark hover:bg-gray-200",
            outline: "border border-gray-300 bg-transparent hover:bg-gray-100 text-corporate-dark",
            ghost: "bg-transparent hover:bg-gray-100 text-corporate-dark",
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], "px-4 py-2", className)}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };