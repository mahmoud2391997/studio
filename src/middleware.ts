import { type NextRequest, NextResponse } from 'next/server';
import { getFirebaseServerAdmin } from '@/lib/firebase';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/dashboard', '/exams', '/performance', '/profile'];
  const authRoutes = ['/auth/login', '/auth/signup'];
  const publicRoutes = ['/'];

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  const sessionCookie = cookies().get('__session')?.value;

  let decodedToken = null;
  if (sessionCookie) {
    try {
      const admin = await getFirebaseServerAdmin();
      decodedToken = await admin.auth().verifySessionCookie(sessionCookie, true);
    } catch (error) {
      console.error('Error verifying session cookie:', error);
      // Invalid cookie, treat as logged out
    }
  }

  if (isProtectedRoute && !decodedToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('redirect_to', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && decodedToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
