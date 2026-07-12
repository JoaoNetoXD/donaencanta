/**
 * Vercel Edge Middleware — proxy do checkout externo (serverflow.dad / Shark Bot).
 *
 * Três bloqueios resolvidos aqui:
 *
 * 1) X-Frame-Options: SAMEORIGIN — impede o iframe. Removido na volta.
 *
 * 2) A Vercel RESERVA qualquer caminho que contenha "_next" e devolve 403 antes
 *    do middleware. O checkout é Next.js e carrega chunks de /_next/static/... →
 *    403. Solução: reescrevemos "/_next/" → "/cx/" no HTML e nos JS (o prefixo
 *    /cx não contém "_next", então a Vercel deixa passar e o middleware o
 *    intercepta). O publicPath do webpack também é reescrito, cobrindo os chunks
 *    carregados dinamicamente. /cx/... é proxiado de volta para /_next/... na origem.
 *
 * 3) A Vercel injeta x-forwarded-host/x-vercel-*; o roteador multi-tenant do
 *    checkout responde "Not Found" com esses headers. Enviamos só uma allowlist.
 *
 * Em dev, o proxy é o do vite.config.ts (não precisa do rename /cx).
 */
const ORIGIN = "https://serverflow.dad";
const PREFIX = "/cx"; // prefixo proxiável que substitui /_next (sem conter "_next")
const NEXT = "/_next/";
const NEXT_ALIAS = PREFIX + "/"; // "/cx/"

const KEEP_REQUEST_HEADERS = [
  "accept",
  "accept-language",
  "content-type",
  "cookie",
  "user-agent",
  "cache-control",
  "pragma",
  "x-requested-with",
];

const STRIP_RESPONSE_HEADERS = [
  "x-frame-options",
  "content-security-policy",
  "cross-origin-opener-policy",
];

export const config = {
  matcher: ["/c/:path*", "/cx/:path*", "/api/:path*", "/pwa/:path*", "/manifest.json"],
};

/** Content-types cujo corpo reescrevemos ("/_next/" ↔ "/cx/"). */
function isRewritable(ct: string): boolean {
  return /text\/html|javascript|text\/css|application\/json/i.test(ct);
}

export default async function middleware(req: Request): Promise<Response> {
  const url = new URL(req.url);

  // Caminho real na origem: /cx/... → /_next/... ; o resto segue igual.
  let path = url.pathname;
  if (path === PREFIX || path === PREFIX + "/") path = NEXT;
  else if (path.startsWith(PREFIX + "/")) path = NEXT + path.slice(PREFIX.length + 1);

  const target = ORIGIN + path + url.search;

  const fwd = new Headers();
  for (const h of KEEP_REQUEST_HEADERS) {
    const v = req.headers.get(h);
    if (v) fwd.set(h, v);
  }
  fwd.set("origin", ORIGIN);
  fwd.set("referer", ORIGIN + path);

  const method = req.method.toUpperCase();
  const body = method === "GET" || method === "HEAD" ? undefined : await req.arrayBuffer();

  let upstream: Response;
  try {
    upstream = await fetch(target, { method, headers: fwd, body, redirect: "manual" });
  } catch {
    return new Response("Checkout temporariamente indisponível. Tente novamente.", { status: 502 });
  }

  const headers = new Headers(upstream.headers);
  for (const h of STRIP_RESPONSE_HEADERS) headers.delete(h);

  // Redirects absolutos para a origem viram relativos ao nosso domínio.
  const loc = headers.get("location");
  if (loc && loc.startsWith(ORIGIN)) headers.set("location", loc.slice(ORIGIN.length) || "/");

  const ct = headers.get("content-type") || "";
  if (isRewritable(ct)) {
    // Reescreve /_next/ → /cx/ (split/join = sem re-scan do texto inserido).
    let text = await upstream.text();
    text = text.split(NEXT).join(NEXT_ALIAS);
    headers.delete("content-length");
    headers.delete("content-encoding");
    return new Response(text, { status: upstream.status, statusText: upstream.statusText, headers });
  }

  // Fontes, imagens, etc.: passa direto.
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
