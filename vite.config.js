import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    open: true
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        login: './login.html',
        register: './register.html',
        feed: './feed.html'
      }
    }
  }
}); 