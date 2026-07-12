/**
 * Vercel Edge Middleware — proxy do checkout externo (serverflow.dad / Shark Bot).
 *
 * Dois problemas resolvidos aqui:
 *
 * 1) X-Frame-Options: SAMEORIGIN — impede o iframe. Removido na volta.
 *
 * 2) A Vercel RESERVA o caminho /_next e devolve 403 antes do middleware/rewrite.
 *    O checkout é Next.js e carrega seus chunks de /_next/static/... → 403.
 *    Solução: no HTML e nos JS, reescrevemos "/_next/" → "/sbx/_next/". O prefixo
 *    /sbx NÃO é reservado, então o middleware o intercepta e proxia para a origem
 *    (removendo o /sbx). Como o publicPath do webpack também é reescrito dentro
 *    do JS, os chunks carregados dinamicamente também apontam para /sbx.
 *
 * 3) A Vercel injeta x-forwarded-host/x-vercel-*; o roteador multi-tenant do
 *    checkout responde "Not Found" com esses headers. Enviamos só uma allowlist.
 *
 * Em dev, o proxy é o do vite.config.ts (não precisa do rename /sbx).
 */
const ORIGIN = "https://serverflow.dad";
const PREFIX = "/sbx";
const RENAME = "/_next/";
const RENAMED = PREFIX + "/_next/";

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
  matcher: ["/c/:path*", "/sbx/:path*", "/api/:path*", "/pwa/:path*", "/manifest.json"],
};

/** Content-types cujo corpo reescrevemos ("/_next/" → "/sbx/_next/"). */
function isRewritable(ct: string): boolean {
  return /text\/html|javascript|text\/css|application\/json/i.test(ct);
}

export default async function middleware(req: Request): Promise<Response> {
  const url = new URL(req.url);

  // Caminho real na origem: tira o prefixo /sbx quando presente.
  let path = url.pathname;
  if (path === PREFIX) path = "/";
  else if (path.startsWith(PREFIX + "/")) path = path.slice(PREFIX.length);

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
    // Reescreve as referências a /_next/ para o prefixo proxiável /sbx/_next/.
    // split/join = sem re-scan do texto inserido (evita prefixo duplicado).
    let text = await upstream.text();
    text = text.split(RENAME).join(RENAMED);
    // O corpo muda de tamanho e pode vir comprimido — remova esses headers.
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
