import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BLOCKED_COUNTRIES = new Set(['PK']);

export function middleware(request: NextRequest) {
  // Vercel always sets this header at the edge based on the visitor's IP.
  const country = request.headers.get('x-vercel-ip-country') || '';
  if (BLOCKED_COUNTRIES.has(country) && !request.nextUrl.pathname.startsWith('/blocked')) {
    const url = request.nextUrl.clone();
    url.pathname = '/blocked';
    url.search = '';
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  // Run on every request except Next.js internals, the blocked page itself,
  // and the few static assets that should always be reachable.
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|favicon\\.svg|robots\\.txt|sitemap\\.xml|blocked).*)',
  ],
};
