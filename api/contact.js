const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const store = globalThis.__corvynRateLimit || (globalThis.__corvynRateLimit = new Map());

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

function getIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length) return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

function rateLimit(ip) {
  const now = Date.now();
  const record = store.get(ip) || { count: 0, resetAt: now + WINDOW_MS };
  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + WINDOW_MS;
  }
  record.count += 1;
  store.set(ip, record);
  return record.count <= MAX_PER_WINDOW;
}

function sanitize(value, max = 2000) {
  return String(value || '').replace(/[<>]/g, '').trim().slice(0, max);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'method_not_allowed' });

  const ip = getIp(req);
  if (!rateLimit(ip)) return json(res, 429, { error: 'too_many_requests' });

  const origin = req.headers.origin || '';
  if (origin && !/^https:\/\/(www\.)?corvyn\.studio$/i.test(origin) && !/^http:\/\/localhost(:\d+)?$/i.test(origin)) {
    return json(res, 403, { error: 'origin_not_allowed' });
  }

  const { name, email, company, message, website, formStartedAt } = req.body || {};
  if (website) return json(res, 400, { error: 'spam_detected' });
  if (!formStartedAt || Date.now() - Number(formStartedAt) < 1200) return json(res, 400, { error: 'form_submitted_too_fast' });

  const clean = {
    name: sanitize(name, 120),
    email: sanitize(email, 180),
    company: sanitize(company, 180),
    message: sanitize(message, 5000),
    submittedAt: new Date().toISOString(),
    ipHashHint: Buffer.from(ip).toString('base64').slice(0, 24),
  };

  if (!clean.name || !clean.email || !clean.message) return json(res, 400, { error: 'missing_fields' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)) return json(res, 400, { error: 'invalid_email' });

  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;
  const token = process.env.SANITY_API_TOKEN;

  if (!projectId || !dataset || !token) {
    return json(res, 200, { ok: true, mode: 'local_or_unconfigured_backend' });
  }

  const sanityRes = await fetch(`https://${projectId}.api.sanity.io/v2023-10-01/data/mutate/${dataset}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      mutations: [
        {
          create: {
            _type: 'contactSubmission',
            ...clean
          }
        }
      ]
    })
  });

  if (!sanityRes.ok) {
    const text = await sanityRes.text();
    return json(res, 502, { error: 'sanity_write_failed', detail: text.slice(0, 400) });
  }

  return json(res, 200, { ok: true });
}
