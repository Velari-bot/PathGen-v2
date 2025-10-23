import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
let db = null;

export function initializeFirestore() {
  try {
    // Check if service account key is provided
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (serviceAccountPath) {
      // Initialize with service account
      const serviceAccount = JSON.parse(serviceAccountPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'pathgen-v2.firebasestorage.app'
      });
    } else {
      // Initialize with project ID only (for development)
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'pathgen-v2',
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'pathgen-v2.firebasestorage.app'
      });
    }

    db = admin.firestore();
    console.log('✓ Firestore initialized');
    return db;
  } catch (error) {
    console.error('❌ Failed to initialize Firestore:', error.message);
    // Return null db, allowing the app to run without Firestore
    return null;
  }
}

export function getFirestore() {
  if (!db) {
    db = initializeFirestore();
  }
  return db;
}

export default { initializeFirestore, getFirestore };

