import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  server: { port: 3200 },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    // Allow VITE_ prefix env vars to reach client-side React islands
    envPrefix: 'VITE_',
  },
});
