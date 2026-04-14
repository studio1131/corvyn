const PROJECT_ID = 'vr3qc54u';
const DATASET = 'production';
const API_BASE = `https://${PROJECT_ID}.api.sanity.io/v2023-10-01/data/query/${DATASET}`;

/**
 * Build a Sanity CDN image URL from an asset _ref string.
 * Ref format: "image-{id}-{width}x{height}-{ext}"
 */
function sanityImageUrl(ref, width) {
  if (!ref || typeof ref !== 'string') return null;
  // ref = "image-abc123def-1920x1080-jpg"
  const match = ref.match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/);
  if (!match) return null;
  const [, id, dims, ext] = match;
  const base = `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}-${dims}.${ext}`;
  return width ? `${base}?w=${width}&auto=format` : base;
}

const ARTICLES_QUERY = encodeURIComponent(`
  *[_type == "article"] | order(number asc) {
    _id,
    number,
    category,
    filterTag,
    title,
    excerpt,
    publishedDate,
    readingTime,
    body,
    "coverImageRef": coverImage.asset._ref
  }
`.trim());

const SETTINGS_QUERY = encodeURIComponent(`
  *[_type == "siteSettings"][0] {
    "heroImageRef": heroImage.asset._ref,
    "servicesImageRef": servicesImage.asset._ref,
    services[] {
      name,
      description
    }
  }
`.trim());

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=0, must-revalidate');

  const token = process.env.SANITY_API_TOKEN;
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const [articlesRes, settingsRes] = await Promise.all([
      fetch(`${API_BASE}?query=${ARTICLES_QUERY}`, { headers }),
      fetch(`${API_BASE}?query=${SETTINGS_QUERY}`, { headers })
    ]);

    if (!articlesRes.ok || !settingsRes.ok) {
      throw new Error(`Sanity API error: ${articlesRes.status} / ${settingsRes.status}`);
    }

    const { result: rawArticles = [] } = await articlesRes.json();
    const { result: rawSettings } = await settingsRes.json();
    const settings = rawSettings || {};

    // Compute cover image URLs server-side and strip the raw ref
    const articles = rawArticles.map(({ coverImageRef, ...a }) => ({
      ...a,
      coverImageUrl: sanityImageUrl(coverImageRef, 1200)
    }));

    res.status(200).json({
      articles,
      settings: {
        heroImageUrl: sanityImageUrl(settings.heroImageRef, 2400),
        servicesImageUrl: sanityImageUrl(settings.servicesImageRef, 1600),
        services: settings.services || []
      }
    });
  } catch (err) {
    // Return empty payload — site falls back to hardcoded content
    res.status(200).json({
      articles: [],
      settings: { heroImageUrl: null, servicesImageUrl: null, services: [] },
      _error: String(err.message)
    });
  }
}
