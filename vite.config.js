import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { accessProtectionPlugin } from './server/vite-access.js'

export default defineConfig(({mode}) => {
  const env = loadEnv(mode,process.cwd(),'')
  for (const name of ['DATABASE_URL','ADMIN_USERNAME','ADMIN_PASSWORD']) {
    if (!process.env[name] && env[name]) process.env[name] = env[name]
  }
  return {plugins:[accessProtectionPlugin(),react()]}
})
