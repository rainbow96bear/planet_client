import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import dotenv from 'dotenv';
import path from 'path';

const mode = process.env.NODE_ENV || 'development';
const envFile = mode === 'production' ? '.env.prod' : '.env.dev';

dotenv.config({ path: path.resolve('./env', envFile) });

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: { adapter: adapter() }
};

export default config;
