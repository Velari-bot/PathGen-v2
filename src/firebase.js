// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFgSu6wi7g8PdYsehdI6Ffu0P-DQrt85w",
  authDomain: "pathgen-a771b.firebaseapp.com",
  projectId: "pathgen-a771b",
  storageBucket: "pathgen-a771b.firebasestorage.app",
  messagingSenderId: "198536194398",
  appId: "1:198536194398:web:58627d3c8c204bcd7f47cf",
  measurementId: "G-J66PJYKTVQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
