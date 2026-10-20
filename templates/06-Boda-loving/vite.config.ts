import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/demos/boda-loving/',
  server: {
    port: 3107,
    host: '0.0.0.0',
  },
});
