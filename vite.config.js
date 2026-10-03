import { defineConfig } from 'vite';

export default defineConfig({
  base: '/goit-advancedjs-hw-02/',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        timer: '1-timer.html',
        snackbar: '2-snackbar.html',
      },
    },
  },
});
