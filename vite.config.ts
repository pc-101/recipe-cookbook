// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api/spoon': {
        target: 'https://api.spoonacular.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/spoon/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            const url = new URL(proxyReq.path!, 'https://api.spoonacular.com');
            if (!url.searchParams.get('apiKey') && process.env.SPOON_KEY) {
              url.searchParams.set('apiKey', process.env.SPOON_KEY);
              proxyReq.path = url.pathname + '?' + url.searchParams.toString();
            }
          });
        }
      }
    }
  }
});