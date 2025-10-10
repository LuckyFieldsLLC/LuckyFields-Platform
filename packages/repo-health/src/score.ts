import type { HealthMetrics } from './analyzer';

export type HealthScore = {
  score: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  reasons: string[];
};

export function scoreHealth(metrics: HealthMetrics): HealthScore {
  let score = 100;
  const reasons: string[] = [];

  // Build weight
  if (!metrics.build.hasScript) {
    score -= 25;
    reasons.push('build スクリプトが存在しません');
  } else if (metrics.build.success === false) {
    score -= 35;
    reasons.push('build が失敗しました');
  } else if (typeof metrics.build.durationMs === 'number' && metrics.build.durationMs > 180_000) {
    score -= 10;
    reasons.push('build に時間がかかりすぎています (> 3min)');
  }

  // Test weight
  if (!metrics.test.hasScript) {
    score -= 20;
    reasons.push('test スクリプトが存在しません');
  } else if (metrics.test.success === false) {
    score -= 25;
    reasons.push('test が失敗しました');
  } else if (typeof metrics.test.durationMs === 'number' && metrics.test.durationMs > 120_000) {
    score -= 5;
    reasons.push('test に時間がかかりすぎています (> 2min)');
  }

  // Env weight
  if (metrics.env.envFiles.length === 0) {
    score -= 10;
    reasons.push('.env ファイルが見つかりません');
  }
  if (!metrics.env.usesEnvCore) {
    score -= 5;
    reasons.push('@luckyfields/env-core を使用していません');
  }

  // Clamp 0..100
  if (score < 0) score = 0;
  if (score > 100) score = 100;

  const grade: HealthScore['grade'] = score >= 90 ? 'A' : score >= 75 ? 'B' : score >= 60 ? 'C' : score >= 40 ? 'D' : 'E';

  return { score, grade, reasons };
}
