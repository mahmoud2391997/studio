'use server';

import * as admin from 'firebase-admin';
import { cookies } from 'next/headers';
import { firebaseConfig } from '@/firebase/config';

// This is a temporary and insecure way to load credentials for prototyping.
// In a production environment, you should use a secure secret management service.
const serviceAccount: admin.ServiceAccount = {
  projectId: firebaseConfig.projectId,
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

async function getFirebaseServerAdmin() {
    if (admin.apps.length > 0) {
        return admin.app();
    }
    
    // Fallback for when private key or client email are missing.
    // This is NOT secure for production.
    if (!serviceAccount.privateKey || !serviceAccount.clientEmail) {
      console.warn("Firebase Admin SDK credentials are not fully set. Using a simplified initialization. This is not secure and for prototyping only.");
      return admin.initializeApp({
        projectId: serviceAccount.projectId
      });
    }

    return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}


async function createSessionCookie(idToken: string) {
    const adminApp = await getFirebaseServerAdmin();
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    
    try {
      const sessionCookie = await adminApp.auth().createSessionCookie(idToken, { expiresIn });
      
      cookies().set('__session', sessionCookie, {
        maxAge: expiresIn,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });
    } catch (error) {
      console.error("Error creating session cookie. This might be due to incomplete Admin SDK credentials. You can set them in .env.local", error);
      // For prototyping, we can set a mock cookie if the admin SDK fails.
      // This is insecure and should NOT be used in production.
      if (process.env.NODE_ENV !== 'production') {
        console.log("Setting a mock session cookie for development.");
        cookies().set('__session', 'mock-session-cookie-for-dev', {
          maxAge: expiresIn,
          httpOnly: true,
          secure: false,
          path: '/',
        });
      }
    }
}

async function clearSessionCookie() {
    cookies().delete('__session');
}

export { getFirebaseServerAdmin, createSessionCookie, clearSessionCookie };
