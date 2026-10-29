const { setNew, genCode } = require('../lib/store');

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

function isValidUrl(s) {
  try {
    const u = new URL(s);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch { return false; }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Chỉ hỗ trợ POST' });

  let url;
  try { url = String((await readBody(req)).url || '').trim(); } catch { url = ''; }
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  if (!isValidUrl(url)) return sendJson(res, 400, { error: 'Link không hợp lệ' });

  try {
    let code;
    do { code = genCode(); } while (!(await setNew(code, url)));
    const proto = req.headers['x-forwarded-proto'] || 'http';
    const base = process.env.BASE_URL || `${proto}://${req.headers.host}`;
    sendJson(res, 200, { code, url, short: `${base}/${code}` });
  } catch (e) {
    sendJson(res, 500, { error: 'Lỗi lưu link: ' + e.message });
  }
};
