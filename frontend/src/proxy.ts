import { getUserRole, isAuthenticated } from '@/lib/utils/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public access to login/register and api
    if (pathname.startsWith('/authentication') || pathname.startsWith('/api') || pathname === '/') {
        // If logged in and trying to go to login, redirect to dashboard
        if (pathname.startsWith('/authentication/login') && isAuthenticated(request.cookies)) {
            const role = getUserRole(request.cookies);
            if (role === 'admin') return NextResponse.redirect(new URL('/admin', request.url));
            return NextResponse.redirect(new URL('/cashier', request.url));
        }
        return NextResponse.next();
    }

    // Require authentication for all other routes
    if (!isAuthenticated(request.cookies)) {
        return NextResponse.redirect(new URL('/authentication/login', request.url))
    }

    const role = getUserRole(request.cookies);

    // RBAC: Admin Routes
    if (pathname.startsWith('/admin') && role !== 'admin') {
        return NextResponse.redirect(new URL('/cashier', request.url)); // Cashiers cannot access admin
    }

    // RBAC: Cashier Routes
    if (pathname.startsWith('/cashier') && role !== 'cashier' && role !== 'admin') {
        return NextResponse.redirect(new URL('/authentication/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - .png (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|.*\\.png$).*)'
    ]
}