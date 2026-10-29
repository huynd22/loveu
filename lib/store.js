const fs = require('fs');
const path = require('path');

// Trên Vercel: dùng Redis (Upstash REST hoặc REDIS_URL). Chạy local: dùng file links.json.
// Tìm biến theo hậu tố vì Vercel có thể thêm tiền tố tuỳ chọn (vd STORAGE_KV_REST_API_URL).
const findEnv = suffixes => {
  const key = Object.keys(process.env).find(k => suffixes.some(s => k === s || k.endsWith('_' + s)));
  return key && process.env[key];
};
const REST_URL = findEnv(['KV_REST_API_URL', 'UPSTASH_REDIS_REST_URL']);
const REST_TOKEN = findEnv(['KV_REST_API_TOKEN', 'UPSTASH_REDIS_REST_TOKEN']);
const TCP_URL = findEnv(['REDIS_URL', 'KV_URL']);
const USE_REDIS = Boolean((REST_URL && REST_TOKEN) || TCP_URL);
const DB_FILE = path.join(__dirname, '..', 'links.json');
const PREFIX = process.env.LINK_PREFIX || 'huy-';

let tcpClient;
async function redis(cmd) {
  if (!(REST_URL && REST_TOKEN)) {
    if (!tcpClient) {
      const { createClient } = require('redis');
      tcpClient = createClient({ url: TCP_URL });
      tcpClient.on('error', () => {});
      await tcpClient.connect();
    }
    return tcpClient.sendCommand(cmd);
  }
  const r = await fetch(REST_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REST_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd),
  });
  if (!r.ok) throw new Error(`Redis lỗi ${r.status}`);
  return (await r.json()).result;
}

function checkConfig() {
  if (!USE_REDIS && process.env.VERCEL) {
    throw new Error('Chưa kết nối Redis. Vào Vercel → Storage → tạo Upstash for Redis → Connect vào project, rồi Redeploy.');
  }
}

function readFile() {
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } catch { return { counter: 0, links: {} }; }
}

async function get(code) {
  checkConfig();
  if (USE_REDIS) return redis(['GET', `link:${code}`]);
  return readFile().links[code] || null;
}

// Tạo link mới với mã huy-1, huy-2, ... và trả về mã đó
async function create(url) {
  checkConfig();
  if (USE_REDIS) {
    const code = PREFIX + (await redis(['INCR', 'counter']));
    await redis(['SET', `link:${code}`, url]);
    return code;
  }
  const db = readFile();
  const code = PREFIX + ++db.counter;
  db.links[code] = url;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  return code;
}

module.exports = { get, create };
