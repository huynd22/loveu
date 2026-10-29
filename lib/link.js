// Không lưu gì cả: link gốc được mã hoá base64url ngay trong link mới.
const encode = url => Buffer.from(url).toString('base64url');
const decode = code => Buffer.from(code, 'base64url').toString();

function normalizeUrl(input) {
  let url = String(input || '').trim();
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:' ? url : null;
  } catch { return null; }
}

module.exports = { encode, decode, normalizeUrl };
