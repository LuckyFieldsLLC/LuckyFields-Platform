// Minimal JSX/React type shim so TSX files type-check in repos without React installed.
// Remove this when you add "react" and "@types/react" and proper tsconfig jsx settings.

declare module 'react' {
  export type ReactNode = any;
  export function useState<T = any>(init?: T): [T, (v: T) => void];
  export function useMemo<T>(fn: () => T, deps: any[]): T;
  export function useId(): string;
  const React: any;
  export default React;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
