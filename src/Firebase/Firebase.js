// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnl5_Nx9kAwFfDJDGw54uT0AybPtOOCto",
  authDomain: "arpee-dianne-kate.firebaseapp.com",
  projectId: "arpee-dianne-kate",
  storageBucket: "arpee-dianne-kate.appspot.com",
  messagingSenderId: "899039032220",
  appId: "1:899039032220:web:66ad1c8d4e9fedfb79ce59"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };