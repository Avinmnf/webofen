import type { NextApiRequest, NextApiResponse } from 'next';
import { generateApiKey } from '@/lib/apiKey';

const SHARED_SECRET = 'this-is-a-very-random-secret';
const apiUrl = process.env.NEXT_PUBLIC_CMS_API!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.query.slug) {
    return res.status(400).json({ error: 'Missing slug parameter' });
  }

  const slug = Array.isArray(req.query.slug) ? req.query.slug.join('/') : req.query.slug!;
  const { slug: _removed, ...restQuery } = req.query;

  const queryParams = new URLSearchParams();
  Object.entries(restQuery).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => queryParams.append(key, v));
    } else if (value !== undefined) {
      queryParams.append(key, value as string);
    }
  });

  const queryString = queryParams.toString();
  const targetUrl = `${apiUrl}/${slug}${queryString ? '?' + queryString : ''}`;

  try {
    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === "string") headers[key] = value;
      else if (Array.isArray(value)) headers[key] = value.join(", ");
    }

    headers["x-api-key"] = generateApiKey(SHARED_SECRET);

    const fetchOptions: RequestInit = {
      method: req.method,
      headers,
    };

    // Only include body if necessary
    if (['POST', 'PUT', 'PATCH'].includes(req.method || '') && Object.keys(req.body || {}).length > 0) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const proxyRes = await fetch(targetUrl, fetchOptions);

    // Forward Set-Cookie **except for logout**
    if (slug !== "auth/logout") {
      const setCookie = proxyRes.headers.get('set-cookie');
      if (setCookie) {
        res.setHeader('Set-Cookie', setCookie);
      }
    }

    const data = await proxyRes.json();
    res.status(proxyRes.status).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy failed' });
  }
}
