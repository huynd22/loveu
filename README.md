# Shortlink

Dán link vào → nhận link mới dạng `/huy-1`, `/huy-2`, ... → truy cập sẽ redirect **302** tới link gốc.

## Chạy local

```bash
npm start
```

Mở http://localhost:3000 — dữ liệu lưu ở `links.json`.

## Deploy lên Vercel

1. Import repo trên https://vercel.com/new → Deploy.
2. Project → **Storage** → **Create Database** → **Upstash for Redis** (free) → **Connect** vào project.
3. **Deployments** → Redeploy.

Biến tuỳ chọn: `LINK_PREFIX` (mặc định `huy-`), `BASE_URL` (nếu dùng domain riêng).

## API

- `POST /api/shorten` body `{"url": "https://..."}` → `{ "code": "huy-1", "short": "https://.../huy-1" }`
- `GET /:code` → `302 Location: <link gốc>`
