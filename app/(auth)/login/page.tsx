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
            const { user, token } = await authService.login(email, password);
            login(user, token);

            router.push("/dashboard");
        } catch (err: any) {
            const msg = err.response?.data?.message || err.response?.data?.detail || "Credenciales incorrectas. Intenta de nuevo.";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full relative flex bg-corporate-light overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-[50vw] xl:w-[53vw] pointer-events-none z-0 hidden lg:block">
                <img
                    src="/login-bg.svg"
                    alt="Fondo de onda"
                    className="w-full h-full object-cover object-right"
                />
            </div>

            <div className="relative z-10 w-full min-h-screen flex flex-col lg:flex-row">
                <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative p-8">
                    <div className="relative w-64 h-64">
                        <Image
                            src="/up-logo.svg"
                            alt="Logotipo Universidad Politécnica"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    <div className="absolute bottom-8 left-8">
                        <h2 className="text-white text-2xl font-bold tracking-widest">SGC2I</h2>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-10">
                            <h1 className="text-4xl font-bold text-corporate-dark mb-2">Bienvenido</h1>
                            <p className="text-gray-500">Accede a tu cuenta</p>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-4 border-corporate-dark">
                            <form onSubmit={(e) => { e.preventDefault(); handleLogin(e); }} className="space-y-5">

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-corporate-dark uppercase tracking-wide">
                                        Correo electrónico institucional
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                            <svg className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10 h-12 bg-[#3f4f66] border-none text-white placeholder:text-white/60"
                                            placeholder="usuario@institucion.edu"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-corporate-dark uppercase tracking-wide">
                                        Contraseña
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                            <svg className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <Input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-10 h-12 bg-[#3f4f66] border-none text-white placeholder:text-white/60"
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

                                <div className="flex justify-center pt-2">
                                    <Button
                                        type="submit"
                                        className="px-12 py-3 text-sm tracking-wider uppercase rounded-full bg-corporate-dark hover:bg-corporate-dark/90 shadow-lg shadow-corporate-dark/20 transition-all text-white font-bold"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "VALIDANDO..." : "LOGIN"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}