const { get } = require('../lib/store');

// Redirect 302: /<code> -> link gốc
module.exports = async (req, res) => {
  const code = new URL(req.url, 'http://x').searchParams.get('code') || '';
  const url = /^[A-Za-z0-9]{1,32}$/.test(code) ? await get(code) : null;
  if (url) {
    res.writeHead(302, { Location: url, 'Cache-Control': 'no-store' });
    return res.end();
  }
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Không tìm thấy link');
};
