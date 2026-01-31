import { NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const zodiac = formData.get('zodiac') as string;

        if (!file || !zodiac) {
            return NextResponse.json({ error: 'Missing file or zodiac' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const filename = `zodiac-${zodiac.toLowerCase()}-${Date.now()}.${file.name.split('.').pop()}`;

        const store = getStore('site-assets');
        await store.set(filename, arrayBuffer, {
            metadata: {
                contentType: file.type,
                zodiac: zodiac
            }
        });

        // In a real Netlify environment, you'd return the URL to the blob.
        // For now, we'll return the filename and assume Netlify handles serving via CDN.
        const imageUrl = `/.netlify/blobs/site-assets/${filename}`;

        return NextResponse.json({ success: true, imageUrl, filename });
    } catch (error) {
        console.error('Upload failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
