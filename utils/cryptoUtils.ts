/**
 * cryptoUtils.ts
 * AES-GCM (Web Crypto API) によるシンプルな暗号化/復号ユーティリティ
 * - 鍵導出: PBKDF2(SHA-256)
 * - 暗号方式: AES-GCM(256)
 * - 返却: Base64URL 文字列（iv:暗号文:塩）
 */

// Base64URL <-> ArrayBuffer 変換
const b64uToBytes = (b64u: string): Uint8Array => {
  const b64 = b64u.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 ? 4 - (b64.length % 4) : 0;
  const normalized = b64 + "=".repeat(pad);
  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
};

const bytesToB64u = (bytes: Uint8Array): string => {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  const b64 = btoa(binary);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const pwBytes = textEncoder.encode(password);
  const baseKey = await crypto.subtle.importKey(
    "raw",
    pwBytes,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  // salt は BufferSource を要求されるため ArrayBuffer に変換
  const saltBuf = salt.buffer as ArrayBuffer;
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: saltBuf,
      iterations: 100_000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptJson(json: unknown, password: string): Promise<string> {
  const plain = textEncoder.encode(JSON.stringify(json));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(password, salt);
  // iv も BufferSource 扱いに合わせ ArrayBuffer を渡す
  const ivBuf = iv.buffer as ArrayBuffer;
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv: ivBuf }, key, plain);
  const out = `${bytesToB64u(iv)}:${bytesToB64u(new Uint8Array(cipher))}:${bytesToB64u(salt)}`;
  return out;
}

export async function decryptJson<T = unknown>(payload: string, password: string): Promise<T> {
  const [ivB64, cipherB64, saltB64] = payload.split(":");
  if (!ivB64 || !cipherB64 || !saltB64) throw new Error("Invalid payload format");
  const iv = b64uToBytes(ivB64);
  const salt = b64uToBytes(saltB64);
  const key = await deriveKey(password, salt);
  const cipherBytes = b64uToBytes(cipherB64);
  // decrypt も BufferSource を渡す
  const ivBuf = iv.buffer as ArrayBuffer;
  const cipherBuf = cipherBytes.buffer as ArrayBuffer;
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: ivBuf }, key, cipherBuf);
  const text = textDecoder.decode(plain);
  return JSON.parse(text) as T;
}

export function isWebCryptoAvailable(): boolean {
  try {
    return typeof crypto !== "undefined" && !!crypto.subtle;
  } catch {
    return false;
  }
}
