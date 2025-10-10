export type EnvSchema = Record<string, 'string' | 'boolean' | 'number'>;

export function loadEnv(schema: EnvSchema) {
  const out: Record<string, unknown> = {};
  for (const [key, type] of Object.entries(schema)) {
    const raw = process.env[key];
    if (raw == null) continue;
    out[key] = type === 'boolean' ? raw === 'true' : type === 'number' ? Number(raw) : raw;
  }
  return out;
}
