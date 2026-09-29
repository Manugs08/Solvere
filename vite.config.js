import { join } from 'node:path'
import { tmpdir } from 'node:os'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// El proyecto vive en una carpeta sincronizada por Dropbox, que bloquea archivos
// de node_modules/.vite mientras sincroniza. Sacamos el cache de ahí para evitar
// errores EBUSY al renombrar deps_temp_* -> deps.
const cacheDir = join(process.env.LOCALAPPDATA || tmpdir(), 'vite-cache', 'tp-anual')

// https://vite.dev/config/
export default defineConfig({
  base: './',
  cacheDir,
  plugins: [react()],
})
