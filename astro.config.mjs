import { ecsstatic } from '@acab/ecsstatic/vite';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	integrations: [mdx(), react()],
	vite: {
		plugins: [ecsstatic()],
	},
	prefetch: true,
	outDir: './out',
});
