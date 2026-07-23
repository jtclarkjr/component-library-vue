import vue from '@vitejs/plugin-vue'
import Vue from 'unplugin-vue/rolldown'
import { defineConfig } from 'vite-plus'

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  plugins: [vue()],
  pack: {
    entry: ['src/index.ts'],
    platform: 'neutral',
    format: ['esm'],
    sourcemap: true,
    plugins: [Vue({ isProduction: true })],
    dts: {
      vue: true,
    },
    css: {
      splitting: false,
      fileName: 'style.css',
    },
    deps: {
      neverBundle: ['vue', 'reka-ui', '@internationalized/date'],
    },
    exports: true,
  },
  fmt: {
    semi: false,
    singleQuote: true,
    printWidth: 100,
    trailingComma: 'all',
    ignorePatterns: ['dist', 'storybook-static', '.local-pack', 'graphify-out'],
  },
  lint: {
    plugins: ['eslint', 'typescript', 'unicorn', 'oxc', 'vue', 'vitest'],
    categories: {
      correctness: 'error',
      suspicious: 'warn',
    },
    env: {
      browser: true,
      builtin: true,
    },
    ignorePatterns: [
      '**/dist/**',
      '**/coverage/**',
      '**/storybook-static/**',
      '**/.local-pack/**',
      'graphify-out',
    ],
    rules: {
      'no-array-constructor': 'error',
      'typescript/ban-ts-comment': 'error',
      'typescript/no-empty-object-type': 'error',
      'typescript/no-explicit-any': 'error',
      'typescript/no-namespace': 'error',
      'typescript/no-require-imports': 'error',
      'typescript/no-unnecessary-type-constraint': 'error',
      'typescript/no-unsafe-function-type': 'error',
      'vite-plus/prefer-vite-plus-imports': 'error',
    },
    overrides: [
      {
        files: ['.storybook/**/*.ts'],
        rules: {
          'vite-plus/prefer-vite-plus-imports': 'off',
        },
      },
      {
        files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts', '**/*.vue'],
        rules: {
          'constructor-super': 'off',
          'getter-return': 'off',
          'no-class-assign': 'off',
          'no-const-assign': 'off',
          'no-dupe-class-members': 'off',
          'no-dupe-keys': 'off',
          'no-func-assign': 'off',
          'no-import-assign': 'off',
          'no-new-native-nonconstructor': 'off',
          'no-obj-calls': 'off',
          'no-redeclare': 'off',
          'no-setter-return': 'off',
          'no-this-before-super': 'off',
          'no-undef': 'off',
          'no-unreachable': 'off',
          'no-unsafe-negation': 'off',
          'no-var': 'error',
          'no-with': 'off',
          'prefer-const': 'error',
          'prefer-rest-params': 'error',
          'prefer-spread': 'error',
        },
      },
    ],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    jsPlugins: [
      {
        name: 'vite-plus',
        specifier: 'vite-plus/oxlint-plugin',
      },
    ],
  },
})
