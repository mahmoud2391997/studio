'use server';

import * as admin from 'firebase-admin';
import { cookies } from 'next/headers';

const serviceAccount: admin.ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

async function getFirebaseServerAdmin() {
    if (admin.apps.length > 0) {
        return admin.app();
    }
    return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}


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

export { getFirebaseServerAdmin, createSessionCookie, clearSessionCookie };
