import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

const protectedRoutes = ['/notes', '/notepad']

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('session')?.value;
  if (req.nextUrl.pathname === "/" && token)
    return NextResponse.redirect(new URL('/notes', req.url));

  const valid = token && await verifyToken(token);

  if (!valid && protectedRoutes.includes(req.nextUrl.pathname))
    return NextResponse.redirect(new URL('/', req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};