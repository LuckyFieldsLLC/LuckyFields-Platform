import { NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';

export async function POST(request: Request) {
    try {
        const { pathname, country, userAgent } = await request.json();
        const store = getStore('access-logs');

        const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const logId = `${timestamp}-${Math.random().toString(36).substr(2, 9)}`;

        const logEntry = {
            id: logId,
            timestamp: new Date().toISOString(),
            pathname,
            country: country || 'Unknown',
            userAgent,
            type: 'pageview'
        };

        await store.setJSON(logId, logEntry);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to log access:', error);
        return NextResponse.json({ error: 'Failed to log' }, { status: 500 });
    }
}
