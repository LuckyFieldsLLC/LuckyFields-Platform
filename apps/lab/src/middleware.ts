import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Draft protection for /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // In a real scenario, check for session/cookies/headers
        // const authHeader = request.headers.get('authorization');
        // if (!authHeader) return NextResponse.redirect(new URL('/login', request.url));
        console.log('[Security Draft] Accessing Admin route:', request.nextUrl.pathname);
    }
    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
