/// <reference types="nativewind/types" />

// The Tailwind entrypoint is consumed by Metro, not by TypeScript. This declaration
// lets the side-effect import in App.tsx typecheck.
declare module '*.css';
