import { analyzeRepository } from './analyzer';
import { scoreHealth } from './score';
import { outputReport } from './report';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

export type RunOptions = {
  cwd?: string;
  json?: boolean;
  verbose?: boolean;
  timeoutMs?: number;
  report?: boolean;
  repoId?: string;
  endpoint?: string;
};

export async function runHealthAnalysis(options: RunOptions = {}) {
  const base = process.env.INIT_CWD ?? process.cwd();
  const effectiveCwd = options.cwd
    ? (path.isAbsolute(options.cwd) ? options.cwd : path.resolve(base, options.cwd))
    : base;
  const metrics = await analyzeRepository({ cwd: effectiveCwd, verbose: options.verbose, timeoutMs: options.timeoutMs });
  const score = scoreHealth(metrics);
  const out = outputReport(metrics, score, { format: options.json ? 'json' : 'pretty', print: true });

  if (options.report || options.endpoint || options.repoId) {
    const baseUrl = process.env.LF_API_ENDPOINT
      || options.endpoint
      || (process.env.LF_API_BASE_URL ? `${process.env.LF_API_BASE_URL.replace(/\/$/, '')}/.netlify/functions/repo-health` : '')
      || 'http://localhost:8888/.netlify/functions/repo-health';
    const ep = baseUrl;
    const body = {
      repositoryId: options.repoId || 'unknown-repo',
      generatedAt: new Date().toISOString(),
      metrics,
      score,
    };
    try {
      const res = await fetch(ep, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const text = await res.text();
      console.log(`Report POST → ${res.status} ${res.statusText}: ${text}`);
    } catch (err) {
      console.error('Report POST failed:', err);
    }
  }

  return { metrics, score, out };
}

// Minimal CLI passthrough
const isMain = (() => {
  const argv1 = process.argv[1];
  if (!argv1) return false;
  try {
    return new URL(import.meta.url).pathname === pathToFileURL(argv1).pathname;
  } catch {
    return false;
  }
})();

if (isMain) {
  const args = process.argv.slice(2);
  const findFlag = (f: string) => args.includes(f);
  const getVal = (f: string) => {
    const i = args.indexOf(f);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const json = findFlag('--json');
  const verbose = findFlag('--verbose');
  const timeout = getVal('--timeoutMs');
  const cwd = getVal('--cwd');
  const report = findFlag('--report');
  const repoId = getVal('--repo-id');
  const endpoint = getVal('--endpoint');

  runHealthAnalysis({ json, verbose, cwd, report, repoId, endpoint, timeoutMs: timeout ? Number(timeout) : undefined }).catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
}
