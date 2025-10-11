/**
 * fileSystemHandler.ts
 * クイズJSONの保存/読込/削除の最小実装
 * - 可能なら File System Access API を使用
 * - 非対応ブラウザでは a[download] と <input type="file"> を使うフォールバック
 */

export interface QuizData {
  id?: string;
  title?: string;
  questions?: unknown[];
  // 任意のJSONとする
  [k: string]: unknown;
}

export type JsonLike = Record<string, unknown> | unknown[];

// ブラウザ判定
const hasWindow = typeof window !== "undefined";
const supportsFS = hasWindow && !!(window as any).showSaveFilePicker;

export async function saveJsonToFile(data: JsonLike, suggestedName = "quiz.json"): Promise<void> {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });

  if (supportsFS) {
    const handle = await (window as any).showSaveFilePicker({
      suggestedName,
      types: [{ description: "JSON", accept: { "application/json": [".json"] } }],
    });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
    return;
  }

  // フォールバック: a[download]
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = suggestedName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function openJsonFromFile(): Promise<JsonLike> {
  if (supportsFS) {
    const [handle] = await (window as any).showOpenFilePicker({
      multiple: false,
      types: [{ description: "JSON", accept: { "application/json": [".json"] } }],
    });
    const file = await handle.getFile();
    const text = await file.text();
    return JSON.parse(text);
  }

  // フォールバック: 一時 input 要素
  return new Promise<JsonLike>((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.style.display = "none";
    document.body.appendChild(input);

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) {
        cleanup();
        reject(new Error("No file selected"));
        return;
      }
      file
        .text()
        .then((t) => resolve(JSON.parse(t)))
        .catch(reject)
        .finally(cleanup);
    };

    input.click();

    function cleanup() {
      input.remove();
    }
  });
}

// File System Access API では削除はユーザー操作になるため、ここでは no-op
export async function deleteFilePlaceholder(): Promise<void> {
  // 読み書きは可能だが、任意パスの削除はAPIで直接できないため、UIで案内する想定
}
