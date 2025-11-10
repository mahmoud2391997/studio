import { type NextRequest, NextResponse } from 'next/server';
import { getFirebaseServerAdmin } from './lib/firebase';

async function getIsLoggedIn(request: NextRequest) {
  try {
    const adminApp = await getFirebaseServerAdmin();
    const sessionCookie = request.cookies.get('__session')?.value;
    if (!sessionCookie) {
      return false;
    }
    await adminApp.auth().verifySessionCookie(sessionCookie, true);
    return true;
  } catch (error) {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const isLoggedIn = await getIsLoggedIn(request);
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname.startsWith('/auth');
  const isAppRoute = !isAuthRoute && pathname !== '/';

  if (isLoggedIn) {
    // If logged in, redirect from auth routes to dashboard
    if (isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else {
    // If not logged in, redirect from app routes to login
    if (isAppRoute) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
