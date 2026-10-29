const { decode, normalizeUrl } = require('../lib/link');

// Redirect 302: /<code> -> link gốc (giải mã từ code)
module.exports = (req, res) => {
  const code = new URL(req.url, 'http://x').searchParams.get('code') || '';
  const url = /^[A-Za-z0-9_-]+$/.test(code) && /^https?:\/\//i.test(decode(code)) ? normalizeUrl(decode(code)) : null;
  if (url) {
    res.writeHead(302, { Location: url });
    return res.end();
  }
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Link không hợp lệ');
};
