// Simple local dev server to emulate Netlify dev for repo-health endpoints
// - Serves static files from ./docs
// - Implements /.netlify/functions/repo-health (POST)
// - Implements /.netlify/functions/repo-health-list (GET)
// Storage: ./tmp/repo-health/<repoId>/<timestamp>.json

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const docsDir = path.join(rootDir, 'docs');
const tmpDir = path.join(rootDir, 'tmp', 'repo-health');
const PORT = Number(process.env.PORT || 8888);

function send(res, status, body, headers = {}) {
  const h = { 'Content-Type': 'text/plain; charset=utf-8', ...headers };
  res.writeHead(status, h);
  res.end(body);
}

function sendJson(res, status, obj, headers = {}) {
  send(res, status, JSON.stringify(obj), { 'Content-Type': 'application/json', ...headers });
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

async function handleRepoHealthPost(req, res) {
  try {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const bodyStr = Buffer.concat(chunks).toString('utf8');
    if (!bodyStr) return send(res, 400, 'Missing body', corsHeaders());
    let data;
    try { data = JSON.parse(bodyStr); } catch { return send(res, 400, 'Invalid JSON', corsHeaders()); }
    const repoId = String(data.repositoryId || 'unknown');
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const dir = path.join(tmpDir, repoId);
    ensureDir(dir);
    const file = path.join(dir, `${stamp}.json`);
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    // update index.json for dashboard fallback
    try {
      const all = collectFiles(tmpDir)
        .map((p) => {
          try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
        })
        .filter(Boolean)
        .sort((a, b) => String(b.generatedAt || '').localeCompare(String(a.generatedAt || '')))
        .slice(0, 200);
      ensureDir(path.join(rootDir, 'docs', 'tmp', 'repo-health'));
      fs.writeFileSync(path.join(rootDir, 'docs', 'tmp', 'repo-health', 'index.json'), JSON.stringify(all, null, 2), 'utf8');
    } catch (e) {
      console.warn('[local-server] failed to update docs/tmp/repo-health/index.json', e);
    }
    return sendJson(res, 200, { ok: true, saved: path.relative(rootDir, file).replace(/\\/g, '/') }, corsHeaders());
  } catch (e) {
    console.error('repo-health POST error', e);
    return send(res, 500, 'Internal Server Error', corsHeaders());
  }
}

function corsHeaders() {
  return { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
}

function handleCors(req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders());
    res.end();
    return true;
  }
  return false;
}

function collectFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const ent of entries) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) files.push(...collectFiles(p));
    else if (ent.isFile() && p.endsWith('.json')) files.push(p);
  }
  return files;
}

async function handleRepoHealthList(_req, res) {
  try {
    const files = collectFiles(tmpDir);
    const arr = [];
    for (const f of files) {
      try {
        const txt = fs.readFileSync(f, 'utf8');
        arr.push(JSON.parse(txt));
      } catch { /* ignore */ }
    }
    arr.sort((a, b) => String(b.generatedAt || '').localeCompare(String(a.generatedAt || '')));
    return sendJson(res, 200, arr.slice(0, 200), corsHeaders());
  } catch (e) {
    console.error('repo-health-list GET error', e);
    return send(res, 500, 'Internal Server Error', corsHeaders());
  }
}

function guessContentType(p) {
  if (p.endsWith('.html')) return 'text/html; charset=utf-8';
  if (p.endsWith('.css')) return 'text/css; charset=utf-8';
  if (p.endsWith('.js')) return 'text/javascript; charset=utf-8';
  if (p.endsWith('.json')) return 'application/json; charset=utf-8';
  if (p.endsWith('.svg')) return 'image/svg+xml';
  if (p.endsWith('.png')) return 'image/png';
  return 'application/octet-stream';
}

function serveStatic(req, res, pathname) {
  let filePath = path.join(docsDir, pathname.replace(/^\/+/, ''));
  if (pathname === '/' || pathname === '') {
    // Default to dashboard
    filePath = path.join(docsDir, 'dashboard', 'index.html');
  }
  // Prevent path traversal
  const rel = path.relative(docsDir, filePath);
  if (rel.startsWith('..')) return send(res, 403, 'Forbidden');
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    return send(res, 404, 'Not Found');
  }
  const body = fs.readFileSync(filePath);
  res.writeHead(200, { 'Content-Type': guessContentType(filePath) });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  const parsed = new URL(req.url || '/', `http://${req.headers.host}`);
  const pathname = parsed.pathname || '/';

  if (handleCors(req, res)) return;

  if (pathname === '/.netlify/functions/repo-health') {
    if (req.method === 'POST') return handleRepoHealthPost(req, res);
    return send(res, 405, 'Method Not Allowed', corsHeaders());
  }

  if (pathname === '/.netlify/functions/repo-health-list') {
    if (req.method === 'GET') return handleRepoHealthList(req, res);
    return send(res, 405, 'Method Not Allowed', corsHeaders());
  }

  // Static
  if (req.method === 'GET') return serveStatic(req, res, pathname);
  return send(res, 404, 'Not Found');
});

server.on('error', (e) => {
  console.error('[local-server] Server error:', e);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[local-server] Listening on http://127.0.0.1:${PORT}`);
  console.log(`[local-server] Static docs: ${docsDir}`);
  console.log(`[local-server] Endpoints:`);
  console.log(`  POST /.netlify/functions/repo-health`);
  console.log(`  GET  /.netlify/functions/repo-health-list`);
});
