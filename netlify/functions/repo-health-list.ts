export const handler = async () => {
  try {
    const { getStore } = await import('@netlify/blobs');
    const store = getStore({ name: 'repo-health' } as any);
    const out: any[] = [];
    for await (const entry of store.list({ prefix: '' } as any) as any) {
      const key = entry.key || entry.blob?.key || entry?.name;
      if (!key) continue;
      const text = await store.get(key, { type: 'text' } as any);
      try { out.push(JSON.parse(String(text))); } catch {}
    }
    // 新しい順に並べ替え（キーに ISO スタンプが入っている前提）
    out.sort((a, b) => String(b.generatedAt || '').localeCompare(String(a.generatedAt || '')));
    return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(out.slice(0, 100)) };
  } catch (err) {
    console.error('repo-health-list error:', err);
    return { statusCode: 500, headers: { 'Access-Control-Allow-Origin': '*' }, body: 'Internal Server Error' };
  }
};
