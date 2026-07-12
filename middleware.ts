/**
 * Vercel Edge Middleware — proxy do checkout externo.
 *
 * O checkout (serverflow.dad / Shark Bot) manda X-Frame-Options: SAMEORIGIN,
 * que impede carregá-lo em iframe de outro domínio. Aqui servimos esses
 * caminhos pelo NOSSO domínio (mesma origem) e removemos os headers que
 * bloqueiam o iframe — assim a cliente paga sem sair do site.
 *
 * Equivalente em produção ao proxy do vite.config.ts (dev) e server.prod.js (Node).
 */
const CHECKOUT_ORIGIN = "https://serverflow.dad";

// Cabeçalhos de resposta que impediriam o iframe — removidos na volta.
const STRIP = ["x-frame-options", "content-security-policy", "cross-origin-opener-policy"];

export const config = {
  // Só os caminhos que pertencem ao checkout. O site (/, /assets, /fotos)
  // não é interceptado.
  matcher: ["/c/:path*", "/_next/:path*", "/pwa/:path*", "/api/:path*", "/manifest.json"],
};

export default async function middleware(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const target = CHECKOUT_ORIGIN + url.pathname + url.search;

  // Repassa cabeçalhos do cliente, deixando o fetch definir o Host correto.
  const fwd = new Headers(req.headers);
  fwd.delete("host");

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
  for (const h of STRIP) headers.delete(h);

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
