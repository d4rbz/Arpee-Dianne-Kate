// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Use the correct import path
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNA6CzCNV0H5xQBWCDWCieIxtgdL3G-Do",
  authDomain: "jason-c8b67.firebaseapp.com",
  projectId: "jason-c8b67",
  storageBucket: "jason-c8b67.appspot.com",
  messagingSenderId: "202975512064",
  appId: "1:202975512064:web:dc99ee002ab542a2b37ae5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app); // Use the new modular syntax
const auth = getAuth(app);

export { auth, firestore };
