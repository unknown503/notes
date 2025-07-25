import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('session');
  const isAuthenticated = !!token?.value;

  return new Response(JSON.stringify({ authenticated: isAuthenticated }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
