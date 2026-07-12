/**
 * Servidor de PRODUÇÃO: npm run build && node server.prod.js
 *
 * Serve o site (dist/) e proxia o checkout externo sob o mesmo
 * domínio, para ele carregar em iframe sem redirecionar o cliente.
 * (O checkout envia X-Frame-Options: SAMEORIGIN — cross-origin é
 * bloqueado pelo navegador; same-origin via proxy passa.)
 */
import express from "express";
import https from "https";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

const CHECKOUT_HOST = "serverflow.dad";
const CHECKOUT_PREFIXES = ["/c", "/_next", "/api", "/pwa", "/favicon.ico", "/manifest.json"];

// Headers de resposta que impediriam o iframe — removidos no caminho de volta
const STRIP_HEADERS = ["x-frame-options", "content-security-policy", "cross-origin-opener-policy"];

const app = express();

app.use((req, res, next) => {
  if (!CHECKOUT_PREFIXES.some((p) => req.path === p || req.path.startsWith(p + "/") || req.path.startsWith(p + "?") || (p.includes(".") && req.path === p))) {
    return next();
  }

  const proxyReq = https.request(
    {
      hostname: CHECKOUT_HOST,
      path: req.originalUrl,
      method: req.method,
      headers: {
        ...req.headers,
        host: CHECKOUT_HOST,
        // Remove headers de hop que atrapalham
        connection: undefined,
      },
    },
    (proxyRes) => {
      const headers = { ...proxyRes.headers };
      for (const h of STRIP_HEADERS) delete headers[h];
      res.writeHead(proxyRes.statusCode || 502, headers);
      proxyRes.pipe(res);
    }
  );

  proxyReq.on("error", () => {
    res.status(502).send("Checkout temporariamente indisponível. Tente novamente.");
  });

  req.pipe(proxyReq);
});

app.use(express.static(path.join(__dirname, "dist")));

// SPA fallback
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Loja no ar: http://localhost:${PORT}`);
});
