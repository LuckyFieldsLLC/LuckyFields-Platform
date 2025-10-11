// Minimal shim for the automatic JSX runtime so TS doesn't require real react/jsx-runtime.
declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
  const _default: any;
  export default _default;
}
