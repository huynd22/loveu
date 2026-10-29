// Chạy local: node server.js (trên Vercel không dùng file này)
const http = require('http');
const fs = require('fs');
const path = require('path');
const shorten = require('./api/shorten');
const redirect = require('./api/redirect');

const PORT = process.env.PORT || 3000;
const INDEX_HTML = fs.readFileSync(path.join(__dirname, 'public', 'index.html'));

http.createServer((req, res) => {
  const { pathname } = new URL(req.url, 'http://x');
  if (req.method === 'GET' && pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(INDEX_HTML);
  }
  if (pathname === '/api/shorten') return shorten(req, res);
  req.url = '/api/redirect?code=' + encodeURIComponent(pathname.slice(1));
  redirect(req, res);
}).listen(PORT, () => console.log(`Shortlink chạy tại http://localhost:${PORT}`));
