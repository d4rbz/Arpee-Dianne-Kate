import React, { useState, useEffect } from 'react';
import { AiOutlineMail, AiOutlineLock, AiOutlineClose, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // Import icons
import { motion, AnimatePresence } from "framer-motion"; // For animations
import { auth } from '../Firebase/Firebase'; // Import your Firebase auth
import { signInWithEmailAndPassword } from "firebase/auth"; // Import the sign-in function
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import JasonLogo from "../Assets/Developers/Jason.png";
import RussellLogo from "../Assets/Developers/Russell.png";
import ArjaehLogo from "../Assets/Developers/Arjaeh.png";

// Array of logos
const logos = [JasonLogo, RussellLogo, ArjaehLogo];

// Function to get a random logo index
function getRandomIndex(currentIndex) {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * logos.length); // Random index between 0 and 2
  } while (newIndex === currentIndex); // Ensure it’s not the same logo
  return newIndex;
}

const LoginOverlay = ({ isOpen, handleClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [logoIndex, setLogoIndex] = useState(0); // State for rotating logos
  const navigate = useNavigate(); // Hook for redirection

  useEffect(() => {
    const interval = setInterval(() => {
      setLogoIndex((prevIndex) => getRandomIndex(prevIndex)); // Change logo every 5 seconds
    }, 5000);

    return () => clearInterval(interval); // Clear interval when component unmounts
  }, []);

  // Validation function for the inputs
  const validateInput = () => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
      return "Invalid email format.";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    return null;
  };

  // Add state for showing password
  const [showPassword, setShowPassword] = useState(false);

  // Sign-in function
  const handleSignIn = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const validationError = validateInput();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); // Redirect to Dashboard on successful sign-in
    } catch (err) {
      setError(err.message); // Set error message
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
        <div className="relative bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
          {/* Enhanced Close Button */}
          <motion.button
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={handleClose}
            aria-label="Close"
            whileHover={{ scale: 1.1, rotate: 90, transition: { duration: 0.3 } }} // Scale and rotate on hover
            whileTap={{ scale: 0.95, transition: { duration: 0.1 } }} // Slight shrink on tap
          >
            <AiOutlineClose size={24} />
          </motion.button>

          {/* Rotating logo with animation */}
          <div className="flex justify-center mb-6">
            <AnimatePresence mode="wait"> {/* Use mode="wait" */}
              <motion.img
                key={logoIndex} // Re-render on logo change
                src={logos[logoIndex]} // Dynamic logo source
                className="w-32 h-32 object-contain rounded-full shadow-md select-none pointer-events-none" // Make the logo unselectable and unclickable
                draggable="false" // Prevent dragging the image
                initial={{ opacity: 0, scale: 0.85 }} // Slightly smaller at the start
                animate={{ opacity: 1, scale: 1 }} // Full size and visible
                exit={{ opacity: 0, scale: 0.85 }} // Fade out and shrink slightly
                transition={{ duration: 2, ease: [0.42, 0, 0.58, 1] }} // Smoother easing curve for fluidity
                style={{ userSelect: 'none' }} // Disable text selection for the logo
              />
            </AnimatePresence>
          </div>

          {/* Title and Description (Unselectable) */}
          <div className="text-center mb-6 select-none">
            <h2 className="text-2xl font-semibold text-gray-800">Welcome</h2>
            <p className="text-gray-600 mt-2">Please sign in to continue.</p>
          </div>

          {/* Display error message if exists */}
          {error && (
            <div className="mb-4 text-red-500 text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="mt-4" onSubmit={handleSignIn}>
            {/* Email field with icon */}
            <div className="mb-4 relative">
              <label className="block text-gray-700 select-none">Email</label>
              <div className="flex items-center border rounded-lg mt-1 focus-within:ring-2 focus-within:ring-orange-500">
                <AiOutlineMail className="ml-3 text-gray-500" />
                <input
                  type="email"
                  className="w-full px-4 py-2 outline-none focus:ring-0"
                  placeholder="Enter your email"
                  maxLength={50} // Character limit
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password field with reveal functionality */}
            <div className="mb-4 relative">
              <label className="block text-gray-700 select-none">Password</label>
              <div className="flex items-center border rounded-lg mt-1 focus-within:ring-2 focus-within:ring-orange-500">
                <AiOutlineLock className="ml-3 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"} // Toggle between text and password
                  className="w-full px-4 py-2 outline-none focus:ring-0"
                  placeholder="Enter your password"
                  maxLength={30} // Character limit
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button" // Prevent form submission
                  className="absolute right-3"
                  onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                  aria-label={showPassword ? "Hide password" : "Show password"} // Accessibility
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className="text-gray-500" />
                  ) : (
                    <AiOutlineEye className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign-in button with hover animation */}
            <motion.button
              className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-200 focus:outline-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
            >
              Sign in
            </motion.button>
          </form>
        </div>
      </div>
    )
  );
};

export default LoginOverlay;
