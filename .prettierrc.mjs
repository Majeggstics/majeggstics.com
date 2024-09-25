/** @type {import("prettier").Config} */
export default {
	plugins: ['prettier-plugin-astro'],
	overrides: [
		{
			files: '*.astro',
			options: {
				parser: 'astro',
			},
		},
	],
	printWidth: 100,
	useTabs: true,
	quoteProps: 'as-needed',
	singleQuote: true,
	trailingComma: 'all',
	endOfLine: 'lf',
	experimentalTernaries: true,
};
