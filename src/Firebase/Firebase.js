// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, RecaptchaVerifier } from 'firebase/auth'; // Import RecaptchaVerifier

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

// Initialize Firebase Authentication and set up Google Auth Provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Function to set up the reCAPTCHA verifier (for phone number login)
const setupRecaptcha = (containerId) => {
  window.recaptchaVerifier = new RecaptchaVerifier(containerId, {
    'size': 'invisible',
    'callback': (response) => {
      // reCAPTCHA solved - allow user to proceed with phone number authentication
      console.log("reCAPTCHA solved");
    },
    'expired-callback': () => {
      // Handle reCAPTCHA expiration
      console.log("reCAPTCHA expired");
    }
  }, auth);
};

// Export the authentication objects and reCAPTCHA setup
export { auth, provider, setupRecaptcha };
