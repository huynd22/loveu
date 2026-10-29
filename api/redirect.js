const { decode, normalizeUrl } = require('../lib/link');

// Lấy mã huy-... từ mọi chỗ Vercel có thể để nó: đường dẫn, ?code=, header của rewrite
function getCode(req) {
  const { pathname, searchParams } = new URL(req.url, 'http://x');
  const routeMatches = new URLSearchParams(String(req.headers['x-now-route-matches'] || ''));
  const candidates = [
    decodeURIComponent(pathname.split('/').pop() || ''),
    req.query && req.query.code,
    searchParams.get('code'),
    routeMatches.get('code'),
  ];
  return String(candidates.find(c => c && String(c).startsWith('huy-')) || '');
}

// Redirect 302: /huy-... -> link gốc (giải mã từ code)
module.exports = (req, res) => {
  const code = getCode(req);
  const decoded = /^[A-Za-z0-9_-]+$/.test(code) ? decode(code) : '';
  const url = /^https?:\/\//i.test(decoded) ? normalizeUrl(decoded) : null;
  if (url) {
    res.writeHead(302, { Location: url });
    return res.end();
  }
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Link không hợp lệ\n\n[debug] url=' + req.url + ' query=' + JSON.stringify(req.query || {}) +
    ' route=' + (req.headers['x-now-route-matches'] || ''));
};
