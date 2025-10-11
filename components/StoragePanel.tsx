import React, { useId, useMemo, useState } from 'react';
import { LocalStorageManager } from '../utils/localStorageManager';
import { encryptJson, decryptJson, isWebCryptoAvailable } from '../utils/cryptoUtils';
import { saveJsonToFile, openJsonFromFile } from '../utils/fileSystemHandler';

// 最小のTailwindクラスを使用。Tailwind未導入でも害はありません。

export interface StoragePanelProps<T = unknown> {
  storageKey?: string;
  initialData?: T;
}

export function StoragePanel<T = unknown>({ storageKey = 'quiz.enc', initialData }: StoragePanelProps<T>) {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string>('');
  const [data, setData] = useState<T | undefined>(initialData);
  const inputId = useId();

  const cryptoOK = useMemo(() => isWebCryptoAvailable(), []);

  async function handleSaveLocal() {
    try {
      if (!cryptoOK) throw new Error('Web Crypto API not available (https required)');
      if (typeof data === 'undefined') throw new Error('No data to save');
      const payload = await encryptJson(data, password);
      LocalStorageManager.save(storageKey, payload);
      setStatus('Saved to localStorage');
    } catch (e: any) {
      setStatus(`Save failed: ${e?.message ?? String(e)}`);
    }
  }

  async function handleLoadLocal() {
    try {
      if (!cryptoOK) throw new Error('Web Crypto API not available');
      const payload = LocalStorageManager.load(storageKey);
      if (!payload) throw new Error('No local data');
      const obj = await decryptJson<T>(payload, password);
      setData(obj);
      setStatus('Loaded from localStorage');
    } catch (e: any) {
      setStatus(`Load failed: ${e?.message ?? String(e)}`);
    }
  }

  function handleDeleteLocal() {
    try {
      LocalStorageManager.remove(storageKey);
      setStatus('Deleted from localStorage');
    } catch (e: any) {
      setStatus(`Delete failed: ${e?.message ?? String(e)}`);
    }
  }

  async function handleExportFile() {
    try {
      if (typeof data === 'undefined') throw new Error('No data to export');
      // JsonLike に限定: object または array のみ許可
      const jsonLike: any = Array.isArray(data)
        ? (data as unknown[])
        : (typeof data === 'object' && data !== null
            ? (data as Record<string, unknown>)
            : null);
      if (!jsonLike) throw new Error('Data must be object or array');
      await saveJsonToFile(jsonLike, 'quiz.json');
      setStatus('Exported to file');
    } catch (e: any) {
      setStatus(`Export failed: ${e?.message ?? String(e)}`);
    }
  }

  async function handleImportFile() {
    try {
      const imported = await openJsonFromFile();
      setData(imported as T);
      setStatus('Imported from file');
    } catch (e: any) {
      setStatus(`Import failed: ${e?.message ?? String(e)}`);
    }
  }

  return (
    <div className="space-y-3 p-4 border rounded-md">
      <div className="flex items-center gap-2">
        <label htmlFor={inputId} className="text-sm font-medium">Password</label>
        <input
          id={inputId}
          type="password"
          className="border px-2 py-1 rounded w-64"
          value={password}
          onChange={(e: { currentTarget: { value: string } }) => setPassword(e.currentTarget.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={handleSaveLocal}>
          Save Local
        </button>
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={handleLoadLocal}>
          Load Local
        </button>
        <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={handleDeleteLocal}>
          Delete Local
        </button>
        <button className="px-3 py-1 bg-gray-600 text-white rounded" onClick={handleExportFile}>
          Export File
        </button>
        <button className="px-3 py-1 bg-gray-600 text-white rounded" onClick={handleImportFile}>
          Import File
        </button>
      </div>

      {status && <p className="text-sm text-gray-700">{status}</p>}

      <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-60">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

export default StoragePanel;
