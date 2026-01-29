import { NextResponse, NextRequest } from 'next/server';

import { composedMiddleware } from '@/middleware/main';

export function proxy(req: NextRequest) {
  const result = composedMiddleware(req);
  return result ?? NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/login', '/admin/:path*'],
};
