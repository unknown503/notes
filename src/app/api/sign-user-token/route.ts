import { signToken } from '@/lib/auth';
import { adminAuth } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token)
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });

    const decodedToken = await adminAuth.verifyIdToken(token);

    if (decodedToken) {
      const token = await signToken({ user: 'authorized' });
      const res = NextResponse.json({ success: true });

      res.cookies.set({
        name: 'session',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
      });
      return res
    } else {
      return NextResponse.json({ success: false }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
}
