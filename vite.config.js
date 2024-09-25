import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'marquee'
        }
      }
    }),
  ],
  define: {
    '__VUE_OPTIONS_API__': true,        // Keep this flag if you're using the Vue Options API
    '__VUE_PROD_DEVTOOLS__': false,     // Disable Vue devtools in production
    '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': false // Disable hydration mismatch details in production
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
