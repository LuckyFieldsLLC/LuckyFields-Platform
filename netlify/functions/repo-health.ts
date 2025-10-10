// Netlify Function: repo-health
// Receives POSTed repo-health report and stores it in Blobs
export const handler = async (event: any) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    if (!event.body) {
      return { statusCode: 400, body: 'Missing body' };
    }
    const report = JSON.parse(event.body);
    const repoId = String(report.repositoryId || 'unknown');
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const blobName = `${repoId}/${stamp}.json`;

    // Lazy import to avoid build-time dependency when not on Netlify
    const { getStore } = await import('@netlify/blobs');
    const store = getStore({ name: 'repo-health' } as any);
    await store.set(blobName, JSON.stringify(report), { contentType: 'application/json' } as any);

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, saved: blobName }),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (err) {
    console.error('repo-health handler error:', err);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};
