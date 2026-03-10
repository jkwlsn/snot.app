import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({ fallback: 'index.html' }),
		alias: {
			$lib: 'src/lib',
			$db: 'src/lib/db',
			$types: 'src/lib/types/'
		}
	}
};

export default config;
