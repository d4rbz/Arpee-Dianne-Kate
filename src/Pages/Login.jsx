// src/Login.js
import React, { useEffect } from 'react';
import { auth, provider } from '../Firebase/Firebase';
import { signInWithPopup } from 'firebase/auth';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

const Login = () => {
  const navigate = useNavigate(); // Initialize navigate

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is authenticated:", user);
        navigate('/dashboard'); // Redirect to dashboard if authenticated
      } else {
        console.log("User is not authenticated");
      }
    });

    return () => unsubscribe(); // Clean up the subscription on unmount
  }, [navigate]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      // The authentication state change will handle the redirection
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      // Animate the background gradient change
      style={{
        background: 'linear-gradient(270deg, #4c51bf, #d53f8c, #e53e3e)',
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite'
      }}
    >
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Login with Google
        </button>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Login;
