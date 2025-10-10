import fs from 'node:fs';
import path from 'node:path';
import type { HealthMetrics } from './analyzer';
import type { HealthScore } from './score';

export function formatPretty(metrics: HealthMetrics, score: HealthScore): string {
  const lines = [
    `Repository: ${metrics.repositoryPath}`,
    '',
    'Build:',
    `  script: ${metrics.build.hasScript ? 'yes' : 'no'}`,
    `  success: ${metrics.build.success ?? 'n/a'}`,
    `  durationMs: ${metrics.build.durationMs ?? 'n/a'}`,
    metrics.build.stdoutPreview ? '  stdout: |\n' + indent(metrics.build.stdoutPreview, 4) : undefined,
    metrics.build.stderrPreview ? '  stderr: |\n' + indent(metrics.build.stderrPreview, 4) : undefined,
    '',
    'Test:',
    `  script: ${metrics.test.hasScript ? 'yes' : 'no'}`,
    `  success: ${metrics.test.success ?? 'n/a'}`,
    `  durationMs: ${metrics.test.durationMs ?? 'n/a'}`,
    metrics.test.stdoutPreview ? '  stdout: |\n' + indent(metrics.test.stdoutPreview, 4) : undefined,
    metrics.test.stderrPreview ? '  stderr: |\n' + indent(metrics.test.stderrPreview, 4) : undefined,
    '',
    'Env:',
    `  files: ${metrics.env.envFiles.join(', ') || '(none)'} `,
    `  loadedKeys: ${metrics.env.envLoadedKeys}`,
    `  usesEnvCore: ${metrics.env.usesEnvCore}`,
    '',
    `Score: ${score.score} (grade: ${score.grade})`,
    ...score.reasons.map((r) => `  - ${r}`),
  ].filter(Boolean) as string[];

  return lines.join('\n');
}

export function writeJsonReport(metrics: HealthMetrics, score: HealthScore, outDir: string): string {
  const data = { generatedAt: new Date().toISOString(), metrics, score };
  const file = path.join(outDir, 'repo-health.json');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  return file;
}

export function outputReport(metrics: HealthMetrics, score: HealthScore, opts?: { format?: 'pretty' | 'json'; outDir?: string; print?: boolean }) {
  const format = opts?.format ?? 'pretty';
  if (format === 'json') {
    const file = writeJsonReport(metrics, score, opts?.outDir ?? path.join(metrics.repositoryPath, 'reports'));
    if (opts?.print) console.log(file);
    return file;
  }
  const text = formatPretty(metrics, score);
  if (opts?.print) console.log(text);
  return text;
}

function indent(s: string, n: number): string {
  const pad = ' '.repeat(n);
  return s
    .split('\n')
    .map((l) => pad + l)
    .join('\n');
}
