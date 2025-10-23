import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCi0E0E0rK1awSUTsoqI5p6g_6Ug_EBxKs",
  authDomain: "pathgen-v2.firebaseapp.com",
  projectId: "pathgen-v2",
  storageBucket: "pathgen-v2.firebasestorage.app",
  messagingSenderId: "64409929315",
  appId: "1:64409929315:web:a8fefd3bcb7749ef6b1a56",
  measurementId: "G-JWC8N4H6FL"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

