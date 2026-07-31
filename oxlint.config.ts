import { defineConfig } from 'oxlint';

import common from 'eslint-config-neon/oxlint/common';
import node from 'eslint-config-neon/oxlint/node';
import astro from 'eslint-config-neon/oxlint/astro';
import typescript from 'eslint-config-neon/oxlint/typescript';

export default defineConfig({
	ignorePatterns: ['node_modules', 'dist', '.next', '.yarn', 'out'],
	extends: [common, node, typescript, astro],
	plugins: ['typescript', 'unicorn', 'oxc'],
	categories: {
		correctness: 'error',
	},
	env: {
		builtin: true,
	},
	rules: {
		'no-promise-executor-return': ['error', { allowVoid: true }],
		'@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
		'@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
		'@typescript-eslint/consistent-type-definitions': ['error', 'type'],
		'@typescript-eslint/method-signature-style': ['error', 'property'],
		'@typescript-eslint/no-confusing-void-expression': ['error', { ignoreVoidOperator: true }],

		// those aren't absolute paths; ref tsconfig .compilerOptions.paths
		'import-x/no-absolute-path': 'off',

		// i don't prefer that, sorry
		'unicorn/prefer-string-replace-all': 'off',
		'unicorn/no-zero-fractions': 'off',
		'@typescript-eslint/no-meaningless-void-operator': 'off',

		// getElementById is faster
		'unicorn/prefer-query-selector': 'off',

		// from my cold dead hands
		'no-inline-comments': 'off',

		// i have strong opinions about curly braces and none of the options match
		curly: 'off',

		// similarly, i have strong opinions about variable name length
		// for example: (x) => x + 1 is _perfectly fine_
		'id-length': 'off',
	},
});
