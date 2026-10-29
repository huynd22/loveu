// Vercel Middleware: chạy trước mọi request, đọc thẳng URL gốc nên không phụ thuộc rewrite.
// /huy-<base64url của link gốc>  ->  302 tới link gốc
export const config = { matcher: '/huy-:path*' };

export default function middleware(request) {
  const code = new URL(request.url).pathname.slice(1);
  if (!code.startsWith('huy-')) return;

  let url = '';
  try {
    const b64 = code.slice(4).replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    url = new TextDecoder().decode(bytes);
  } catch {}

  if (!/^https?:\/\//i.test(url)) {
    return new Response('Link không hợp lệ', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
  return Response.redirect(url, 302);
}
