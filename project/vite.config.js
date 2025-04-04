import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    fs: {
      allow: ['..'],
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        login: './login.html',
        feed: './feed.html'
      }
    }
  },
  envDir: '.'
});