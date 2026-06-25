"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { authService } from "../../../services/auth.service";
import { useSessionStore } from "../../../store/session.store";

export default function LoginPage() {
    const router = useRouter();
    const login = useSessionStore((state) => state.login);

    const [email, setEmail] = useState("m.martinez@universidad.edu.mx");
    const [password, setPassword] = useState("123456");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const userData = await authService.login(email, password);
            // uso de zustand para guardar
            login(userData);

            // redireccion mock del crm
            router.push("/dashboard");
        } catch (err) {
            setError("Credenciales incorrectas. Intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-corporate-light">
            <div className="hidden lg:flex lg:w-1/2 relative bg-corporate-dark items-center justify-center overflow-hidden">
                <div className="absolute inset-0 w-full h-full">
                    <Image
                        src="/login-bg.svg"
                        alt="Fondo corporativo"
                        fill
                        className="object-cover object-right"
                        priority
                    />
                </div>

                <div className="relative z-10 w-64 h-64">
                    <Image
                        src="/up-logo.svg"
                        alt="Logotipo Universidad Politécnica"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                <div className="absolute bottom-8 left-8 z-10">
                    <h2 className="text-white text-2xl font-bold tracking-widest">SGC2I</h2>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold text-corporate-dark mb-2">Bienvenido</h1>
                        <p className="text-gray-500">Accede a tu cuenta</p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                        <form onSubmit={handleLogin} className="space-y-5">

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600 uppercase">
                                    Correo electrónico institucional
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 bg-gray-50/50"
                                        placeholder="usuario@institucion.edu"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600 uppercase">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 bg-gray-50/50"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-md">
                                    {error}
                                </p>
                            )}

                            <Button
                                type="submit"
                                className="w-full py-6 text-sm tracking-wider uppercase rounded-xl shadow-lg shadow-corporate-blue/20 hover:shadow-corporate-blue/40 transition-all"
                                disabled={isLoading}
                            >
                                {isLoading ? "Validando..." : "Login"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}