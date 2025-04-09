import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 👇 esto es lo importante
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {}
  },
  build: {
    lib: {
      entry: './src/main.jsx',
      name: 'RuggeriFit',
      fileName: 'main',
      formats: ['iife'] // formato compatible con navegador
    },
    rollupOptions: {
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
})
