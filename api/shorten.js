const { create } = require('../lib/store');

function normalizeUrl(input) {
  let url = String(input || '').trim();
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:' ? url : null;
  } catch { return null; }
}

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

async function readBody(req) {
  // Vercel đã parse sẵn req.body; chạy local thì tự đọc stream
  if ('body' in req) return typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  let body = '';
  for await (const c of req) { body += c; if (body.length > 1e5) throw new Error('Body quá lớn'); }
  return JSON.parse(body);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Chỉ hỗ trợ POST' });

  let input;
  try { input = (await readBody(req)).url; } catch { input = ''; }
  const url = normalizeUrl(input);
  if (!url) return sendJson(res, 400, { error: 'Link không hợp lệ' });

  try {
    const code = await create(url);
    const proto = req.headers['x-forwarded-proto'] || 'http';
    const base = process.env.BASE_URL || `${proto}://${req.headers.host}`;
    sendJson(res, 200, { code, url, short: `${base}/${code}` });
  } catch (e) {
    sendJson(res, 500, { error: 'Lỗi lưu link: ' + e.message });
  }
};
