import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

declare const process: any;

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3109,
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
  assetsInclude: ['**/*.jpeg', '**/*.jpg', '**/*.JPG', '**/*.JPEG', '**/*.png', '**/*.webp', '**/*.ttf', '**/*.otf'],
});
