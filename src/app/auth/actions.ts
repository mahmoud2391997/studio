'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signUpAction(idToken: string) {
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  cookies().set('__session', idToken, {
    maxAge: expiresIn,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
  redirect('/dashboard');
}

export async function logInAction(idToken: string) {
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  cookies().set('__session', idToken, {
    maxAge: expiresIn,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
  redirect('/dashboard');
}

export async function logOutAction() {
  cookies().delete('__session');
  redirect('/auth/login');
}
