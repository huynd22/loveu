const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Trên Vercel: dùng Upstash Redis (REST). Chạy local: dùng file links.json.
const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const DB_FILE = path.join(__dirname, '..', 'links.json');

async function redis(cmd) {
  const r = await fetch(REDIS_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd),
  });
  if (!r.ok) throw new Error(`Redis lỗi ${r.status}`);
  return (await r.json()).result;
}

function readFile() {
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } catch { return {}; }
}

async function get(code) {
  if (REDIS_URL) return redis(['GET', `link:${code}`]);
  return readFile()[code] || null;
}

// Trả về true nếu lưu được (code chưa tồn tại)
async function setNew(code, url) {
  if (REDIS_URL) return (await redis(['SET', `link:${code}`, url, 'NX'])) === 'OK';
  const links = readFile();
  if (links[code]) return false;
  links[code] = url;
  fs.writeFileSync(DB_FILE, JSON.stringify(links, null, 2));
  return true;
}

function genCode(len = 6) {
  const chars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from(crypto.randomBytes(len), b => chars[b % chars.length]).join('');
}

module.exports = { get, setNew, genCode };
