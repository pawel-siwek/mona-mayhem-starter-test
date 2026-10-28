import type { APIRoute } from 'astro';

export const prerender = false;

const TTL_MS = 15 * 60 * 1000;
const LOGIN_RE = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
const cache = new Map<string, { body: string; expires: number }>();

const json = (body: string, status = 200, extra: Record<string, string> = {}) =>
	new Response(body, {
		status,
		headers: { 'Content-Type': 'application/json', ...extra },
	});

const error = (message: string, status: number) => json(JSON.stringify({ error: message }), status);

export const GET: APIRoute = async ({ params }) => {
	const username = params.username ?? '';
	if (!LOGIN_RE.test(username)) {
		return error('Nieprawidłowa nazwa użytkownika', 400);
	}

	const key = username.toLowerCase();
	const cacheHeaders = { 'Cache-Control': `public, max-age=${TTL_MS / 1000}` };
	const hit = cache.get(key);
	if (hit && hit.expires > Date.now()) {
		return json(hit.body, 200, cacheHeaders);
	}

	try {
		const res = await fetch(`https://github.com/${username}.contribs`, {
			headers: { Accept: 'application/json' },
			signal: AbortSignal.timeout(8000),
		});
		if (res.status === 404) {
			return error('Nie znaleziono użytkownika', 404);
		}
		if (!res.ok) {
			return error('Błąd pobierania danych z GitHuba', 502);
		}
		const body = await res.text();
		cache.set(key, { body, expires: Date.now() + TTL_MS });
		return json(body, 200, cacheHeaders);
	} catch {
		return error('Błąd pobierania danych z GitHuba', 502);
	}
};
