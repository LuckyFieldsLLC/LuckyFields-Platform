// Minimal type shim for @netlify/functions when type resolution is unavailable in editor.
// This allows using `Handler` type in function files without pulling full dependency types.
// Safe to remove when your TS environment picks up real @netlify/functions types.

declare module '@netlify/functions' {
  export interface HandlerResponse {
    statusCode: number;
    headers?: Record<string, string>;
    body?: string;
    isBase64Encoded?: boolean;
  }
  export interface HandlerEvent {
    httpMethod: string;
    rawUrl?: string;
    path?: string;
    rawQuery?: string;
    headers?: Record<string, string>;
    body?: string | null;
  }
  export type Handler = (event: HandlerEvent, context: any) => Promise<HandlerResponse> | HandlerResponse;
}
