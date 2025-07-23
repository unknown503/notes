import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/firebase-admin';
import { signToken } from '@/lib/auth';

const COLLECTION = "secure"
const DOC = "passkey"

export async function PUT(req: Request) {
  try {
    const { passkey } = await req.json();
    if (!passkey)
      return NextResponse.json({ success: false, error: 'Missing passkey' }, { status: 400 });

    const hash = await bcrypt.hash(passkey, 10);
    await db.collection(COLLECTION).doc(DOC).set({ hash });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Issue changing passkey' }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const { passkey } = await req.json();
    if (!passkey)
      return NextResponse.json({ success: false, error: 'Missing passkey' }, { status: 400 });

    const doc = await db.collection(COLLECTION).doc(DOC).get();
    if (!doc.exists)
      return NextResponse.json({ success: false, error: 'No stored passkey' }, { status: 404 });

    const { hash } = doc.data() as { hash: string };
    const match = await bcrypt.compare(passkey, hash);

    if (match) {
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
      return NextResponse.json({ error: "Wrong passkey", success: false }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 });
  }
}
