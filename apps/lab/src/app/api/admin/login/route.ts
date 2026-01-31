import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();
        const adminPassword = process.env.ADMIN_PASSWORD || 'Lucky123';

        if (password === adminPassword) {
            // In a real app, we'd set a secure cookie/JWT here.
            // For this MVP, we'll return success and let the client handle state.
            return NextResponse.json({ success: true, token: 'session_active_' + Date.now() });
        } else {
            return NextResponse.json({ success: false }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
