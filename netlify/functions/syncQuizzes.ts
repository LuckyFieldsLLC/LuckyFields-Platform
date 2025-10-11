// Netlify Function: syncQuizzes
// Minimal CORS + OPTIONS handling and JSON Blobs read/write

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

function jsonResponse(statusCode: number, body: unknown, extraHeaders: Record<string, string> = {}) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS, ...extraHeaders },
    body: JSON.stringify(body),
  };
}

export const handler = async (event: any) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: { ...CORS_HEADERS } };
  }

  try {
    const { getStore } = await import('@netlify/blobs');
    const store = getStore({ name: 'quizzes' } as any);

    if (event.httpMethod === 'GET') {
      const url = new URL(event.rawUrl || `https://dummy${event.path}${event.rawQuery ? '?' + event.rawQuery : ''}`);
      const id = url.searchParams.get('id');
      if (!id) return jsonResponse(400, { error: 'Missing id' });

      const value = await store.get(`quizzes/${id}.json`, { type: 'json' } as any);
      if (value == null) return jsonResponse(404, { error: 'Not found' });
      return jsonResponse(200, { ok: true, id, data: value });
    }

    if (event.httpMethod === 'POST') {
      if (!event.body) return jsonResponse(400, { error: 'Missing body' });
      let parsed: any;
      try { parsed = JSON.parse(event.body); } catch { return jsonResponse(400, { error: 'Invalid JSON' }); }
      const id = String(parsed.id || '').trim();
      const data = parsed.data;
      if (!id) return jsonResponse(400, { error: 'Missing id' });
      if (typeof data === 'undefined') return jsonResponse(400, { error: 'Missing data' });

      await store.set(`quizzes/${id}.json`, data, { type: 'json' } as any);
      return jsonResponse(200, { ok: true, id });
    }

    return { statusCode: 405, headers: { ...CORS_HEADERS }, body: 'Method Not Allowed' };
  } catch (err) {
    console.error('syncQuizzes error:', err);
    return { statusCode: 500, headers: { ...CORS_HEADERS }, body: 'Internal Server Error' };
  }
};
