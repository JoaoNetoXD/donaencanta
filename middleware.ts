/**
 * Vercel Edge Middleware — proxy do checkout externo.
 *
 * O checkout (serverflow.dad / Shark Bot) manda X-Frame-Options: SAMEORIGIN,
 * que impede carregá-lo em iframe de outro domínio. Aqui servimos esses
 * caminhos pelo NOSSO domínio (mesma origem) e removemos os headers que
 * bloqueiam o iframe — assim a cliente paga sem sair do site.
 *
 * IMPORTANTE: enviamos ao checkout apenas uma lista limpa de headers.
 * A Vercel injeta x-forwarded-host/x-vercel-* e o roteador multi-tenant
 * do checkout resolve o site pelo host — com esses headers ele responde
 * {"success":false,"error":"Not Found"}. (Verificado por teste direto.)
 *
 * Equivalente em produção ao proxy do vite.config.ts (dev) e server.prod.js (Node).
 */
const CHECKOUT_ORIGIN = "https://serverflow.dad";

// Headers do cliente repassados ao checkout (allowlist — nada de x-forwarded-*)
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

// Cabeçalhos de resposta que impediriam o iframe — removidos na volta.
const STRIP_RESPONSE_HEADERS = [
  "x-frame-options",
  "content-security-policy",
  "cross-origin-opener-policy",
];

export const config = {
  // Só os caminhos que pertencem ao checkout. O site (/, /assets, /fotos)
  // não é interceptado.
  matcher: ["/c/:path*", "/_next/:path*", "/pwa/:path*", "/api/:path*", "/manifest.json"],
};

export default async function middleware(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const target = CHECKOUT_ORIGIN + url.pathname + url.search;

  const fwd = new Headers();
  for (const h of KEEP_REQUEST_HEADERS) {
    const v = req.headers.get(h);
    if (v) fwd.set(h, v);
  }
  // Origin/referer coerentes com o host do checkout (APIs Next validam origem)
  fwd.set("origin", CHECKOUT_ORIGIN);
  fwd.set("referer", CHECKOUT_ORIGIN + url.pathname);

  const method = req.method.toUpperCase();
  const body = method === "GET" || method === "HEAD" ? undefined : await req.arrayBuffer();

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method,
      headers: fwd,
      body,
      redirect: "manual",
    });
  } catch {
    return new Response("Checkout temporariamente indisponível. Tente novamente.", {
      status: 502,
    });
  }

  const headers = new Headers(upstream.headers);
  for (const h of STRIP_RESPONSE_HEADERS) headers.delete(h);

  // Redirects absolutos para o checkout voltam relativos ao nosso domínio,
  // para a navegação continuar dentro do iframe/site.
  const loc = headers.get("location");
  if (loc && loc.startsWith(CHECKOUT_ORIGIN)) {
    headers.set("location", loc.slice(CHECKOUT_ORIGIN.length) || "/");
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
