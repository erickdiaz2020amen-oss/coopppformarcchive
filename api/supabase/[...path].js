// Vercel Serverless Function - Supabase Proxy
// Catches all requests to /api/supabase/* and forwards them to Supabase

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept,Prefer,Authorization');
    return res.status(200).end();
  }

  try {
    // Reconstruct the path after /api/supabase
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
    const targetUrl = `https://lcajcnprlvbnqelamqnj.supabase.co/${subPath}${qs ? '?' + qs : ''}`;

    // Use the service role key from environment variables
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseKey) {
      return res.status(500).json({ error: 'SUPABASE_SERVICE_KEY not configured in environment' });
    }

    // Build headers
    const headers = {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': req.headers['content-type'] || 'application/json',
    };

    // Forward relevant headers
    if (req.headers['accept']) headers['Accept'] = req.headers['accept'];
    if (req.headers['prefer']) headers['Prefer'] = req.headers['prefer'];

    const fetchOptions = {
      method: req.method,
      headers,
    };

    // Forward body for non-GET requests
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);
    const responseText = await response.text();

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Forward content type
    const contentType = response.headers.get('content-type');
    if (contentType) res.setHeader('Content-Type', contentType);

    res.status(response.status).send(responseText);
  } catch (error) {
    console.error('Supabase proxy error:', error);
    res.status(500).json({ error: 'Proxy error', details: error.message });
  }
}
