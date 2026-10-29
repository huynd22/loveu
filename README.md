# Shortlink

Dán link vào → nhận link mới, truy cập link mới sẽ redirect **302** tới link gốc.

## Chạy local

```bash
npm start
```

Mở http://localhost:3000 — dữ liệu lưu ở `links.json`.

## Deploy lên Vercel

1. Đẩy code lên GitHub, vào https://vercel.com/new → Import repo → Deploy.
2. Vào project trên Vercel → **Storage** → **Create Database** → chọn **Upstash for Redis** (free) → Connect vào project.
   Vercel tự thêm biến `KV_REST_API_URL`, `KV_REST_API_TOKEN`.
3. **Deployments** → Redeploy.

Hoặc dùng CLI: `npx vercel` rồi `npx vercel --prod`.

Tuỳ chọn: biến `BASE_URL` (vd `https://s.example.com`) nếu dùng domain riêng.

## API

- `POST /api/shorten` body `{"url": "https://..."}` → `{ "short": "https://.../abc123" }`
- `GET /:code` → `302 Location: <link gốc>`
