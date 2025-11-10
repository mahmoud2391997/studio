'use server';

import { createSessionCookie, clearSessionCookie } from '@/lib/firebase';
import { redirect } from 'next/navigation';

export async function signUpAction(idToken: string) {
  await createSessionCookie(idToken);
  redirect('/dashboard');
}

export async function logInAction(idToken: string) {
  await createSessionCookie(idToken);
  redirect('/dashboard');
}

export async function logOutAction() {
  await clearSessionCookie();
  redirect('/auth/login');
}
