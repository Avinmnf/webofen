import type { NextApiRequest, NextApiResponse } from 'next';
import { generateApiKey } from '@/lib/apiKey';

const SHARED_SECRET = 'this-is-a-very-random-secret'; // 🔐 do not use env here on frontend
const apiUrl = process.env.NEXT_PUBLIC_API_URL!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!req.query.slug) {
        return res.status(400).json({ error: 'Missing slug parameter' });
    }

    const slug = Array.isArray(req.query.slug) ? req.query.slug.join('/') : req.query.slug!; // `!` asserts it's not undefined

    const { slug: _removed, ...restQuery } = req.query;

    const queryParams = new URLSearchParams();
    Object.entries(restQuery).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach((v) => queryParams.append(key, v));
        } else if (value !== undefined) {
            queryParams.append(key, value);
        }
    });


    const queryString = queryParams.toString();
    const targetUrl = `${apiUrl}/${slug}${queryString ? '?' + queryString : ''}`;

    try {
        const proxyRes = await fetch(targetUrl, {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': generateApiKey(SHARED_SECRET),
            },
            body: ['POST', 'PUT', 'PATCH'].includes(req.method || '')
                ? JSON.stringify(req.body)
                : undefined,
        });

        const data = await proxyRes.json();
        res.status(proxyRes.status).json(data);
    } catch (err) {
        console.error('Proxy error:', err);
        res.status(500).json({ error: 'Proxy failed' });
    }
}
