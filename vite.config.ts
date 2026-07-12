import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

// Checkout externo servido sob o MESMO dominio (X-Frame-Options: SAMEORIGIN
// bloqueia iframe cross-origin; proxiando, o iframe vira same-origin e carrega).
const CHECKOUT_ORIGIN = 'https://serverflow.dad';
const CHECKOUT_PATHS = ['/c', '/_next', '/api', '/pwa', '/favicon.ico', '/manifest.json'];

const checkoutProxy = Object.fromEntries(
  CHECKOUT_PATHS.map((p) => [
    p,
    {
      target: CHECKOUT_ORIGIN,
      changeOrigin: true,
      secure: true,
      configure: (proxy: any) => {
        proxy.on('proxyRes', (proxyRes: any) => {
          delete proxyRes.headers['x-frame-options'];
          delete proxyRes.headers['content-security-policy'];
          delete proxyRes.headers['cross-origin-opener-policy'];
        });
      },
    },
  ]),
);

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // File watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: checkoutProxy,
    },
  };
});
