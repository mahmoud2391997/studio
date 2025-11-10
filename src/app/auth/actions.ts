'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getFirebaseServerAdmin } from '@/lib/firebase';
import { cookies } from 'next/headers';

async function createSessionCookie(idToken: string) {
    const adminApp = await getFirebaseServerAdmin();
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    
    const sessionCookie = await adminApp.auth().createSessionCookie(idToken, { expiresIn });
    
    cookies().set('__session', sessionCookie, {
        maxAge: expiresIn,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    });
}

async function clearSessionCookie() {
    cookies().delete('__session');
}


export async function signUpAction(data: any) {
  try {
    const adminApp = await getFirebaseServerAdmin();
    const userRecord = await adminApp.auth().createUser({
      email: data.email,
      password: data.password,
      displayName: data.profileName,
    });
    
    const customToken = await adminApp.auth().createCustomToken(userRecord.uid);
    // This custom token can be sent to the client to sign in.
    // However, for server actions, we create a session cookie directly.
    
    // We can't get the idToken on the server directly after user creation.
    // A common pattern is to redirect the user to a page that uses the custom token
    // to sign in on the client, gets the idToken, and then calls another server action
    // to create the session.
    // For simplicity here, we'll assume a client-side step would handle this.
    // A full implementation would require a client-side call to signInWithCustomToken.
    
    // The following is a placeholder for where you'd create user profile in Firestore
    await adminApp.firestore().collection('users').doc(userRecord.uid).set({
        id: userRecord.uid,
        email: userRecord.email,
        profileName: data.profileName,
        registrationDate: new Date().toISOString(),
    });

  } catch (error: any) {
    return { error: error.message };
  }
  redirect('/auth/login?email=' + data.email);
}

export async function logInAction(data: any) {
    // This is a placeholder. The client will get an idToken upon successful login.
    // That token must be sent to the server to create a session cookie.
    // The call to createSessionCookie would happen in an API route or server action
    // that receives the idToken from the client.
    // For this example, we'll simulate it. This won't work as is.
    // You need a client-side step.
}

export async function createSessionAction(idToken: string) {
    'use server';
    await createSessionCookie(idToken);
    revalidatePath('/');
    redirect('/dashboard');
}


export async function signOutAction() {
  'use server';
  await clearSessionCookie();
  revalidatePath('/');
  redirect('/');
}
