import { TrendingUp, TrendingDown } from "lucide-react";
import { ReactNode } from "react";

export interface StatCardProps {
    title: string;
    value: string | number;
    trend?: { label: string; isPositive: boolean };
    icon: ReactNode;
}

export function StatCard({ title, value, trend, icon }: StatCardProps) {
    return (
        <div className="rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100">
            <div className="flex items-start justify-between">
                <div className="space-y-4">
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-4xl font-bold tracking-tight text-corporate-dark">{value}</p>
                    {trend && (
                        <div className="flex items-center gap-1.5 text-sm">
                            {trend.isPositive ? (
                                <TrendingUp className="h-4 w-4 text-emerald-500" />
                            ) : (
                                <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                            <span className={trend.isPositive ? "text-emerald-500" : "text-red-500"}>
                                {trend.label}
                            </span>
                        </div>
                    )}
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                    {icon}
                </div>
            </div>
        </div>
    );
}