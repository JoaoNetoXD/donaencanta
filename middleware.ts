/**
 * Vercel Edge Middleware — proxy MÍNIMO do checkout (serverflow.dad / Shark Bot).
 *
 * Descoberta-chave: X-Frame-Options SÓ bloqueia o DOCUMENTO carregado no iframe,
 * não os sub-recursos (JS/CSS/imagens) que esse documento pede depois. E o
 * Cloudflare da origem responde 403 ("Attention Required") para fetches de
 * estáticos vindos do datacenter da Vercel — mas 200 para navegadores reais.
 *
 * Então:
 *  - Proxiamos SÓ o documento /c/* (para remover o X-Frame-Options) e, no HTML,
 *    reescrevemos as URLs de assets para ABSOLUTAS na origem. Assim o navegador
 *    da cliente baixa os chunks direto do Cloudflare (200), sem passar pela
 *    Vercel (que seria bloqueada).
 *  - Proxiamos /api/* (a chamada que gera o Pix): é same-origin no iframe e
 *    precisa de headers limpos (a Vercel injeta x-forwarded-host, que faz o
 *    roteador multi-tenant responder "Not Found").
 *
 * Em dev, o proxy é o do vite.config.ts.
 */
const ORIGIN = "https://serverflow.dad";

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
  matcher: ["/c/:path*", "/api/:path*"],
};

export default async function middleware(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const target = ORIGIN + url.pathname + url.search;

  const fwd = new Headers();
  for (const h of KEEP_REQUEST_HEADERS) {
    const v = req.headers.get(h);
    if (v) fwd.set(h, v);
  }
  fwd.set("origin", ORIGIN);
  fwd.set("referer", ORIGIN + url.pathname);

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

  const loc = headers.get("location");
  if (loc && loc.startsWith(ORIGIN)) headers.set("location", loc.slice(ORIGIN.length) || "/");

  const ct = headers.get("content-type") || "";

  // Só o documento HTML é reescrito: assets relativos → absolutos na origem,
  // para o navegador baixá-los direto do Cloudflare (a Vercel seria bloqueada).
  if (/text\/html/i.test(ct)) {
    let html = await upstream.text();
    html = html
      .split('"/_next/').join('"' + ORIGIN + "/_next/")
      .split('"/pwa/').join('"' + ORIGIN + "/pwa/")
      .split('href="/manifest.json"').join('href="' + ORIGIN + '/manifest.json"');
    headers.delete("content-length");
    headers.delete("content-encoding");
    return new Response(html, { status: upstream.status, statusText: upstream.statusText, headers });
  }

  // /api e demais: repassa (com headers de resposta limpos).
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
