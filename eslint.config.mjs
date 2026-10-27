import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import nextPlugin from '@next/eslint-plugin-next';
export default defineConfig([
  globalIgnores(['.next/**', 'out/**', 'coverage/**', 'test-results/**', 'playwright-report/**', 'next-env.d.ts']),
  {files:['**/*.{ts,tsx}'],extends:[js.configs.recommended,...tseslint.configs.recommended]},
  {files:['src/**/*.{ts,tsx}'],plugins:{'@next/next':nextPlugin},rules:{...nextPlugin.configs.recommended.rules,...nextPlugin.configs['core-web-vitals'].rules}},
  {files:['**/*.mjs'],extends:[js.configs.recommended],languageOptions:{globals:{process:'readonly',console:'readonly'}}},
]);
