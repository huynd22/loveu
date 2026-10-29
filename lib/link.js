// Không lưu gì cả: link gốc được mã hoá base64url ngay trong link mới.
const PREFIX = 'huy-';
const encode = url => PREFIX + Buffer.from(url).toString('base64url');
const decode = code => code.startsWith(PREFIX) ? Buffer.from(code.slice(PREFIX.length), 'base64url').toString() : '';

function normalizeUrl(input) {
  let url = String(input || '').trim();
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:' ? url : null;
  } catch { return null; }
}

module.exports = { encode, decode, normalizeUrl };
