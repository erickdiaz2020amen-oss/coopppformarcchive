import { createProxyMiddleware } from 'http-proxy-middleware';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

const proxy = createProxyMiddleware({
  target: 'https://coopmaza-documentos.s3.us-east-005.backblazeb2.com',
  changeOrigin: true,
  pathRewrite: { '^/api/b2': '' },
});

export default function handler(req, res) {
  return proxy(req, res, (result) => {
    if (result instanceof Error) {
      throw result;
    }
  });
}
