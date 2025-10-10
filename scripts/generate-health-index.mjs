import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const reportFile = path.join(repoRoot, 'reports', 'repo-health.json');
const outDir = path.join(repoRoot, 'docs', 'tmp', 'repo-health');
const outFile = path.join(outDir, 'index.json');

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }

function readJson(p, fallback) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return fallback; }
}

function main() {
  if (!fs.existsSync(reportFile)) {
    console.error(`[generate-health-index] Missing report file: ${reportFile}`);
    process.exit(1);
  }
  const entry = readJson(reportFile, null);
  if (!entry) {
    console.error('[generate-health-index] Invalid JSON in report file');
    process.exit(1);
  }
  ensureDir(outDir);
  const list = readJson(outFile, []);
  const merged = [entry, ...list.filter((x) => x && x.generatedAt !== entry.generatedAt || x.repositoryId !== entry.repositoryId)];
  merged.sort((a, b) => String(b.generatedAt || '').localeCompare(String(a.generatedAt || '')));
  fs.writeFileSync(outFile, JSON.stringify(merged.slice(0, 200), null, 2), 'utf8');
  console.log(outFile);
}

main();
