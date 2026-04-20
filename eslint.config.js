import path from 'node:path';
import prettier from 'eslint-config-prettier';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';
import { importX } from 'eslint-plugin-import-x';
import svelteConfig from './svelte.config.js';

const gitignorePath = path.resolve(import.meta.dirname, '.gitignore');

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		plugins: { import: importX },
		rules: {
			'no-undef': 'off',
			'@typescript-eslint/no-import-type-side-effects': 'error',
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
			'@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
			'import/first': 'error',
			'import/no-duplicates': 'error',
			'import/no-relative-packages': 'error',
			'import/newline-after-import': 'error',
			// 'import/no-unassigned-import': 'error',
			'import/order': [
				'error',
				{
					groups: [
						'builtin',
						'external',
						'internal',
						'parent',
						'sibling',
						'index',
						'object',
						'unknown',
						'type'
					]
				}
			],
			'import/no-restricted-paths': [
				'error',
				{
					zones: [
						// shared modules cannot import from the stack
						{ target: './src/lib/types', from: './src/lib/services' },
						{ target: './src/lib/types', from: './src/lib/stores' },
						{ target: './src/lib/types', from: './src/lib/location' },
						{ target: './src/lib/config', from: './src/lib/services' },
						{ target: './src/lib/config', from: './src/lib/stores' },
						{ target: './src/lib/logging', from: './src/lib/services' },
						{ target: './src/lib/logging', from: './src/lib/stores' },

						// stores cannot be imported by services or below
						{ target: './src/lib/services', from: './src/lib/stores' },

						// repository cannot import from services or above
						{ target: './src/lib/db', from: './src/lib/services' },
						{ target: './src/lib/db', from: './src/lib/stores' }
					]
				}
			]
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		}
	}
);
