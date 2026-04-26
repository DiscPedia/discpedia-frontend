import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier'; // 1. 충돌 방지 설정 임포트

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'build']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended, // 추천 규칙 전개
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    // 2. 널널한 규칙 설정 (rules)
    rules: {
      'no-unused-vars': 'warn', // 미사용 변수: 경고만
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-console': 'off', // 콘솔 로그 허용
      '@typescript-eslint/no-explicit-any': 'off', // any 타입 허용
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // React 관련 널널한 설정
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
  eslintConfigPrettier, // 3. 마지막에 추가하여 Prettier와 충돌하는 룰 차단
]);