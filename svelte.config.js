import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const dev = process.env.NODE_ENV === 'development';

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({ fallback: 'index.html' }),
		alias: {
			$lib: 'src/lib',
			$db: 'src/lib/db',
			$types: 'src/lib/types/'
		},
		paths: { base: dev ? '' : '/snot.app' }
	}
};

export default config;
