const { get } = require('../lib/store');

// Redirect 302: /huy-<số> -> link gốc
module.exports = async (req, res) => {
  const code = new URL(req.url, 'http://x').searchParams.get('code') || '';
  let url = null;
  try {
    if (/^[A-Za-z0-9_-]{1,64}$/.test(code)) url = await get(code);
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Lỗi: ' + e.message);
  }
  if (url) {
    res.writeHead(302, { Location: url, 'Cache-Control': 'no-store' });
    return res.end();
  }
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Không tìm thấy link');
};
