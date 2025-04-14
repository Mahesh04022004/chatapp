import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    global: 'window'  // This makes `global` refer to `window` in the browser
  }
});
