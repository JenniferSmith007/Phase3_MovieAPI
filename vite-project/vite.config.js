import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  base: '/phase3_movieapi/',
  server: { https: true },
  plugins: [ mkcert() ]
})
