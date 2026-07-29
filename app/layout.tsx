import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "../components/providers/SessionProvider";
import { Toaster } from "react-hot-toast"; // Importación agregada

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SGC2I - Dashboard", // <-- Cambiado para que se vea bien en la pestaña del navegador
  description: "Sistema de Gestión de Comunicación Institucional Interna",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es" 
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          {children}
        </SessionProvider>
        
        {/* <-- 2. Toaster agregado para las notificaciones globales */}
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}