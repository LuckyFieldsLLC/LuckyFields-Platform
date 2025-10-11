/**
 * localStorageManager.ts
 * クイズJSONの保存・取得・削除の最小実装（暗号化は上位で行う想定）
 */

export type StorageKey = string;

export const LocalStorageManager = {
  save(key: StorageKey, value: string): void {
    if (typeof localStorage === "undefined") throw new Error("localStorage not available");
    localStorage.setItem(key, value);
  },

  load(key: StorageKey): string | null {
    if (typeof localStorage === "undefined") throw new Error("localStorage not available");
    return localStorage.getItem(key);
  },

  remove(key: StorageKey): void {
    if (typeof localStorage === "undefined") throw new Error("localStorage not available");
    localStorage.removeItem(key);
  },
};
