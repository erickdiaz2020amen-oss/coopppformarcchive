// Vercel Serverless Function - Supabase Proxy
// All /api/supabase/* requests are rewritten to this function via vercel.json

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept,Prefer,Authorization');
    return res.status(200).end();
  }

  try {
    // The original sub-path is passed via rewrite query param
    const proxyPath = req.query.__path || '';

    // Rebuild the original query string (excluding our internal __path param)
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
    const targetUrl = `https://lcajcnprlvbnqelamqnj.supabase.co/${proxyPath}${qs ? '?' + qs : ''}`;

    // Use the service role key from environment variables
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseKey) {
      return res.status(500).json({ error: 'SUPABASE_SERVICE_KEY not configured' });
    }

    // Build headers
    const headers = {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': req.headers['content-type'] || 'application/json',
    };
    if (req.headers['accept']) headers['Accept'] = req.headers['accept'];
    if (req.headers['prefer']) headers['Prefer'] = req.headers['prefer'];

    const fetchOptions = { method: req.method, headers };

    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);
    const responseText = await response.text();

    res.setHeader('Access-Control-Allow-Origin', '*');
    const ct = response.headers.get('content-type');
    if (ct) res.setHeader('Content-Type', ct);

    res.status(response.status).send(responseText);
  } catch (error) {
    console.error('Supabase proxy error:', error);
    res.status(500).json({ error: 'Proxy error', details: error.message });
  }
}
