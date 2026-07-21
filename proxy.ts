import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const token = request.cookies.get('session-token')?.value;
    const { pathname } = request.nextUrl;

    // Rutas que requieren autenticación
    const protectedPaths = ['/dashboard', '/comunicados', '/mis-tareas', '/directorio', '/configuracion'];

    // Validar si la ruta solicitada es privada
    const isProtected = protectedPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));

    // Si el usuario intenta entrar a la raíz /, redireccionarlo al dashboard (que luego validará auth)
    if (pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Si la ruta es protegida y no tiene token, redirigir a login
    if (isProtected && !token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Si el usuario ya está autenticado e intenta ir al login, redirigir al dashboard
    if (pathname === '/login' && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Coincidir con todos los caminos de solicitud excepto los que comienzan con:
         * - api (rutas de API)
         * - _next/static (archivos estáticos)
         * - _next/image (archivos de optimización de imágenes)
         * - favicon.ico (archivo de favicon)
         * - *.svg (recursos gráficos estáticos)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)',
    ],
};
