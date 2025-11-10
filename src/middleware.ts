import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/dashboard', '/exams', '/performance', '/profile'];
  const authRoutes = ['/auth/login', '/auth/signup'];

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  const sessionCookie = cookies().get('__session')?.value;

  if (isProtectedRoute && !sessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('redirect_to', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
