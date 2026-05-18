import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api/supabase': {
        target: 'https://lcajcnprlvbnqelamqnj.supabase.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/supabase/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('apikey', 'sb_secret_DQsWdev6KYsnSdTbEGK1xw_cJOkkgqk');
            proxyReq.setHeader('Authorization', 'Bearer sb_secret_DQsWdev6KYsnSdTbEGK1xw_cJOkkgqk');
            
            // Remove browser headers so Supabase doesn't block the request
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
            proxyReq.setHeader('user-agent', 'node-fetch');
            proxyReq.removeHeader('x-client-info');
            proxyReq.removeHeader('sec-ch-ua');
            proxyReq.removeHeader('sec-ch-ua-mobile');
            proxyReq.removeHeader('sec-ch-ua-platform');
          });
        }
      },
      '/api/b2': {
        target: 'https://coopmaza-documentos.s3.us-east-005.backblazeb2.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/b2/, ''),
      }
    }
  }
})
