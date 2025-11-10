import { type NextRequest, NextResponse } from 'next/server';
import { getFirebaseServerAdmin } from '@/lib/firebase';
import { cookies } from 'next/headers';

// NOTE: This is a placeholder implementation.
// The real Firebase Admin SDK is not available in the middleware edge environment.
async function verifySessionCookie(sessionCookie: string) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionCookie }),
      }
    );
    if (response.ok) {
      const data = await response.json();
      return {
        // This is a mock decoded token.
        // In a real scenario you might get more user info.
        uid: data.users[0].localId,
        email: data.users[0].email,
      }
    }
    return null;
  } catch (error) {
    console.error("Error verifying session cookie with REST API", error);
    // In a real app, you might want to call getFirebaseServerAdmin() here
    // as a fallback if not in an edge environment.
    return null;
  }
}


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/dashboard', '/exams', '/performance', '/profile'];
  const authRoutes = ['/auth/login', '/auth/signup'];
  const publicRoutes = ['/'];

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  const sessionCookie = cookies().get('__session')?.value;

  let user = null;
  if (sessionCookie) {
    try {
      // The admin SDK cannot be used in the edge runtime.
      // We will use a placeholder or a different verification method.
      // For this case, we simulate a verification.
       user = await verifySessionCookie(sessionCookie);
    } catch (error) {
      console.error('Error verifying session cookie:', error);
      // Invalid cookie, treat as logged out
    }
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
