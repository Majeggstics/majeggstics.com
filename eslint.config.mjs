import tsParser from '@typescript-eslint/parser';
import astroParser from 'astro-eslint-parser';
import astro from 'eslint-config-neon/astro';
import common from 'eslint-config-neon/common';
import prettier from 'eslint-config-neon/prettier';
import react from 'eslint-config-neon/react';
import typescript from 'eslint-config-neon/typescript';
import merge from 'lodash.merge';

const commonFiles = '{js,mjs,cjs,ts,mts,cts,jsx,tsx}';

const commonRuleset = merge(...common, { files: [`**/*${commonFiles}`] });

const prettierRuleset = merge(...prettier, { files: [`**/*${commonFiles}`] });

const reactRuleset = merge(...react, {
	files: [`**/*${commonFiles}`],
	rules: {
		'react/button-has-type': 'off',
	},
});

const astroRuleset = merge(...astro, {
	files: [`**/*.astro`],
	languageOptions: {
		parser: astroParser,
		parserOptions: {
			parser: tsParser,
		},
	},
});

const typeScriptRuleset = merge(...typescript, {
	ignores: ['src/env.d.ts'],
	files: [`**/*${commonFiles}`],
	languageOptions: {
		parserOptions: {
			warnOnUnsupportedTypeScriptVersion: false,
			allowAutomaticSingleRunInference: true,
			project: ['tsconfig.eslint.json'],
		},
	},
	rules: {
		'@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
		'@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
		'@typescript-eslint/consistent-type-definitions': ['error', 'type'],
		'@typescript-eslint/method-signature-style': ['error', 'property'],

		// those aren't absolute paths; ref tsconfig .compilerOptions.paths
		'import-x/no-absolute-path': 'off',

		// i don't prefer that, sorry
		'unicorn/prefer-string-replace-all': 'off',
		'unicorn/no-zero-fractions': 'off',
		'typescript-sort-keys/interface': 'off',
		'@typescript-eslint/sort-type-constituents': 'off',
		'react/jsx-sort-props': 'off',
	},
	settings: {
		'import/resolver': {
			typescript: {
				project: ['tsconfig.eslint.json'],
			},
		},
	},
});

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
	{
		ignores: ['**/node_modules/', '.git/', 'out/'],
	},
	{
		files: ['**/*{js,mjs,cjs,jsx}'],
		rules: { 'tsdoc/syntax': 'off' },
	},
	commonRuleset,
	reactRuleset,
	typeScriptRuleset,
	prettierRuleset,
	astroRuleset,
];
