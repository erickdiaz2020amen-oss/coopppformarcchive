// Vercel Serverless Function - Backblaze B2 Proxy
// Catches all requests to /api/b2/* and forwards them to Backblaze B2

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
    // Reconstruct the path after /api/b2
    const pathSegments = req.query.path;
    const subPath = Array.isArray(pathSegments) ? pathSegments.join('/') : (pathSegments || '');

    // Rebuild query string without the catch-all 'path' param
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(req.query)) {
      if (key === 'path') continue;
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else {
        params.append(key, value);
      }
    }
    const qs = params.toString();
    const targetUrl = `https://coopmaza-documentos.s3.us-east-005.backblazeb2.com/${subPath}${qs ? '?' + qs : ''}`;

    // Build headers - forward AWS signature headers from the client
    const headers = {};
    const forwardPrefixes = ['x-amz-', 'authorization', 'content-type', 'content-length'];
    
    for (const [key, value] of Object.entries(req.headers)) {
      const lower = key.toLowerCase();
      if (lower === 'host' || lower === 'connection' || lower === 'transfer-encoding') continue;
      if (forwardPrefixes.some(prefix => lower.startsWith(prefix) || lower === prefix)) {
        headers[key] = value;
      }
    }
    // Set the correct Host header for B2
    headers['Host'] = 'coopmaza-documentos.s3.us-east-005.backblazeb2.com';

    const fetchOptions = {
      method: req.method,
      headers,
    };

    // Forward body for PUT (uploads)
    if (req.method === 'PUT' || req.method === 'POST') {
      const body = await getRawBody(req);
      fetchOptions.body = body;
    }

    const response = await fetch(targetUrl, fetchOptions);

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Forward response headers
    const contentType = response.headers.get('content-type');
    if (contentType) res.setHeader('Content-Type', contentType);
    const contentLength = response.headers.get('content-length');
    if (contentLength) res.setHeader('Content-Length', contentLength);

    // For GET requests (downloads), stream the response
    if (req.method === 'GET' || req.method === 'HEAD') {
      const buffer = Buffer.from(await response.arrayBuffer());
      res.status(response.status).send(buffer);
    } else {
      const text = await response.text();
      res.status(response.status).send(text);
    }
  } catch (error) {
    console.error('B2 proxy error:', error);
    res.status(500).json({ error: 'B2 proxy error', details: error.message });
  }
}
