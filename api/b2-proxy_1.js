// Vercel Serverless Function - Backblaze B2 Proxy
// All /api/b2/* requests are rewritten to this function via vercel.json

export const config = {
  api: {
    bodyParser: false, // Needed for binary file uploads
  },
};

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,HEAD,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    return res.status(200).end();
  }

  try {
    // The original sub-path is passed via rewrite query param
    const proxyPath = req.query.__path || '';

    // Rebuild query string (excluding __path)
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(req.query)) {
      if (key === '__path') continue;
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else {
        params.append(key, value);
      }
    }
    const qs = params.toString();
    const targetUrl = `https://coopmaza-documentos.s3.us-east-005.backblazeb2.com/${proxyPath}${qs ? '?' + qs : ''}`;

    // Forward AWS signature headers from the client
    const headers = {};
    for (const [key, value] of Object.entries(req.headers)) {
      const lower = key.toLowerCase();
      // Skip hop-by-hop and internal headers
      if (['host', 'connection', 'transfer-encoding', 'keep-alive'].includes(lower)) continue;
      // Forward AWS and content headers
      if (lower.startsWith('x-amz-') || lower === 'authorization' || lower === 'content-type' || lower === 'content-length') {
        headers[key] = value;
      }
    }
    // Set correct Host for B2
    headers['Host'] = 'coopmaza-documentos.s3.us-east-005.backblazeb2.com';

    const fetchOptions = { method: req.method, headers };

    // Forward body for PUT/POST (file uploads)
    if (req.method === 'PUT' || req.method === 'POST') {
      const body = await getRawBody(req);
      fetchOptions.body = body;
      // Remove content-length as fetch will set it from the body
      delete headers['content-length'];
    }

    const response = await fetch(targetUrl, fetchOptions);

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');

    const ct = response.headers.get('content-type');
    if (ct) res.setHeader('Content-Type', ct);

    // Return response
    const buffer = Buffer.from(await response.arrayBuffer());
    res.status(response.status).send(buffer);
  } catch (error) {
    console.error('B2 proxy error:', error);
    res.status(500).json({ error: 'B2 proxy error', details: error.message });
  }
}
