import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/socket.io/': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true,
      },
    },
  },
  publicDir: 'public', // CRA's default public directory
  build: {
    outDir: 'build', // CRA's default build output
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Example: maps @ to the src directory
      // Add more aliases as needed
    },
  },
});
