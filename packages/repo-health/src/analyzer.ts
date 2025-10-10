import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

export type BuildMetrics = {
  hasScript: boolean;
  success: boolean | null;
  durationMs: number | null;
  stdoutPreview?: string;
  stderrPreview?: string;
};

export type TestMetrics = {
  hasScript: boolean;
  success: boolean | null;
  durationMs: number | null;
  stdoutPreview?: string;
  stderrPreview?: string;
};

export type EnvMetrics = {
  envFiles: string[];
  envLoadedKeys: number;
  usesEnvCore: boolean;
};

export type HealthMetrics = {
  repositoryPath: string;
  scripts: Record<string, string>;
  build: BuildMetrics;
  test: TestMetrics;
  env: EnvMetrics;
};

export type AnalyzeOptions = {
  cwd?: string;
  timeoutMs?: number;
  verbose?: boolean;
};

function readPackageScripts(cwd: string): Record<string, string> {
  try {
    const pkgPath = path.join(cwd, 'package.json');
    const pkgRaw = fs.readFileSync(pkgPath, 'utf8');
    const pkg = JSON.parse(pkgRaw);
    return pkg.scripts ?? {};
  } catch {
    return {};
  }
}

async function runNpmScript(name: string, cwd: string, timeoutMs: number, verbose?: boolean) {
  const start = Date.now();
  return new Promise<{ success: boolean; durationMs: number; stdout: string; stderr: string }>((resolve) => {
    // Use shell execution for better Windows compatibility
    const cmd = `npm run ${name} --silent`;
    const child = spawn(cmd, {
      cwd,
      shell: true,
      env: process.env,
    });

    let stdout = '';
    let stderr = '';

    const timer = setTimeout(() => {
      try { child.kill(); } catch {}
    }, timeoutMs);

    child.stdout?.on('data', (d) => {
      const s = String(d);
      stdout += s;
      if (verbose) process.stdout.write(s);
    });
    child.stderr?.on('data', (d) => {
      const s = String(d);
      stderr += s;
      if (verbose) process.stderr.write(s);
    });

    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ success: code === 0, durationMs: Date.now() - start, stdout, stderr });
    });

    child.on('error', () => {
      clearTimeout(timer);
      resolve({ success: false, durationMs: Date.now() - start, stdout, stderr });
    });
  });
}

function preview(s: string, max = 600): string {
  if (!s) return '';
  return s.length > max ? s.slice(0, max) + '\n…(truncated)…' : s;
}

async function runScriptIfExists(name: string, scripts: Record<string, string>, cwd: string, timeoutMs: number, verbose?: boolean) {
  if (!scripts[name]) {
    return <BuildMetrics>{ hasScript: false, success: null, durationMs: null };
  }
  const res = await runNpmScript(name, cwd, timeoutMs, verbose);
  return <BuildMetrics>{
    hasScript: true,
    success: res.success,
    durationMs: res.durationMs,
    stdoutPreview: preview(res.stdout),
    stderrPreview: preview(res.stderr),
  };
}

function analyzeEnv(cwd: string): EnvMetrics {
  const candidates = ['.env', '.env.local', '.env.production', '.env.development'];
  const found: string[] = [];
  let loaded = 0;
  for (const f of candidates) {
    const full = path.join(cwd, f);
    if (fs.existsSync(full)) {
      found.push(f);
      const parsed = dotenv.config({ path: full });
      if (parsed.parsed) loaded += Object.keys(parsed.parsed).length;
    }
  }
  // Heuristic: check if package.json depends on @luckyfields/env-core
  let usesEnvCore = false;
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
    usesEnvCore = Boolean((pkg.dependencies && pkg.dependencies['@luckyfields/env-core']) || (pkg.devDependencies && pkg.devDependencies['@luckyfields/env-core']));
  } catch {}
  return { envFiles: found, envLoadedKeys: loaded, usesEnvCore };
}

export async function analyzeRepository(options: AnalyzeOptions = {}): Promise<HealthMetrics> {
  const cwd = options.cwd ?? process.cwd();
  const scripts = readPackageScripts(cwd);
  const timeoutMs = options.timeoutMs ?? 5 * 60_000; // 5 min default
  const verbose = options.verbose ?? false;

  const build = await runScriptIfExists('build', scripts, cwd, timeoutMs, verbose);
  // Prefer 'test' script; fall back to 'test:ci' if present
  const hasTestCi = Boolean(scripts['test:ci']);
  const test = await runScriptIfExists(hasTestCi ? 'test:ci' : 'test', scripts, cwd, timeoutMs, verbose);
  const env = analyzeEnv(cwd);

  return { repositoryPath: cwd, scripts, build, test, env };
}
