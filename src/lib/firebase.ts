
'use server';

import * as admin from 'firebase-admin';
import { cookies } from 'next/headers';

async function getFirebaseServerAdmin() {
    if (admin.apps.length > 0) {
        return admin.app();
    }

    // Directly use the credentials to ensure initialization
    const serviceAccount: admin.ServiceAccount = {
        projectId: "studio-9900367850-c4e98",
        clientEmail: "firebase-adminsdk-d3esk@studio-9900367850-c4e98.iam.gserviceaccount.com",
        // The private key is provided directly.
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAPaV0gK4LgqV4u7X\nncXgS/PqOQ07F8181y5v+XbIq/+7qE2zYvJ8VfM2b8C/uQ1yJ9z9b8e2b8c9b9H8v\n7e2b8c9b9H8v7e2b8c9b9H8v7e2b8c9b9H8v7e2b8c9b9H8v7e2b8c9b9H8v\n7e2b8c9b9H8v7e2b8c9b9H8v7e2b8c9b9H8v7e2b8c9b9H8v7e2b8c9b9H8v\n7e2b8c9b9H8v7e2b8c9b9H8v7e2b8c9b9H8v7e2b8c9b9H8v7e2b8c9b9H8v\nAgMBAAECgYEA7Z+5+4v/7b/3/9/v/v/v/+/+/+/v/v/v/v/v/v/v/v/v/v/v\n/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v\n/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v\nv/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v\n/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v\n/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v\n/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v/v\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n'),
    };

    try {
        return admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } catch (error: any) {
        console.error("Error initializing Firebase Admin SDK:", error.message);
        throw new Error("Failed to initialize Firebase Admin SDK with hardcoded credentials.");
    }
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
