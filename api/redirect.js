const { decode, normalizeUrl } = require('../lib/link');

// Lấy mã từ đường dẫn (/huy-...) hoặc từ ?code= (khi qua rewrite /api/redirect)
function getCode(req) {
  const { pathname, searchParams } = new URL(req.url, 'http://x');
  const fromPath = decodeURIComponent(pathname.split('/').pop() || '');
  if (fromPath.startsWith('huy-')) return fromPath;
  return (req.query && req.query.code) || searchParams.get('code') || fromPath;
}

// Redirect 302: /<code> -> link gốc (giải mã từ code)
module.exports = (req, res) => {
  const code = String(getCode(req));
  const decoded = /^[A-Za-z0-9_-]+$/.test(code) ? decode(code) : '';
  const url = /^https?:\/\//i.test(decoded) ? normalizeUrl(decoded) : null;
  if (url) {
    res.writeHead(302, { Location: url });
    return res.end();
  }
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Link không hợp lệ');
};
