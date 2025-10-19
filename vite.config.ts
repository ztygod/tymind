import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'TyMind',
      fileName: (format) => `tymind.${format}.js`,
    },
    rollupOptions: {
      external: [],
    },
  },
  plugins: [dts()],
});
