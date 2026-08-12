import { defineConfig } from 'oxfmt';

export default defineConfig({
	ignorePatterns: ['node_modules', 'dist', '.next', '.yarn', 'out'],
	printWidth: 100,
	singleQuote: true,
	useTabs: true,
});
