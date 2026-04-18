const PROJECT_ID = 'vr3qc54u';
const DATASET = 'production';
const API_BASE = `https://${PROJECT_ID}.api.sanity.io/v2023-10-01/data/query/${DATASET}`;

const QUERY = encodeURIComponent(
  '*[_type == "siteSettings"][0]{"ref": faviconImage.asset._ref}'
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET');
    res.end();
    return;
  }

  const token = process.env.SANITY_API_TOKEN;
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const r = await fetch(`${API_BASE}?query=${QUERY}`, { headers });
    const { result } = await r.json();

    if (result && result.ref) {
      const match = result.ref.match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/);
      if (match) {
        const [, id, dims, ext] = match;
        const url = `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}-${dims}.${ext}?w=512&auto=format`;
        // Cache 1 hour on Vercel edge so Sanity is not called on every request
        res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
        res.setHeader('Location', url);
        res.statusCode = 302;
        res.end();
        return;
      }
    }
  } catch (_) {
    // fall through
  }

  // No favicon configured yet
  res.statusCode = 404;
  res.end();
}
