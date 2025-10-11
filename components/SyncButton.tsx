import React, { useState } from 'react';

export interface SyncButtonProps {
  endpoint?: string; // Netlify Functions のエンドポイント（例: /.netlify/functions/syncQuizzes）
  method?: 'GET' | 'POST';
  body?: unknown; // POST時に送るボディ
}

export function SyncButton({ endpoint = '/.netlify/functions/syncQuizzes', method = 'POST', body }: SyncButtonProps) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function handleClick() {
    try {
      setBusy(true);
      setMsg('');
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method === 'POST' ? JSON.stringify(body ?? {}) : undefined,
      });
      const text = await res.text();
      setMsg(`${res.status} ${res.statusText}: ${text}`);
    } catch (e: any) {
      setMsg(`Sync failed: ${e?.message ?? String(e)}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={handleClick}
        disabled={busy}
        className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
      >
        {busy ? 'Syncing…' : 'Sync'}
      </button>
      {msg && <span className="text-xs text-gray-700">{msg}</span>}
    </div>
  );
}

export default SyncButton;
