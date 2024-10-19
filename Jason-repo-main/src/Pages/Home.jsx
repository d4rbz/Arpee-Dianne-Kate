import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import LoginOverlay from "../Components/LoginOverlay"; // Import the LoginOverlay
import { auth } from '../Firebase/Firebase'; // Import Firebase auth
import { onAuthStateChanged } from "firebase/auth"; // Import authentication state listener

// Import images
import slide2 from "../Assets/Images/slide-2.jpg";
import slide3 from "../Assets/Images/slide-3.jpg";
import slide4 from "../Assets/Images/slide-4.jpg";
import slide5 from "../Assets/Images/slide-5.jpg";
import slide6 from "../Assets/Images/slide-6.jpg";
import slide7 from "../Assets/Images/slide-7.jpg";
import slide8 from "../Assets/Images/slide-8.jpg";
import slide9 from "../Assets/Images/slide-9.jpg";
import slide10 from "../Assets/Images/slide-10.jpg";
import slide11 from "../Assets/Images/slide-11.jpg";
import slide12 from "../Assets/Images/slide-12.jpg";
import slide13 from "../Assets/Images/slide-13.jpg";
import slide14 from "../Assets/Images/slide-14.jpg";
import slide15 from "../Assets/Images/slide-15.jpg";
import slide16 from "../Assets/Images/slide-16.jpg";
import slide17 from "../Assets/Images/slide-17.jpg";
import slide18 from "../Assets/Images/slide-18.jpg";
import slide19 from "../Assets/Images/slide-19.jpg";
import slide20 from "../Assets/Images/slide-20.jpg";

const slides = [
  slide2, slide3, slide4, slide5, slide6, slide7, slide8,
  slide9, slide10, slide11, slide12, slide13, slide14, slide15, slide16,
  slide17, slide18, slide19, slide20,
];

function getRandomScale() {
  return Math.random() * 0.1 + 1; // Random scale between 1 and 1.1
}

function getRandomIndex(currentIndex) {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * slides.length); // Random index
  } while (newIndex === currentIndex); // Ensure it’s not the same slide
  return newIndex;
}

function HomePage() {
  const [index, setIndex] = useState(0);
  const [zoomScale, setZoomScale] = useState(1); // Initial zoom scale
  const [isOpen, setIsOpen] = useState(false); // State for overlay

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => getRandomIndex(prevIndex)); // Random slide
      setZoomScale(getRandomScale()); // Random zoom
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Check if the user is authenticated
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is logged in:", user.email); // Log user email
        // User is authenticated, redirect to the Dashboard
        window.location.href = '/dashboard'; // Redirect to the Dashboard page
      } else {
        console.log("No user is logged in."); // Log that no user is authenticated
      }
    });

    return () => unsubscribe(); // Clean up subscription on unmount
  }, []);

  const fadeZoomAnimation = {
    initial: { opacity: 0, scale: zoomScale }, // Start with low opacity and random scale
    animate: { opacity: 1, scale: 1 }, // Fade in and zoom back to normal
    exit: { opacity: 0, scale: zoomScale }, // Fade out and zoom out
    transition: { duration: 2, ease: "easeInOut" }, // Smooth transition with easing
  };

  const textAnimation = {
    hidden: { opacity: 0, y: 50 }, // Start off-screen
    visible: { opacity: 1, y: 0 }, // Fade in and move up
  };

  const hoverEffect = { scale: 1.05, transition: { duration: 0.3 } }; // Subtle hover effect

  // Function to open the overlay
  const handleOpen = () => {
    setIsOpen(true);
  };

  // Function to close the overlay
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-transparent overflow-hidden">
      <div className="relative w-full h-full">
        <AnimatePresence>
          <motion.img
            key={index} // Change based on image index
            src={slides[index]} // Current image
            className="absolute top-0 left-0 w-full h-full object-cover"
            initial={fadeZoomAnimation.initial}
            animate={fadeZoomAnimation.animate}
            exit={fadeZoomAnimation.exit}
            transition={fadeZoomAnimation.transition}
          />
        </AnimatePresence>

        {/* Conditionally render text and button based on isOpen state */}
        {!isOpen && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-center leading-tight select-none"
              variants={textAnimation}
              initial="hidden"
              animate="visible"
              transition={{ duration: 1.2, ease: "easeOut" }}
              whileHover={hoverEffect}
            >
              API Integration
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl leading-relaxed text-center px-4 sm:px-8 mb-8 max-w-3xl select-none"
              variants={textAnimation}
              initial="hidden"
              animate="visible"
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            >
              This website demonstrates the seamless integration of APIs.<br />
              <span className="font-medium">
                Created by the minds of Jason Salutem, Russell Platero, and Arjaeh Sonza.
              </span>
            </motion.p>
            <motion.button
              className="px-6 py-3 bg-white text-black rounded-lg shadow-md hover:bg-gray-300 transition select-none"
              whileHover={hoverEffect}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpen} // Open overlay on click
              whileFocus={hoverEffect} // Add focus animation
            >
              Get Started
            </motion.button>
          </div>
        )}

        {/* Include the LoginOverlay component */}
        <LoginOverlay isOpen={isOpen} handleClose={handleClose} />
      </div>
    </div>
  );
}

export default HomePage;
