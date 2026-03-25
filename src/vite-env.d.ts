/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="react-dom" />

/** 由 vite.config.ts define 注入的全局常量，在代码中直接使用，不要用 import.meta.env.xxx */
declare const __DEVELOPER__: string;
declare const __ACT_NAME__: string;
declare const __UI_BASELINE_VAL__: string;
declare const __STATIC_PREFIX__: string;
declare const __SENTRY_RELEASE__: string;