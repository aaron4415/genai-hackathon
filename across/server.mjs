import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { generateCv, translateProfile } from './career-ai.mjs';
const root = fileURLToPath(new URL('./dist/', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };
function sendJson(res, status, data) { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(data)); }
async function readJson(req) {
  if (!req.headers['content-type']?.startsWith('application/json')) throw Object.assign(new Error('Send JSON data.'), { status: 415 });
  const chunks = []; let bytes = 0;
  for await (const chunk of req) {
    bytes += chunk.length;
    if (bytes > 150000) throw Object.assign(new Error('This request is too large. Use fewer facts.'), { status: 413 });
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { throw new Error('Invalid JSON.'); }
}
export function createAppServer({ env = process.env, fetchImpl = fetch } = {}) {
  let active = 0;
  const rate = new Map();
  return http.createServer(async (req, res) => {
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    try {
      const url = new URL(req.url, 'http://localhost');
      if (url.pathname.startsWith('/api/')) {
        const origins = new Set([`http://127.0.0.1:${req.socket.localPort}`, `http://localhost:${req.socket.localPort}`, ...(env.APP_ORIGIN ? [env.APP_ORIGIN] : [])]);
        const hosts = [...origins].map(origin => new URL(origin).host);
        if (!hosts.includes(req.headers.host) || (req.headers.origin && !origins.has(req.headers.origin))) return sendJson(res, 403, { error: 'Use this app from its configured origin.' });
        if (url.pathname === '/api/ai/status' && req.method === 'GET') return sendJson(res, 200, { configured: !!env.OPENAI_API_KEY, provider: 'OpenAI' });
        if (!['/api/cv/generate', '/api/profile/translate'].includes(url.pathname)) return sendJson(res, 404, { error: 'Unknown endpoint.' });
        if (req.method !== 'POST') return sendJson(res, 405, { error: 'Use POST.' });
        const input = await readJson(req);
        if (input?.consent !== true) return sendJson(res, 400, { error: 'Approve sending the selected text to OpenAI first.' });
        const now = Date.now();
        for (const [key, value] of rate) if (now > value.until) rate.delete(key);
        const address = req.socket.remoteAddress;
        const count = rate.get(address) || { count: 0, until: now + 60000 };
        if (count.count >= 10 || active >= 2) return sendJson(res, 429, { error: 'Please wait a moment before requesting another draft.' });
        count.count++; rate.set(address, count); active++;
        try {
          const output = url.pathname === '/api/cv/generate' ? await generateCv(input, { env, fetchImpl }) : await translateProfile(input, { env, fetchImpl });
          return sendJson(res, 200, output);
        } finally { active--; }
      }
      if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); return res.end(); }
      const target = path.resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
      if (!target.startsWith(path.resolve(root) + path.sep)) { res.writeHead(403); return res.end(); }
      const data = await readFile(target);
      res.writeHead(200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
      res.end(req.method === 'HEAD' ? undefined : data);
    } catch (error) {
      if (res.headersSent || res.destroyed) return;
      if (req.url.startsWith('/api/')) return sendJson(res, error.status || (error.name === 'TimeoutError' ? 504 : 400), { error: error.name === 'TimeoutError' ? 'The AI request timed out. Please retry.' : error.message });
      res.writeHead(404); res.end('Not found');
    }
  });
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (typeof process.loadEnvFile === 'function') {
    try { process.loadEnvFile(fileURLToPath(new URL('./.env', import.meta.url))); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  const port = Number(process.env.PORT || 4173);
  createAppServer().listen(port, '127.0.0.1', () => console.log(`Across preview: http://127.0.0.1:${port}`));
}
