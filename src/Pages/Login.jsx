// src/Login.js
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaGoogle } from 'react-icons/fa'; // Importing icons
import { auth, provider } from '../Firebase/Firebase'; // Import your Firebase setup
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth'; // Import necessary functions
import { useNavigate } from 'react-router-dom'; // For navigation

// Import developer images
import arpee from '../Assets/arpee1.jpg';
import dianne from '../Assets/dianne1.jpg';
import kate from '../Assets/kate1.jpg';

const developers = [
  { name: 'Arpee Fermin Villasis', image: arpee },
  { name: 'Dianne Paghasian', image: dianne },
  { name: 'Kate Angelica Sorima', image: kate },
];

const Login = () => {
  const [gradientIndex, setGradientIndex] = useState(0); // Track current gradient index
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // Mouse position state
  const [hoveredDev, setHoveredDev] = useState(null); // Track which developer is hovered
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

  // Update mouse position
  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  // Show name overlay on hover
  const handleMouseEnter = (index) => {
    setHoveredDev(index);
  };

  const handleMouseLeave = () => {
    setHoveredDev(null);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen" onMouseMove={handleMouseMove}>
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
        />
      </motion.div>

      {/* Right Section with Social Login */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 h-full bg-white p-6 sm:p-8 md:p-10 lg:p-12">
        {/* Motion animation for form container */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-full max-w-md"
        >
          <h1 className="text-2xl lg:text-3xl font-bold mb-4 text-center">Welcome👋</h1>
          <p className="text-gray-500 mb-6 text-center text-sm sm:text-base lg:text-lg">
            This website provides an in-depth demonstration of API integration.
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

        {/* Developer Icons Section */}
        <div className="flex flex-col items-center mt-8">
          <div className="flex space-x-4">
            {developers.map((dev, index) => (
              <motion.div
                key={index}
                className="relative group"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }} // Staggered entrance
              >
                <motion.img
                  src={dev.image}
                  alt={dev.name}
                  className="w-16 h-16 rounded-full border-2 border-gray-300 transition-transform duration-200 ease-in-out transform group-hover:scale-110"
                />
              </motion.div>
            ))}
          </div>

          {/* Name overlay */}
          {hoveredDev !== null && (
            <motion.div
              className="absolute bg-white text-black p-2 rounded shadow-lg"
              style={{
                top: mousePosition.y + 20, // Adjust position below the mouse
                left: mousePosition.x + 10, // Slightly to the right of the mouse
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {developers[hoveredDev].name}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
