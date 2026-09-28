import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/* Absolute site URL for social previews (og:image must be absolute).
   On Vercel this is picked up automatically; set VITE_SITE_URL to use a custom domain. */
function siteUrlPlugin(mode) {
  const env = loadEnv(mode, process.cwd(), '');
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_URL;
  const url = (env.VITE_SITE_URL || (vercel ? `https://${vercel}` : '')).replace(/\/$/, '');
  return {
    name: 'site-url',
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', url),
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), siteUrlPlugin(mode)],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1200,
  },
}));
