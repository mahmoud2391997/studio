import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

async function verifySessionCookie(sessionCookie: string) {
  try {
    // The following is a placeholder for a proper session verification.
    // In a real-world scenario, you would make a request to a backend endpoint
    // that can verify the Firebase session cookie using the Admin SDK.
    // Since we cannot use the Admin SDK in the middleware, we assume the cookie is valid if it exists.
    // This is NOT secure for production but sufficient for local development and prototyping.
    if (sessionCookie) {
      // In a more secure setup, you'd get user info from the verified token
      return { uid: 'mock-uid', email: 'mock-email@example.com' };
    }
    return null;
  } catch (error) {
    console.error("Error verifying session cookie:", error);
    return null;
  }
}


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/dashboard', '/exams', '/performance', '/profile'];
  const authRoutes = ['/auth/login', '/auth/signup'];

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  const sessionCookie = cookies().get('__session')?.value;

  let user = null;
  if (sessionCookie) {
    user = await verifySessionCookie(sessionCookie);
  }

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('redirect_to', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
