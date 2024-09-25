import common from 'eslint-config-neon/common';
import node from 'eslint-config-neon/node';
import prettier from 'eslint-config-neon/prettier';
import react from 'eslint-config-neon/react';
import typescript from 'eslint-config-neon/typescript';
import merge from 'lodash.merge';

const commonFiles = '{js,mjs,cjs,ts,mts,cts,jsx,tsx}';

const commonRuleset = merge(...common, { files: [`**/*${commonFiles}`] });

const nodeRuleset = merge(...node, { files: [`**/*${commonFiles}`] });

const prettierRuleset = merge(...prettier, { files: [`**/*${commonFiles}`] });

const reactRuleset = merge(...react, {
	files: [`**/*${commonFiles}`],
	rules: {
		'react/button-has-type': 0,
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

		// those aren't absolute paths; ref tsconfig .compilerOptions.paths
		'import-x/no-absolute-path': 'off',
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
		ignores: ['**/node_modules/', '.git/', '**/dist/'],
	},
	{
		files: ['**/*{js,mjs,cjs,jsx}'],
		rules: { 'tsdoc/syntax': 0 },
	},
	commonRuleset,
	// nodeRuleset,
	reactRuleset,
	typeScriptRuleset,
	prettierRuleset,
];
