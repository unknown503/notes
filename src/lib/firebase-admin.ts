import "server-only";
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_PROJECTID,
    clientEmail: process.env.CLIENTEMAIL,
    privateKey: process.env.PRIVATEKEY?.replace(/\\n/g, "\n"),
  })
}

if (!getApps().length) {
  initializeApp(firebaseAdminConfig);
}

export const db = getFirestore();
export const adminAuth = getAuth();