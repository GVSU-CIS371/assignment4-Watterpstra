import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Replace the following with YOUR OWN Firebase project config
// From the Firebase Console: Project Settings -> General -> Your apps -> SDK setup and configuration
// Import the functions you need from the SDKs you need
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtoAStmGHojZSEUZqyJ1Ec3SRfGtqAuF0",
  authDomain: "beverageshop-1068c.firebaseapp.com",
  projectId: "beverageshop-1068c",
  storageBucket: "beverageshop-1068c.firebasestorage.app",
  messagingSenderId: "804644833801",
  appId: "1:804644833801:web:3185a2945c83c10f8b86d8",
  measurementId: "G-E2TMKDY3EK"
};

// Initialize Firebase
//const analytics = getAnalytics(app);
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
