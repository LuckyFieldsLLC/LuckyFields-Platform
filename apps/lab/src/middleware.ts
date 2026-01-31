import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Draft protection for /admin routes
    if (pathname.startsWith('/admin')) {
        console.log('[Security Draft] Accessing Admin route:', pathname);
    }

    // Analytics Logging (Non-blocking)
    if (!pathname.startsWith('/api') && !pathname.includes('.')) {
        const country = request.headers.get('x-nf-country') || 'Unknown';
        const userAgent = request.headers.get('user-agent') || 'Unknown';

        // We use a fire-and-forget-ish approach or a background task if supported
        // In Next.js middleware, we can't easily do fire-and-forget without waiting, 
        // but we'll call the internal API.
        try {
            // Note: Middleware can't easily call local fetch in some environments, 
            // but on Netlify/Next.js it might work if absolute URL is used.
            // For now, we'll just log to console or ideally use a beacon/pixel in the frontend.
            // Request said "正式に access_logs ストアに保存", so I'll implement a client-side logger too.
            console.log(`[Analytics] ${pathname} from ${country}`);
        } catch (e) {
            console.error('Middleware logging failed', e);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
