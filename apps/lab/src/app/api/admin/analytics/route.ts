import { NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';

export async function GET() {
    try {
        const store = getStore('access-logs');
        const list = await store.list();
        const logs: any[] = [];

        // Note: For production with many logs, this should be pre-aggregated or paginated.
        // For current MVP scale, we fetch all.
        for (const blob of list.blobs) {
            const log = await store.get(blob.key, { type: 'json' });
            if (log) logs.push(log);
        }

        const stats = {
            totalPV: logs.length,
            uniqueVisitors: new Set(logs.map(l => l.userAgent + l.country)).size,
            countries: {} as Record<string, number>,
            recentActivity: logs.slice(-10).reverse()
        };

        logs.forEach(log => {
            const country = log.country || 'Unknown';
            stats.countries[country] = (stats.countries[country] || 0) + 1;
        });

        return NextResponse.json(stats);
    } catch (error) {
        console.error('Failed to fetch analytics:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
