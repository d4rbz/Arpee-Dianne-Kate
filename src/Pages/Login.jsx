// src/Login.js
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaGoogle } from 'react-icons/fa'; // Importing icons
import { auth, provider } from '../Firebase/Firebase'; // Import your Firebase setup
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth'; // Import necessary functions
import { useNavigate } from 'react-router-dom'; // For navigation

const Login = () => {
  const [gradientIndex, setGradientIndex] = useState(0); // Track current gradient index
  const navigate = useNavigate(); // Initialize navigate

  // Define an array of gradient colors
  const gradients = [
    'linear-gradient(270deg, #4c51bf, #d53f8c)',
    'linear-gradient(270deg, #e53e3e, #4caf50)',
    'linear-gradient(270deg, #38b2ac, #805ad5)',
    'linear-gradient(270deg, #f6e05e, #fbd38d)',
  ];

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

  // Function to change the gradient color every second
  useEffect(() => {
    const interval = setInterval(() => {
      setGradientIndex((prevIndex) => (prevIndex + 1) % gradients.length);
    }, 1000); // Change gradient every second

    return () => clearInterval(interval); // Clean up on unmount
  }, [gradients.length]);

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Left Section with Gradient Background */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 3 }}
        className="hidden lg:flex w-1/2 h-full justify-center items-center"
      >
        {/* Gradient background with smooth transition */}
        <motion.div
          className="h-full w-full"
          style={{
            background: gradients[gradientIndex], // Use the current gradient
          }}
          animate={{
            background: gradients[gradientIndex],
          }}
          transition={{
            duration: 1, // Smooth transition effect
            ease: 'easeInOut',
          }}
        >
        </motion.div>
      </motion.div>

      {/* Right Section with Social Login */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 h-full bg-white">
        {/* Motion animation for form container */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-full max-w-md"
        >
          <h1 className="text-3xl font-bold mb-6 text-center">Welcome Back 👋</h1>
          <p className="text-gray-500 mb-6 text-center">
            Today is a new day. It’s your day. You shape it. Sign in to start managing your projects.
          </p>

          {/* Social Login */}
          <div className="flex flex-col space-y-4">
            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center border py-2 rounded-lg hover:bg-gray-100 transition duration-200"
            >
              <FaGoogle className="text-red-500 mr-2" /> Sign in with Google
            </button>
            {/* Facebook button can be added here if needed */}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
