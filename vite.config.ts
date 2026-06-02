import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Сайт публикуется как project-site на GitHub Pages:
  // https://fagirafe.github.io/structura/
  base: '/structura/',
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    open: true,
  },
});
