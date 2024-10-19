// src/Dashboard.js
import React, { useEffect } from 'react';
import { auth } from '../Firebase/Firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth'; // Import signOut
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Dashboard = () => {
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    // Check authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is authenticated:", user); // Log authenticated user info
      } else {
        console.log("User is not authenticated"); // Log if user is not authenticated
        navigate('/'); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe(); // Clean up the subscription on unmount
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      console.log("User has logged out"); // Log logout event
      navigate('/'); // Redirect to login page after logout
    } catch (error) {
      console.error("Error signing out: ", error); // Log any errors
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Dashboard!</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
