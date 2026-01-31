import { NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';
import { SiteConfig } from '../../../../../../../types/siteConfig';

export async function GET() {
    try {
        const store = getStore('site-config');
        const config = await store.get('current', { type: 'json' }) as SiteConfig;

        const defaultConfig: SiteConfig = {
            isGyroEnabled: false,
            themeColor: '#3b82f6',
            activeEvent: 'Normal',
            themeMode: 'light',
            showZodiac: false,
            showParticles: false,
            showNews: true,
            primaryColor: '#3b82f6',
            bgOpacity: 0.7,
            isInteractiveMode: false,
            aboutContent: '',
            changelog: []
        };

        return NextResponse.json(config || defaultConfig);
    } catch (error) {
        console.error('Failed to fetch config:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const config = await request.json() as SiteConfig;
        const store = getStore('site-config');
        await store.setJSON('current', config);
        return NextResponse.json({ success: true, config });
    } catch (error) {
        console.error('Failed to update config:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
