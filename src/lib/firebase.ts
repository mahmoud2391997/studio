
'use server';

import * as admin from 'firebase-admin';
import { cookies } from 'next/headers';
import { firebaseConfig } from '@/firebase/config';

async function getFirebaseServerAdmin() {
    if (admin.apps.length > 0) {
        return admin.app();
    }

    try {
        const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
        
        if (!privateKey || !process.env.FIREBASE_CLIENT_EMAIL) {
            console.warn("Firebase Admin SDK credentials are not fully set in .env.local. Using a simplified initialization. This is not secure and for prototyping only.");
            return admin.initializeApp({
                projectId: firebaseConfig.projectId,
            });
        }
        
        const serviceAccount: admin.ServiceAccount = {
            projectId: firebaseConfig.projectId,
            privateKey,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        };

        return admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } catch (error: any) {
        console.error("Error initializing Firebase Admin SDK:", error.message);
        throw new Error("Failed to initialize Firebase Admin SDK. Ensure FIREBASE_PRIVATE_KEY and FIREBASE_CLIENT_EMAIL are set correctly in .env.local");
    }
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
      
      if (process.env.NODE_ENV !== 'production') {
        console.log("Setting a mock session cookie for development as a fallback.");
        cookies().set('__session', 'mock-session-cookie-for-dev', {
          maxAge: expiresIn,
          httpOnly: true,
          secure: false,
          path: '/',
        });
      } else {
        // In production, re-throw or handle the error appropriately
        throw error;
      }
    }
}

async function clearSessionCookie() {
    cookies().delete('__session');
}

export { getFirebaseServerAdmin, createSessionCookie, clearSessionCookie };
