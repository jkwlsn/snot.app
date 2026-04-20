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
			complexity: ['warn', { max: 15 }],
			'no-nested-ternary': 'error',
			'no-restricted-syntax': [
				'error',
				{
					selector: 'TSEnumDeclaration',
					message: 'Use literal unions or `as const` objects instead of enums.'
				}
			],
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
			]
			//			'import/no-restricted-paths': [
			//				'error',
			//				{
			//					zones: []
			//				}
			//			]
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
		},
		rules: {
			'svelte/no-navigation-without-resolve': ['error', { ignoreLinks: true }]
		}
	}
);
