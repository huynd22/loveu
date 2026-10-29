# Shortlink

Dán link vào → nhận link mới, truy cập link mới sẽ redirect **302** tới link gốc.

Không cần database: link gốc được mã hoá (base64url) ngay trong link mới.

## Chạy local

```bash
npm start
```

Mở http://localhost:3000

## Deploy lên Vercel

Import repo trên https://vercel.com/new → Deploy. Không cần cấu hình gì thêm.

Tuỳ chọn: biến `BASE_URL` (vd `https://s.example.com`) nếu dùng domain riêng.

## API

- `POST /api/shorten` body `{"url": "https://..."}` → `{ "short": "https://.../aHR0cHM6..." }`
- `GET /:code` → `302 Location: <link gốc>`
