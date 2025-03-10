import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shadcn/ui': '/node_modules/@shadcn/ui/dist',
    },
  },
});