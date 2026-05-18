import { createProxyMiddleware } from 'http-proxy-middleware';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

const proxy = createProxyMiddleware({
  target: 'https://lcajcnprlvbnqelamqnj.supabase.co',
  changeOrigin: true,
  pathRewrite: { '^/api/supabase': '' },
  on: {
    proxyReq: (proxyReq) => {
      // Vercel injected environment variables
      const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_secret_DQsWdev6KYsnSdTbEGK1xw_cJOkkgqk';
      proxyReq.setHeader('apikey', supabaseKey);
      proxyReq.setHeader('Authorization', `Bearer ${supabaseKey}`);
      
      // Remove browser headers
      proxyReq.removeHeader('origin');
      proxyReq.removeHeader('referer');
      proxyReq.setHeader('user-agent', 'node-fetch');
      proxyReq.removeHeader('x-client-info');
      proxyReq.removeHeader('sec-ch-ua');
      proxyReq.removeHeader('sec-ch-ua-mobile');
      proxyReq.removeHeader('sec-ch-ua-platform');
    }
  }
});

export default function handler(req, res) {
  return proxy(req, res, (result) => {
    if (result instanceof Error) {
      throw result;
    }
  });
}
